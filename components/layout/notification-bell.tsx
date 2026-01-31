"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  href: string;
}

interface NotificationBellProps {
  notifications: {
    count: number;
    items: NotificationItem[];
  };
}

export function NotificationBell({ notifications }: NotificationBellProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-slate-500" />
          {notifications.count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {notifications.count > 9 ? "9+" : notifications.count}
            </span>
          )}
          <span className="sr-only">View notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">Notifications</p>
          {notifications.count > 0 && (
            <p className="text-xs text-slate-500">
              {notifications.count} new
            </p>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.items.length > 0 ? (
            notifications.items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block border-b border-slate-50 px-4 py-3 transition-colors hover:bg-slate-50"
              >
                <p className="text-sm font-medium text-slate-900">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
                  {item.description}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatDateTime(item.timestamp)}
                </p>
              </Link>
            ))
          ) : (
            <div className="px-4 py-8 text-center">
              <Bell className="mx-auto mb-2 h-6 w-6 text-slate-300" />
              <p className="text-sm text-slate-400">No new notifications</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
