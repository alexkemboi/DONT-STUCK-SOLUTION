import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        transactionDate: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY:", body);

    const transaction = await prisma.transaction.create({
      data: {
        transactionCode: body.transaction_code,
        transactionType: body.transaction_type,
        referenceType: body.reference_type,
        referenceId: body.reference_id,

        amount: body.amount,

        debitAccount: body.debit_account,
        creditAccount: body.credit_account,

        paymentMethod: body.payment_method || null,

        transactionDate: new Date(),

        description: body.description || null,

        status: "Completed",

        createdBy: body.created_by || "system",
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create transaction",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}