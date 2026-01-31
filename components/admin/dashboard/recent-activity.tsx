"use client";

import { formatDateTime } from "@/lib/utils";
import {
  CheckCircle,
  Banknote,
  CreditCard,
  UserPlus,
  AlertTriangle,
} from "lucide-react";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

interface RecentActivityListProps {
  activities: Activity[];
}

const activityIcons: Record<string, React.ElementType> = {
  loan_approved: CheckCircle,
  disbursement: Banknote,
  repayment: CreditCard,
  client_registered: UserPlus,
  npl_flagged: AlertTriangle,
};

const activityColors: Record<string, string> = {
  loan_approved: "bg-emerald-100 text-emerald-600",
  disbursement: "bg-blue-100 text-blue-600",
  repayment: "bg-purple-100 text-purple-600",
  client_registered: "bg-cyan-100 text-cyan-600",
  npl_flagged: "bg-red-100 text-red-600",
};

export function RecentActivityList({ activities }: RecentActivityListProps) {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type] || CheckCircle;
          const colorClass =
            activityColors[activity.type] || "bg-slate-100 text-slate-600";
          const isLast = index === activities.length - 1;

          return (
            <li key={activity.id}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${colorClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDateTime(activity.timestamp)}
                      </p>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {activity.description}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      by {activity.user}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
