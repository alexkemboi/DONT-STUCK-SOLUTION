import { StoreProvider } from "@/lib/store/provider";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { AdminHeader } from "@/components/admin/layout/admin-header";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="lg:pl-72">
          <AdminHeader />
          <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
        </div>
        <Toaster position="top-right" richColors closeButton />
      </div>
    </StoreProvider>
  );
}
