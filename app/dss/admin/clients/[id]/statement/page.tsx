import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getClientStatementAction } from "@/app/actions/client-statement";
import { ClientStatement } from "@/components/admin/clients/client-statement";

export default async function ClientStatementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getClientStatementAction(id);

  return (
    <div className="space-y-4">
      <Link
        href={`/dss/admin/clients/${id}`}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 print:hidden"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Client
      </Link>

      {result.success && result.data ? (
        <ClientStatement data={result.data} />
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">
            {result.error || "Failed to load statement"}
          </p>
        </div>
      )}
    </div>
  );
}
