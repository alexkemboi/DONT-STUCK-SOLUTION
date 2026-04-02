import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const accounts = await prisma.chartOfAccount.findMany({
      orderBy: { accountCode: "asc" },
    });
    return NextResponse.json(accounts);
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
    return NextResponse.json(account);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}