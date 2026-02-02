import { getClientById } from "@/app/actions/admin";
import { ClientDetailView } from "@/components/admin/clients/client-detail-view";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ClientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: client, error } = await getClientById(id);

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          href="/dss/admin/clients"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-4">
        <Link
          href="/dss/admin/clients"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
          <p className="text-slate-600">Client not found</p>
        </div>
      </div>
    );
  }

  const employment = client.employmentDetails?.[0]
    ? {
        ...client.employmentDetails[0],
        netSalary: client.employmentDetails[0].netSalary.toString(),
      }
    : undefined;

  const referees = client.referees?.map((referee) => ({
    ...referee,
    createdAt: referee.createdAt?.toISOString(),
  }));

  const bankDetails = client.bankDetails?.[0]
    ? {
        ...client.bankDetails[0],
        proofDocument: client.bankDetails[0].proofDocument ?? undefined,
        accountName: client.bankDetails[0].accountName as string,
        accountNumber: client.bankDetails[0].accountNumber as string,
        branch: client.bankDetails[0].branch as string,
        bankName: client.bankDetails[0].bankName as string,
        proofDocumentUrl: client.bankDetails[0].proofDocumentUrl as string,
        createdAt: client.bankDetails[0].createdAt.toISOString() as string,
        updatedAt: client.bankDetails[0].updatedAt.toISOString() as string,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <Link
        href="/dss/admin/clients"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clients
      </Link>
      <ClientDetailView
        client={client}
        addresses={client.addresses || []}
        employment={employment}
        bankDetails={bankDetails}
        referees={referees || []}
      />
    </div>
  );
}
