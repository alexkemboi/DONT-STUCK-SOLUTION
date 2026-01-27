"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  User,
  Banknote,
  Settings,
  BarChart2,
  Handshake,
  ArrowRight,
} from "lucide-react";

export function ClientDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome, Client!</h1>
        <p className="text-slate-500">
          Here's an overview of your account and quick access to key features.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Apply for Loan Card */}
        <Card className="col-span-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white md:col-span-2 lg:col-span-2">
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                <Handshake className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Apply for a New Loan</CardTitle>
                <p className="text-blue-100">
                  Need funds? Start your application process here.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/client/apply">
                <Button variant="secondary" className="group text-blue-600">
                  Start Application
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Complete Profile Card */}
        <Card className="col-span-1">
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Complete Your Profile</CardTitle>
                <p className="text-sm text-slate-500">
                  Ensure all your details are up-to-date.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/client/profile">
                <Button variant="outline" className="w-full">
                  Go to Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Disbursements Card */}
        <Card className="col-span-1">
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50">
                <Banknote className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">View Disbursements</CardTitle>
                <p className="text-sm text-slate-500">
                  Track your received funds and payment schedules.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/client/disbursements">
                <Button variant="outline" className="w-full">
                  View Disbursements
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Reports Card */}
        <Card className="col-span-1">
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
                <BarChart2 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Reports</CardTitle>
                <p className="text-sm text-slate-500">
                  Access your financial statements and reports.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/client/reports">
                <Button variant="outline" className="w-full">
                  Generate Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card className="col-span-1">
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Settings</CardTitle>
                <p className="text-sm text-slate-500">
                  Manage your account preferences.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/client/settings">
                <Button variant="outline" className="w-full">
                  Adjust Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
