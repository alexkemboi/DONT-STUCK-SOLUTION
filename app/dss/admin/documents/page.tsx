import { getAllDocumentsAction } from "@/app/actions/document";
import { DocumentsManager } from "@/components/admin/documents/documents-manager";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, FileText, Image } from "lucide-react";

export default async function DocumentsPage() {
  const result = await getAllDocumentsAction();
  const documents = result.data || [];

  const totalDocs = documents.length;
  const idDocs = documents.filter(
    (d) => d.documentType === "ID" || d.documentType === "PassportPhoto"
  ).length;
  const financialDocs = documents.filter(
    (d) =>
      d.documentType === "Payslip" ||
      d.documentType === "Statement" ||
      d.documentType === "BankStatement"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Document Management
        </h1>
        <p className="text-slate-500">
          View and manage uploaded documents across all clients and loans.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <FolderOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Documents</p>
              <p className="text-xl font-bold text-slate-900">{totalDocs}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Image className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">ID / Photos</p>
              <p className="text-xl font-bold text-slate-900">{idDocs}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Financial Docs</p>
              <p className="text-xl font-bold text-slate-900">
                {financialDocs}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DocumentsManager documents={documents} />
    </div>
  );
}
