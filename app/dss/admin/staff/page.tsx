import { getStaffUsersAction } from "@/app/actions/staff";
import { StaffManagement } from "@/components/admin/staff/staff-management";

export default async function StaffPage() {
  const result = await getStaffUsersAction();
  const staff = result.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
        <p className="text-slate-500">
          Manage staff accounts, roles, and access.
        </p>
      </div>
      <StaffManagement staff={staff} />
    </div>
  );
}
