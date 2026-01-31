import { StoreProvider } from "@/lib/store/provider";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";
import { Toaster } from "sonner";
import { getCurrentUser } from "../actions/auth";
import {
  getAdminNotifications,
  getClientNotifications,
} from "../actions/notifications";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Fetch notifications based on role
  const isAdmin = user?.role === "Admin";
  const notifications = isAdmin
    ? await getAdminNotifications()
    : await getClientNotifications();

  return (
    <StoreProvider>
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar user={user} />
        <div className="lg:pl-72">
          <AdminHeader user={user} notifications={notifications} />
          <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
        </div>
        <Toaster position="top-right" richColors closeButton />
      </div>
    </StoreProvider>
  );
}
