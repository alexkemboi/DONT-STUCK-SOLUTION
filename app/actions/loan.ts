"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import {
  createLoanApplication,
  addGuarantor,
  getLoansByClientId,
  getLoanById,
  getFullLoanById,
  getAllLoans,
  updateLoanStatus,
  updateGuarantorStatus,
  type LoanWithClient,
} from "@/services/loan.service";
import { generateRepaymentSchedule } from "@/services/repayment-schedule.service";
import { revalidatePath } from "next/cache";
import type { LoanApplicationSubmitData } from "@/lib/types";

export async function submitLoanApplicationAction(data: LoanApplicationSubmitData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { client: true },
    });

    if (!user?.client) {
      return { success: false, error: "Client profile not found. Please complete your profile first." };
    }

    const clientId = user.client.id;

    const loanResult = await createLoanApplication({
      clientId,
      purpose: data.purpose,
      amountRequested: data.amountRequested,
      repaymentPeriod: data.repaymentPeriod,
      paymentFrequency: data.paymentFrequency,
    });

    if (!loanResult.success || !loanResult.data) {
      return { success: false, error: loanResult.error || "Failed to create loan application" };
    }

    const loanId = loanResult.data.id;

    const guarantorResults = [];
    for (const guarantor of data.guarantors) {
      const result = await addGuarantor({
        loanId,
        fullName: guarantor.fullName,
        phone: guarantor.phone,
        email: guarantor.email || undefined,
        idNumber: guarantor.idNumber || undefined,
        relationship: guarantor.relationship || undefined,
      });
      guarantorResults.push(result);
    }

    await prisma.auditLog.create({
      data: {
        userId: session.user.id as string,
        action: "CREATE",
        entity: "LoanApplication",
        entityId: loanId,
        newValue: { purpose: data.purpose, amountRequested: data.amountRequested, repaymentPeriod: data.repaymentPeriod, guarantors: data.guarantors.length },
      },
    }).catch(() => {});

    return {
      success: true,
      data: {
        loanId,
        guarantorsAdded: guarantorResults.filter((r) => r.success).length,
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getClientLoansAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { client: true },
    });

    if (!user?.client) {
      return { success: false, data: [] };
    }

    const result = await getLoansByClientId(user.client.id);
    return { success: true, data: result.data || [] };
  } catch (error) {
    return { success: false, error: (error as Error).message, data: [] };
  }
}

export async function getClientForApplyAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: {
        client: {
          select: {
            id: true,
            surname: true,
            otherNames: true,
            phoneMobile: true,
            idPassportNo: true,
            _count: {
              select: {
                employmentDetails: true,
                addresses: true,
              },
            },
          },
        },
      },
    });

    if (!user?.client) {
      return { success: false, error: "Client profile not found" };
    }

    const { _count, ...clientData } = user.client;

    const missingFields: string[] = [];
    if (!clientData.phoneMobile) missingFields.push("Mobile phone number");
    if (!clientData.idPassportNo) missingFields.push("ID / Passport number");
    if (_count.employmentDetails === 0) missingFields.push("Employment details");
    if (_count.addresses === 0) missingFields.push("Address information");

    const profileComplete = missingFields.length === 0;

    return {
      success: true,
      data: { id: clientData.id, surname: clientData.surname, otherNames: clientData.otherNames },
      profileComplete,
      missingFields,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export interface SerializedClientLoan {
  id: string;
  purpose: string;
  amountRequested: number;
  approvedAmount: number | null;
  interestRate: number;
  repaymentPeriod: number;
  status: string;
  qualificationType: string | null;
  appliedAt: string;
  rejectionReason: string | null;
  guarantors: {
    id: string;
    fullName: string;
    phone: string;
    email: string | null;
    relationship: string | null;
    confirmationStatus: string;
  }[];
}

export async function getClientLoanDetailAction(loanId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { client: true },
    });

    if (!user?.client) {
      return { success: false, error: "Client profile not found" };
    }

    const result = await getLoanById(loanId);
    if (!result.success || !result.data) {
      return { success: false, error: result.error || "Loan not found" };
    }

    // Ensure loan belongs to this client
    if (result.data.clientId !== user.client.id) {
      return { success: false, error: "Unauthorized" };
    }

    const loan = result.data;
    const serialized: SerializedClientLoan = {
      id: loan.id,
      purpose: loan.purpose,
      amountRequested: Number(loan.amountRequested),
      approvedAmount: loan.approvedAmount ? Number(loan.approvedAmount) : null,
      interestRate: Number(loan.interestRate),
      repaymentPeriod: loan.repaymentPeriod,
      status: loan.status,
      qualificationType: loan.qualificationType || null,
      appliedAt: loan.appliedAt.toISOString(),
      rejectionReason: loan.rejectionReason || null,
      guarantors: loan.guarantors.map((g) => ({
        id: g.id,
        fullName: g.fullName,
        phone: g.phone,
        email: g.email,
        relationship: g.relationship,
        confirmationStatus: g.confirmationStatus,
      })),
    };

    return { success: true, data: serialized };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// ADMIN ACTIONS
