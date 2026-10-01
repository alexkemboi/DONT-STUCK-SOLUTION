"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ClientStatementData } from "@/app/actions/client-statement";

const formatCurrency = (amount: number) =>
  `KES ${Math.round(amount).toLocaleString("en-KE")}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const statusStyles: Record<string, string> = {
  PAID: "bg-slate-100 text-slate-700 border-slate-300",
  "ON TRACK": "bg-emerald-50 text-emerald-700 border-emerald-300",
  OVERDUE: "bg-red-50 text-red-700 border-red-300",
};

export function ClientStatement({ data }: { data: ClientStatementData }) {
  const { company, client, statementDate, summary, loans } = data;

  return (
    <div className="space-y-6">
      <div className="flex justify-end print:hidden">
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print / Save as PDF
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-8 print:border-0 print:p-0 print:shadow-none">
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{company.name}</h1>
            <p className="text-sm text-slate-500">
              {[company.tagline, [company.city, company.country].filter(Boolean).join(", ")]
                .filter(Boolean)
                .join(" · ")}
              {" "}
              · E-Loans Master Ledger
            </p>
          </div>
          <div className="text-right text-sm text-slate-600 space-y-0.5">
            <p>Statement Date: {formatDate(statementDate)}</p>
            <p>Borrower: {client.fullName}</p>
            <p>Phone: {client.phone}</p>
            <p>ID Number: {client.idPassportNo}</p>
          </div>
        </div>

        <div className="mt-6">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wide pb-2">
                  Summary
                </th>
                <th className="text-right font-semibold text-slate-500 text-xs uppercase tracking-wide pb-2">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 text-slate-700">Total Disbursed (All Loans)</td>
                <td className="py-2 text-right font-medium">
                  {formatCurrency(summary.totalDisbursed)}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-700">Total Repaid (incl. part-payments)</td>
                <td className="py-2 text-right font-medium">
                  {formatCurrency(summary.totalRepaid)}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-700">Arrears Accrued (1.35%/day overdue)</td>
                <td className="py-2 text-right font-medium">
                  {formatCurrency(summary.arrearsAccrued)}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-900 font-semibold">
                  Total Outstanding (incl. arrears)
                </td>
                <td className="py-2 text-right font-bold text-slate-900">
                  {formatCurrency(summary.totalOutstanding)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Loan History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {[
                    "Loan Ref",
                    "Type",
                    "Approved",
                    "Rate",
                    "Due Date",
                    "Status",
                    "Paid So Far",
                    "Balance",
                    "Arrears",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left font-medium text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.loanRef} className="border-b border-slate-100">
                    <td className="px-3 py-2.5 font-mono text-slate-700">{loan.loanRef}</td>
                    <td className="px-3 py-2.5 text-slate-700">{loan.type}</td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                      {formatCurrency(loan.approvedAmount)}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700">
                      {loan.interestRate.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                      {formatDate(loan.dueDate)}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${statusStyles[loan.status]}`}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                      {loan.paidSoFar > 0 ? formatCurrency(loan.paidSoFar) : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                      {formatCurrency(loan.balance)}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                      {loan.arrears > 0 ? formatCurrency(loan.arrears) : "—"}
                    </td>
                  </tr>
                ))}
                {loans.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-3 py-8 text-center text-slate-500">
                      No loans found for this client.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500 border-t border-slate-200 pt-4">
          Arrears accrue at 1.35%/day of the outstanding principal + interest for every day past
          the due date. This statement reflects live figures as of {formatDate(statementDate)}.
          {company.email ? ` For any query, contact ${company.name} on ${company.email}.` : ""}
        </p>
      </div>
    </div>
  );
}
