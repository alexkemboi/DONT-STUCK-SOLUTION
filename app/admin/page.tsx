import { getDashboardStats, getAllLoanApplications } from "@/app/actions/loan-actions";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata = {
  title: "Admin Dashboard | Don't Stuck Solution",
  description: "Manage loan applications and monitor platform activity",
};

export default async function AdminPage() {
  const [stats, applications] = await Promise.all([
    getDashboardStats(),
    getAllLoanApplications(),
  ]);

  return <AdminDashboard initialStats={stats} initialApplications={applications} />;
}
