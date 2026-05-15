import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET SINGLE ACCOUNT
 */
export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {

    const { id } = await params;

    const account = await prisma.chartOfAccount.findUnique({
      where: {
        id,
      },
    });

    if (!account) {
      return NextResponse.json(
        {
          error: "Account not found",
        },
        {
          status: 404,
        }
      );
    }

return NextResponse.json({
  gl_account_id: account.id,
  account_code: account.accountCode,
  account_name: account.accountName,
  account_type: account.accountType,
  parent_account_id: account.parentAccountId,
  normal_balance: account.normalBalance,
  opening_balance: 0,
  is_active: account.isActive,
  created_at: account.createdAt,
});

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch account",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * UPDATE ACCOUNT
 */
export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {

    const { id } = await params;

    const body = await request.json();

    const updated =
      await prisma.chartOfAccount.update({
        where: {
          id,
        },

        data: {
          accountCode: body.account_code,
          accountName: body.account_name,
          accountType: body.account_type,
          parentAccountId:
            body.parent_account_id || null,
          normalBalance: body.normal_balance,
          isActive: body.is_active,
        },
      });

   return NextResponse.json({
  gl_account_id: updated.id,
  account_code: updated.accountCode,
  account_name: updated.accountName,
  account_type: updated.accountType,
  parent_account_id: updated.parentAccountId,
  normal_balance: updated.normalBalance,
  opening_balance: 0,
  is_active: updated.isActive,
  created_at: updated.createdAt,
});

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to update account",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * DELETE ACCOUNT
 */
export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {

    const { id } = await params;

    /**
     * CHECK CHILD ACCOUNTS
     */
    const childAccounts =
      await prisma.chartOfAccount.count({
        where: {
          parentAccountId: id,
        },
      });

    if (childAccounts > 0) {

      return NextResponse.json(
        {
          error:
            "Cannot delete account with child accounts",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.chartOfAccount.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to delete account",
      },
      {
        status: 500,
      }
    );
  }
}