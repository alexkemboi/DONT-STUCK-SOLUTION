import { clients, formatCurrency } from "@/lib/data/dummy-data";
import { ClientsTable } from "@/components/admin/clients/clients-table";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, Wallet } from "lucide-react";

export default function ClientsPage() {
  const activeClients = clients.filter((c) => c.status === "Active").length;
  const inactiveClients = clients.filter((c) => c.status === "Inactive").length;
  const totalOutstanding = clients.reduce(
    (sum, c) => sum + c.outstandingBalance,
    0
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <p className="text-slate-500">
          Manage client profiles, KYC documents, and loan history.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Clients</p>
              <p className="text-xl font-bold text-slate-900">{clients.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active</p>
              <p className="text-xl font-bold text-slate-900">{activeClients}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <UserX className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Inactive</p>
              <p className="text-xl font-bold text-slate-900">{inactiveClients}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Wallet className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Outstanding</p>
              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(totalOutstanding)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <ClientsTable clients={clients} />
    </div>
  );
}
