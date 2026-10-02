"use client";

import { useRef, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Download,
  Loader2,
  Printer,
  Scale,
} from "lucide-react";
import { toast } from "sonner";
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
  PAID: "bg-slate-100 text-slate-600 border-slate-200",
  "ON TRACK": "bg-emerald-50 text-emerald-700 border-emerald-200",
  OVERDUE: "bg-red-50 text-red-700 border-red-200",
};

const statusDotStyles: Record<string, string> = {
  PAID: "bg-slate-400",
  "ON TRACK": "bg-emerald-500",
  OVERDUE: "bg-red-500",
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function ClientStatement({ data }: { data: ClientStatementData }) {
  const { company, client, statementDate, summary, loans } = data;
  const printRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas-pro"),
      ]);

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const dateSuffix = statementDate.split("T")[0];
      const fileName = `${client.fullName.replace(/\s+/g, "_")}_statement_${dateSuffix}.pdf`;
      pdf.save(fileName);
    } catch {
      toast.error("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2 print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button onClick={handleDownloadPdf} disabled={downloading}>
          {downloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {downloading ? "Generating..." : "Download PDF"}
        </Button>
      </div>

      <div
        ref={printRef}
        className="bg-white border border-slate-200 rounded-xl overflow-hidden print:border-0 print:rounded-none print:shadow-none"
      >
        {/* Letterhead */}
        <div className="bg-slate-900 px-8 py-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 shrink-0 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold tracking-wide">
              {initials(company.name) || "DS"}
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">
                {company.name}
              </h1>
              <p className="text-xs text-slate-400">
                {[
                  company.tagline,
                  [company.city, company.country].filter(Boolean).join(", "),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-300">
              Loan Statement
            </p>
            <p className="text-sm text-white font-medium mt-1">
              {formatDate(statementDate)}
            </p>
          </div>
        </div>

        {/* Borrower strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-8 py-4 grid grid-cols-3 gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Borrower
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              {client.fullName}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Phone
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              {client.phone}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              ID Number
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              {client.idPassportNo}
            </p>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Summary stat cards */}
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                label: "Total Disbursed",
                value: summary.totalDisbursed,
                icon: Banknote,
                color: "text-slate-600",
                bg: "bg-slate-100",
                border: "border-slate-200",
              },
              {
                label: "Total Repaid",
                value: summary.totalRepaid,
                icon: CheckCircle2,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                border: "border-emerald-200",
              },
              {
                label: "Arrears Accrued",
                value: summary.arrearsAccrued,
                icon: AlertTriangle,
                color: summary.arrearsAccrued > 0 ? "text-red-600" : "text-slate-600",
                bg: summary.arrearsAccrued > 0 ? "bg-red-50" : "bg-slate-100",
                border: summary.arrearsAccrued > 0 ? "border-red-200" : "border-slate-200",
              },
              {
                label: "Total Outstanding",
                value: summary.totalOutstanding,
                icon: Scale,
                color: "text-indigo-700",
                bg: "bg-indigo-50",
                border: "border-indigo-200",
                emphasize: true,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-lg border p-3 ${stat.border} ${
                  stat.emphasize ? "bg-indigo-50" : "bg-white"
                }`}
              >
                <div className={`h-7 w-7 rounded-md flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mt-2">
                  {stat.label}
                </p>
                <p className={`text-sm font-bold mt-0.5 ${stat.emphasize ? "text-indigo-900" : "text-slate-900"}`}>
                  {formatCurrency(stat.value)}
                </p>
              </div>
            ))}
          </div>

          {/* Loan history */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-4 w-1 rounded-full bg-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Loan History
              </h2>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-50/70">
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
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={`px-3 py-2.5 font-semibold text-indigo-900 text-[11px] uppercase tracking-wide whitespace-nowrap ${
                          i >= 2 && h !== "Status" && h !== "Due Date" && h !== "Type" ? "text-right" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loans.map((loan, idx) => (
                    <tr
                      key={loan.loanRef}
                      className={idx % 2 === 1 ? "bg-slate-50/60" : "bg-white"}
                    >
                      <td className="px-3 py-2.5 font-mono text-xs text-slate-700">
                        {loan.loanRef}
                      </td>
                      <td className="px-3 py-2.5 text-slate-700">{loan.type}</td>
                      <td className="px-3 py-2.5 text-slate-700 text-right whitespace-nowrap">
                        {formatCurrency(loan.approvedAmount)}
                      </td>
                      <td className="px-3 py-2.5 text-slate-700 text-right">
                        {loan.interestRate.toFixed(1)}%
                      </td>
                      <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                        {formatDate(loan.dueDate)}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusStyles[loan.status]}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusDotStyles[loan.status]}`} />
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-700 text-right whitespace-nowrap">
                        {loan.paidSoFar > 0 ? formatCurrency(loan.paidSoFar) : "—"}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-slate-900 text-right whitespace-nowrap">
                        {formatCurrency(loan.balance)}
                      </td>
                      <td className="px-3 py-2.5 text-right whitespace-nowrap">
                        {loan.arrears > 0 ? (
                          <span className="text-red-600 font-semibold">
                            {formatCurrency(loan.arrears)}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
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

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-start justify-between gap-8">
            <p className="text-[11px] leading-relaxed text-slate-500 max-w-md">
              Arrears accrue at 1.35%/day of the outstanding principal + interest for every
              day past the due date. This statement reflects live figures as of{" "}
              {formatDate(statementDate)}.
            </p>
            <div className="text-right text-[11px] text-slate-500 shrink-0">
              <p className="font-semibold text-slate-700">{company.name}</p>
              {company.email && <p>{company.email}</p>}
              {company.phone && <p>{company.phone}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
