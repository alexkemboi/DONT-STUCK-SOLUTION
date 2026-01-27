"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  User,
  Banknote,
  Settings,
  BarChart2,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navItems = [
  {
    href: "/client",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/client/apply",
    icon: FileText,
    label: "Apply for Loan",
  },
  {
    href: "/client/profile",
    icon: User,
    label: "Profile",
  },
  {
    href: "/client/disbursements",
    icon: Banknote,
    label: "Disbursements",
  },
  {
    href: "/client/reports",
    icon: BarChart2,
    label: "Reports",
  },
  {
    href: "/client/settings",
    icon: Settings,
    label: "Settings",
  },
];

export function ClientSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card p-4 md:flex">
        <div className="mb-6 text-2xl font-bold text-primary">Client Portal</div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4">
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-500">
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <div className="mb-6 text-2xl font-bold text-primary">Client Portal</div>
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-4">
              <Button variant="ghost" className="w-full justify-start gap-3 text-red-500">
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
