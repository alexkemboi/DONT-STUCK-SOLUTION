"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============================================================================
// TYPES
// ============================================================================

export interface SerializedStaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

// ============================================================================
// ADMIN CHECK HELPER
// ============================================================================

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    select: { role: true, id: true },
  });

  if (user?.role !== "Admin") {
    throw new Error("Admin access required");
  }

  return { userId: session.user.id as string };
}

// ============================================================================
// GET ALL STAFF
// ============================================================================

export async function getStaffUsersAction(): Promise<{
  success: boolean;
  data: SerializedStaffUser[];
  error?: string;
}> {
  try {
    await requireAdmin();

    const staff = await prisma.user.findMany({
      where: {
        role: { not: "Client" },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const serialized: SerializedStaffUser[] = staff.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      isActive: u.isActive,
      createdAt: u.createdAt.toISOString(),
    }));

    return { success: true, data: serialized };
  } catch (error) {
    return { success: false, data: [], error: (error as Error).message };
  }
}

// ============================================================================
// CREATE STAFF USER
// ============================================================================

export async function createStaffUserAction(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await requireAdmin();

    const validRoles = ["Admin", "LoanOfficer", "Investor", "RecoveryAgent"];
    if (!validRoles.includes(data.role)) {
      return { success: false, error: "Invalid role" };
    }

    // Create user via better-auth
    const newUser = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });

    if (!newUser?.user?.id) {
      return { success: false, error: "Failed to create user account" };
    }

    // Update role (better-auth defaults to Client)
    await prisma.user.update({
      where: { id: newUser.user.id },
      data: { role: data.role as any },
    });

    await prisma.auditLog
      .create({
        data: {
          userId,
          action: "CREATE",
          entity: "User",
          entityId: newUser.user.id,
          newValue: { name: data.name, email: data.email, role: data.role },
        },
      })
      .catch(() => {});

    revalidatePath("/dss/admin/staff");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// UPDATE STAFF USER
// ============================================================================

export async function updateStaffUserAction(
  id: string,
  data: { name?: string; email?: string; phone?: string; role?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await requireAdmin();

    // Prevent self-demotion
    if (id === userId && data.role && data.role !== "Admin") {
      return { success: false, error: "Cannot change your own role" };
    }

    if (data.role) {
      const validRoles = ["Admin", "LoanOfficer", "Investor", "RecoveryAgent"];
      if (!validRoles.includes(data.role)) {
        return { success: false, error: "Invalid role" };
      }
    }

    const updateData: Record<string, unknown> = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.role) updateData.role = data.role;

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog
      .create({
        data: {
          userId,
          action: "UPDATE",
          entity: "User",
          entityId: id,
          newValue: data as object,
        },
      })
      .catch(() => {});

    revalidatePath("/dss/admin/staff");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// TOGGLE ACTIVE STATUS
// ============================================================================

export async function toggleStaffActiveAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await requireAdmin();

    if (id === userId) {
      return { success: false, error: "Cannot deactivate your own account" };
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    await prisma.auditLog
      .create({
        data: {
          userId,
          action: user.isActive ? "DEACTIVATE" : "ACTIVATE",
          entity: "User",
          entityId: id,
        },
      })
      .catch(() => {});

    revalidatePath("/dss/admin/staff");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// DELETE STAFF USER
// ============================================================================

export async function deleteStaffUserAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await requireAdmin();

    if (id === userId) {
      return { success: false, error: "Cannot delete your own account" };
    }

    // Delete related records first
    await prisma.session.deleteMany({ where: { userId: id } });
    await prisma.account.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    await prisma.auditLog
      .create({
        data: {
          userId,
          action: "DELETE",
          entity: "User",
          entityId: id,
        },
      })
      .catch(() => {});

    revalidatePath("/dss/admin/staff");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
