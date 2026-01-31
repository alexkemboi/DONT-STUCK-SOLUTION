import { getClientLoansAction } from "@/app/actions/loan";
import { ClientLoansView } from "@/components/client/loans/client-loans-view";

export default async function ClientLoansPage() {
  const result = await getClientLoansAction();
  const loans = result.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Loans</h1>
        <p className="text-slate-500">
          View your loan applications and track their progress.
        </p>
      </div>

      <ClientLoansView loans={loans} />
    </div>
  );
}
