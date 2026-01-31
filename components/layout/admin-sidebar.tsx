"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Banknote,
  TrendingUp,
  AlertTriangle,
  Settings,
  Building2,
  X,
  LogOut,
  User,
  BarChart2,
  CreditCard,
  FolderOpen,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setMobileSidebarOpen } from "@/lib/store/slices/ui-slice";
import { logout } from "@/lib/store/slices/auth-slice";
import { toast } from "sonner";
import { authClient } from "@/lib/authclient";

interface UserSchema {
  id: string;
  email: string;
  role: "Admin" | "Client" | "LoanOfficer" | "Investor" | "RecoveryAgent";
  name: string;
}

const adminnavigation = [
  {
    name: "Dashboard",
    href: "/dss/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Clients",
    href: "/dss/admin/clients",
    icon: Users,
  },
  {
    name: "Loan Applications",
    href: "/dss/admin/loans",
    icon: FileText,
  },
  // {
  //   name: "Disbursements",
  //   href: "/dss/admin/disbursements",
  //   icon: Banknote,
  // },
  // {
  //   name: "Investors",
  //   href: "/dss/admin/investors",
  //   icon: TrendingUp,
  // },
  {
    name: "Repayments",
    href: "/dss/admin/repayments",
    icon: CreditCard,
  },
  {
    name: "Documents",
    href: "/dss/admin/documents",
    icon: FolderOpen,
  },
  {
    name: "Reports",
    href: "/dss/admin/reports",
    icon: BarChart2,
  },
  // {
  //   name: "Recovery & NPL",
  //   href: "/dss/admin/recovery",
  //   icon: AlertTriangle,
  // },
  // {
  //   name: "Settings",
  //   href: "/dss/admin/settings",
  //   icon: Settings,
  // },
  // {
  //   name: "Profile",
  //   href: "/dss/profile",
  //   icon: User,
  // },
];

const clientNavigation = [
  {
    href: "/dss/client",
    icon: LayoutDashboard,
    name: "Dashboard",
  },
  {
    href: "/dss/client/apply",
    icon: FileText,
    name: "Apply for Loan",
  },
  {
    href: "/dss/client/loans",
    icon: FileText,
    name: "My Loans",
  },
  {
    href: "/dss/client/profile",
    icon: User,
    name: "Profile",
  },
  // {
  //   href: "/dss/client/disbursements",
  //   icon: Banknote,
  //   name: "Disbursements",
  // },
  // {
  //   href: "/dss/client/reports",
  //   icon: BarChart2,
  //   name: "Reports",
  // },
  {
    href: "/dss/client/settings",
    icon: Settings,
    name: "Settings",
  },
];

export function AdminSidebar({ user }: { user: UserSchema | null}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const mobileOpen = useAppSelector((state) => state.ui.sidebarMobileOpen);


  console.log("User in Sidebar:", user);


  return (
    <>
      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/80 lg:hidden"
          onClick={() => dispatch(setMobileSidebarOpen(false))}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-900 transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">DSS Finance</span>
          </div>
          <button
            onClick={() => dispatch(setMobileSidebarOpen(false))}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <SidebarNav pathname={pathname} role={user?.role} user={user} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">DSS Finance</span>
          </div>
          <SidebarNav pathname={pathname} role={user?.role} user={user} />
        </div>
      </div>
    </>
  );
}

function SidebarNav({ pathname, role, user }: { pathname: string; role: UserSchema["role"] | undefined; user: UserSchema | null }) {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const navigation = role === "Admin" ? adminnavigation : clientNavigation;


  

  // const navigation = sessionData. === "admin" ? adminNavigation : clientNavigation;
  const handleLogout = async () => {
    dispatch(logout());
    toast.success("Logged out successfully", {
      description: "You have been signed out of your account.",
    })
    await authClient.signOut();
    router.push("/auth/login");
  };

  return (
    <nav className="flex flex-1 flex-col px-6 lg:px-0">
      <ul role="list" className="flex flex-1 flex-col gap-y-1">
        {navigation.length > 0 && navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isActive
                      ? "text-emerald-400"
                      : "text-slate-500 group-hover:text-white"
                  )}
                />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* User info at bottom */}
      <div className="mt-auto pb-4 space-y-2">
        <div className="flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-sm font-medium text-white">
            {user?.name?.charAt(0).toUpperCase() || "J"}{user?.name?.charAt(0).toUpperCase() || "D"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name?.split(" ")[0] || "John"} {user?.name?.split(" ")[1] || "Doe"}</p>
            <p className="text-xs text-slate-400 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Sign out
        </button>
      </div>
    </nav>
  );
}