// ============================================================================

export interface SerializedLoan {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  purpose: string;
  amountRequested: number;
  approvedAmount: number | null;
  interestRate: number;
  repaymentPeriod: number;
  status: string;
  qualificationType: string | null;
  appliedAt: string;
  rejectionReason: string | null;
}

function serializeLoan(loan: LoanWithClient): SerializedLoan {
  return {
    id: loan.id,
    clientId: loan.clientId,
    clientName: `${loan.client.surname} ${loan.client.otherNames}`,
    clientPhone: loan.client.phoneMobile,
    purpose: loan.purpose,
    amountRequested: Number(loan.amountRequested),
    approvedAmount: loan.approvedAmount ? Number(loan.approvedAmount) : null,
    interestRate: Number(loan.interestRate),
    repaymentPeriod: loan.repaymentPeriod,
    status: loan.status,
    qualificationType: loan.qualificationType || null,
    appliedAt: loan.appliedAt.toISOString(),
    rejectionReason: loan.rejectionReason || null,
  };
}

export async function getAllLoansAction(): Promise<{
  success: boolean;
  data: SerializedLoan[];
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, data: [], error: "Unauthorized" };
    }

    const result = await getAllLoans();
    if (!result.success || !result.data) {
      return { success: false, data: [], error: result.error };
    }

    return { success: true, data: result.data.map(serializeLoan) };
  } catch (error) {
    return { success: false, data: [], error: (error as Error).message };
  }
}

