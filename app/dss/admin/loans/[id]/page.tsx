import { getAdminLoanDetailAction } from "@/app/actions/loan";
import { LoanDetailView } from "@/components/admin/loans/loan-detail-view";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function LoanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getAdminLoanDetailAction(id);

  if (!result.success || !result.data) {
    return (
      <div className="space-y-4">
        <Link
          href="/dss/admin/loans"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Loans
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">
            {result.error || "Loan not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dss/admin/loans"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Loans
      </Link>
      <LoanDetailView loan={result.data} />
    </div>
  );
}
