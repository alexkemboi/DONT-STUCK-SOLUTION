import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  const transactions = await prisma.transaction.findMany({
    orderBy: {
      transactionDate: "asc",
    },
  });

  return NextResponse.json(transactions);
}

export async function POST(req: Request) {

  const body = await req.json();

  const tx = await prisma.transaction.create({
    data: {
      transactionCode: body.transaction_code,
      transactionType: body.transaction_type,
      referenceType: body.reference_type,
      referenceId:  body.reference_id,
      amount: body.amount,
      debitAccount: body.debit_account,
      creditAccount: body.credit_account,
      paymentMethod: body.payment_method,
      transactionDate: new Date(),
      description: body.description,
      status: "Completed",
      createdBy: body.created_by ?? "system",
    },
  });

  return NextResponse.json(tx);
}