export async function approveLoanAction(loanId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Business rule: check guarantor statuses before approving
    const guarantors = await prisma.guarantor.findMany({
      where: { loanId },
      select: { confirmationStatus: true },
    });

    const hasDeclinedGuarantor = guarantors.some(
      (g) => g.confirmationStatus === "Declined"
    );

    if (hasDeclinedGuarantor) {
      return {
        success: false,
        error: "Cannot approve loan: one or more guarantors have been declined",
      };
    }

    const result = await updateLoanStatus(
      loanId,
      "Approved",
      session.user.id as string
    );

    if (result.success) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id as string,
          action: "APPROVE",
          entity: "LoanApplication",
          entityId: loanId,
        },
      }).catch(() => {});
    }

    return { success: result.success, error: result.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function rejectLoanAction(loanId: string, reason: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await updateLoanStatus(
      loanId,
      "Rejected",
      session.user.id as string,
      reason
    );

    if (result.success) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id as string,
          action: "REJECT",
          entity: "LoanApplication",
          entityId: loanId,
          newValue: { reason },
        },
      }).catch(() => {});
    }

    return { success: result.success, error: result.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function disburseLoanAction(loanId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await updateLoanStatus(loanId, "Disbursed");

    if (result.success) {
      // Generate repayment schedule when loan is disbursed
      const scheduleResult = await generateRepaymentSchedule(loanId);
      if (!scheduleResult.success) {
        console.error("Failed to generate repayment schedule:", scheduleResult.error);
      }

      await prisma.auditLog.create({
        data: {
          userId: session.user.id as string,
          action: "DISBURSE",
          entity: "LoanApplication",
          entityId: loanId,
        },
      }).catch(() => {});

      revalidatePath(`/dss/admin/loans/${loanId}`);
      revalidatePath("/dss/admin/repayments");
    }

    return { success: result.success, error: result.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// ADMIN — LOAN DETAIL
// ============================================================================

export interface SerializedLoanDetail {
  id: string;
  clientId: string;
  purpose: string;
  amountRequested: number;
  approvedAmount: number | null;
  interestRate: number;
  repaymentPeriod: number;
  paymentFrequency: string;
  status: string;
  qualificationType: string | null;
  appliedAt: string;
  reviewedAt: string | null;
  approvedAt: string | null;
  startDate: string | null;
  rejectionReason: string | null;
  client: {
    id: string;
    surname: string;
    otherNames: string;
    phoneMobile: string;
    emailPersonal: string | null;
    idPassportNo: string;
    status: string;
  };
  guarantors: {
    id: string;
    fullName: string;
    phone: string;
    email: string | null;
    idNumber: string | null;
    relationship: string | null;
    confirmationStatus: string;
    confirmedAt: string | null;
  }[];
  documents: {
    id: string;
    documentType: string;
    fileName: string;
    filePath: string;
    uploadedAt: string;
  }[];
  financials: {
    processingFee: number;
    legalFee: number;
    penaltyFee: number;
    interestAmount: number;
  } | null;
  security: {
    idCopy: boolean;
    passportPhoto: boolean;
    appointmentLetter: boolean;
    payslips: boolean;
    bankStatement: boolean;
    chequeLeafNo: string | null;
  } | null;
  disbursement: {
    amount: number;
    method: string;
    reference: string | null;
    disbursedAt: string;
  } | null;
  repayments: {
    id: string;
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    category: string;
    reference: string | null;
  }[];
  reviewedBy: string | null;
  approvedBy: string | null;
}

export async function getAdminLoanDetailAction(loanId: string): Promise<{
  success: boolean;
  data?: SerializedLoanDetail;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { role: true },
    });

    if (user?.role !== "Admin") {
      return { success: false, error: "Admin access required" };
    }

    const result = await getFullLoanById(loanId);
    if (!result.success || !result.data) {
      return { success: false, error: result.error || "Loan not found" };
    }

    const loan = result.data;
    const serialized: SerializedLoanDetail = {
      id: loan.id,
      clientId: loan.clientId,
      purpose: loan.purpose,
      amountRequested: Number(loan.amountRequested),
      approvedAmount: loan.approvedAmount ? Number(loan.approvedAmount) : null,
      interestRate: Number(loan.interestRate),
      repaymentPeriod: loan.repaymentPeriod,
      paymentFrequency: loan.paymentFrequency,
      status: loan.status,
      qualificationType: loan.qualificationType || null,
      appliedAt: loan.appliedAt.toISOString(),
      reviewedAt: loan.reviewedAt?.toISOString() || null,
      approvedAt: loan.approvedAt?.toISOString() || null,
      startDate: loan.startDate?.toISOString() || null,
      rejectionReason: loan.rejectionReason || null,
      client: loan.client,
      guarantors: loan.guarantors.map((g) => ({
        id: g.id,
        fullName: g.fullName,
        phone: g.phone,
        email: g.email,
        idNumber: g.idNumber,
        relationship: g.relationship,
        confirmationStatus: g.confirmationStatus,
        confirmedAt: g.confirmedAt?.toISOString() || null,
      })),
      documents: loan.documents.map((d) => ({
        id: d.id,
        documentType: d.documentType,
        fileName: d.fileName,
        filePath: d.filePath,
        uploadedAt: d.uploadedAt.toISOString(),
      })),
      financials: loan.financials
        ? {
            processingFee: Number(loan.financials.processingFee),
            legalFee: Number(loan.financials.legalFee),
            penaltyFee: Number(loan.financials.penaltyFee),
            interestAmount: Number(loan.financials.interestAmount),
          }
        : null,
      security: loan.security || null,
      disbursement: loan.disbursement
        ? {
            amount: Number(loan.disbursement.amount),
            method: loan.disbursement.method,
            reference: loan.disbursement.reference,
            disbursedAt: loan.disbursement.disbursedAt.toISOString(),
          }
        : null,
      repayments: loan.repayments.map((r) => ({
        id: r.id,
        amount: Number(r.amount),
        paymentMethod: r.paymentMethod,
        paymentDate: r.paymentDate.toISOString(),
        category: r.category,
        reference: r.reference,
      })),
      reviewedBy: loan.reviewedBy?.name || null,
      approvedBy: loan.approvedBy?.name || null,
    };

    return { success: true, data: serialized };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// ADMIN — GUARANTOR STATUS
// ============================================================================

export async function updateGuarantorStatusAction(
  guarantorId: string,
  status: "Confirmed" | "Declined"
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { role: true },
    });

    if (user?.role !== "Admin") {
      return { success: false, error: "Admin access required" };
    }

    const result = await updateGuarantorStatus(guarantorId, status);
    if (!result.success) {
      return { success: false, error: result.error || "Failed to update guarantor status" };
    }

    await prisma.auditLog.create({
      data: {
        userId: session.user.id as string,
        action: status === "Confirmed" ? "CONFIRM" : "DECLINE",
        entity: "Guarantor",
        entityId: guarantorId,
        newValue: { status },
      },
    }).catch(() => {});

    const guarantor = result.data;
    if (guarantor) {
      revalidatePath(`/dss/admin/loans/${guarantor.loanId}`);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
