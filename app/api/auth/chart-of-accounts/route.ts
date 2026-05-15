import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const accounts = await prisma.chartOfAccount.findMany({
      orderBy: { accountCode: "asc" },
    });
const formattedAccounts = accounts.map(acc => ({
  gl_account_id: acc.id,
  account_code: acc.accountCode,
  account_name: acc.accountName,
  account_type: acc.accountType,
  parent_account_id: acc.parentAccountId,
  normal_balance: acc.normalBalance,
  opening_balance: 0,
  is_active: acc.isActive,
  created_at: acc.createdAt,
}));

return NextResponse.json(formattedAccounts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const account = await prisma.chartOfAccount.create({
      data: {
        accountCode: data.account_code,
        accountName: data.account_name,
        accountType: data.account_type,
        parentAccountId: data.parent_account_id || null,
        normalBalance: data.normal_balance,
        isActive: data.is_active ?? true,
      },
    });
return NextResponse.json({
  gl_account_id: account.id,
  account_code: account.accountCode,
  account_name: account.accountName,
  account_type: account.accountType,
  parent_account_id: account.parentAccountId,
  normal_balance: account.normalBalance,
  opening_balance:  0,
  is_active: account.isActive,
  created_at: account.createdAt,
});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}