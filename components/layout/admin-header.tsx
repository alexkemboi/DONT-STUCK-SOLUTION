"use client";

import { Menu, LogOut, User, ChevronDown } from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { setMobileSidebarOpen } from "@/lib/store/slices/ui-slice";
import { logout } from "@/lib/store/slices/auth-slice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { NotificationBell } from "./notification-bell";
import { AdminSearch } from "./admin-search";

interface UserSchema {
  id: string;
  email: string;
  role: "Admin" | "Client" | "LoanOfficer" | "Investor" | "RecoveryAgent";
  name: string;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  href: string;
}

interface AdminHeaderProps {
  user: UserSchema | null;
  notifications: {
    count: number;
    items: NotificationItem[];
  };
}

export function AdminHeader({ user, notifications }: AdminHeaderProps) {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully", {
      description: "You have been signed out of your account.",
    });
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => dispatch(setMobileSidebarOpen(true))}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open sidebar</span>
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-slate-200 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <div className="relative flex flex-1 items-center">
          {user?.role === "Admin" ? (
            <AdminSearch />
          ) : (
            <div />
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <NotificationBell notifications={notifications} />

          {/* Separator */}
          <div className="hidden h-6 w-px bg-slate-200 lg:block" />

          {/* Date/Time - hidden on mobile */}
          <div className="hidden lg:flex lg:flex-col lg:items-end lg:text-sm">
            <span className="font-medium text-slate-900">
              {new Date().toLocaleDateString("en-KE", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-slate-500">
              {new Date().toLocaleTimeString("en-KE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Separator */}
          <div className="h-6 w-px bg-slate-200" />

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase() || "J"}{user?.name?.charAt(0).toUpperCase() || "D"}
                </div>
                <div className="hidden md:flex md:flex-col md:items-start md:text-left">
                  <span className="text-sm font-medium text-slate-900">{user?.name?.split(" ")[0] || "John"} {user?.name?.split(" ")[1] || "Doe"}</span>
                  <span className="text-xs text-slate-500">{user?.role}</span>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase() || "J"}{user?.name?.charAt(0).toUpperCase() || "D"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{user?.name?.split(" ")[0] || "John"} {user?.name?.split(" ")[1] || "Doe"}</p>
                  <p className="text-xs text-slate-500">{user?.email || "john@dssfinance.com"}  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info("Profile settings")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
