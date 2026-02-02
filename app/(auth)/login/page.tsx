import { LoginForm } from "@/components/auth/login-form";
import { Building2, Shield, TrendingUp, Users, Zap } from "lucide-react";
import {dssimage} from ""
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">       
        <div className="flex w-full lg:w-1/2 xl:w-2/5 items-center justify-center p-6 sm:p-12 m-auto ">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500">
                <Building2 className="h-7 w-7 text-white" />
              </div>
             <div className="flex flex-col items-center justify-center gap-3">
                <img
                  src="/public/dss.png"
                  alt="Don't Stuck Solutions Logo"
                  className="h-14 w-14 object-contain"
                />
                <span className="text-2xl font-bold text-slate-900">
                  DON'T STUCK SOLUTIONS
                </span>
              </div>

            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
