import { LoginForm } from "@/components/auth/login-form";
import { Building2, Shield, TrendingUp, Users, Zap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* Left Side - Bento Grid */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-slate-900 p-8 xl:p-12">
          <div className="flex flex-col w-full">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">DON'T STUCK SOLUTION</span>
                <p className="text-sm text-slate-400">Loan Management System</p>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="flex-1 grid grid-cols-2 gap-4 xl:gap-6">
              {/* Large Card - Stats */}
              <div className="col-span-2 rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 p-6 xl:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">
                      Total Disbursed
                    </p>
                    <p className="text-3xl xl:text-4xl font-bold text-white mt-1">
                      KES 45.6M
                    </p>
                    <p className="text-emerald-100 text-sm mt-2">
                      +12.5% from last month
                    </p>
                  </div>
                  <div className="h-16 w-16 xl:h-20 xl:w-20 rounded-2xl bg-white/20 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 xl:h-10 xl:w-10 text-white" />
                  </div>
                </div>
              </div>

              {/* Card - Active Loans */}
              <div className="rounded-2xl bg-slate-800 p-5 xl:p-6">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-slate-400 text-sm">Active Loans</p>
                <p className="text-2xl xl:text-3xl font-bold text-white mt-1">342</p>
                <div className="mt-4 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-blue-500 rounded-full" />
                </div>
              </div>

              {/* Card - Clients */}
              <div className="rounded-2xl bg-slate-800 p-5 xl:p-6">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-slate-400 text-sm">Registered Clients</p>
                <p className="text-2xl xl:text-3xl font-bold text-white mt-1">1,247</p>
                <div className="mt-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-8 flex-1 rounded bg-purple-500/20"
                      style={{ opacity: 0.4 + i * 0.12 }}
                    />
                  ))}
                </div>
              </div>

              {/* Wide Card - Features */}
              <div className="col-span-2 rounded-2xl bg-slate-800/50 border border-slate-700 p-5 xl:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Powerful Features</p>
                    <p className="text-sm text-slate-400">
                      Everything you need to manage loans
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    "Loan Processing",
                    "KYC Management",
                    "Disbursements",
                    "Repayment Tracking",
                    "NPL Recovery",
                    "Investor Portal",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="px-3 py-2 rounded-lg bg-slate-700/50 text-xs text-slate-300 text-center"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Badge */}
              <div className="col-span-2 rounded-2xl bg-linear-to-r from-slate-800 to-slate-800/50 border border-slate-700 p-4 xl:p-5">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Bank-Grade Security</p>
                    <p className="text-sm text-slate-400">
                      256-bit encryption • SOC2 compliant • Regular audits
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-slate-500 text-sm">
                © 2024 DSS Finance. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex w-full lg:w-1/2 xl:w-2/5 items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900">DSS Finance</span>
              </div>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
