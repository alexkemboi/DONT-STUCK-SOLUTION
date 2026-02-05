import { RegisterForm } from '@/components/auth/register-form'
import { Building2, Shield, TrendingUp, Users, Zap } from "lucide-react";
import React from 'react'
import Image from "next/image";
import dss from "@/public/dss.png"
const page = () => {
  return (
      <div className="min-h-screen bg-slate-50">
          <div className="flex min-h-screen">
         <div className="hidden lg:flex w-1/2 xl:w-3/5 items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 relative overflow-hidden">
  {/* subtle background shapes */}
  <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
  <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-black/10 blur-2xl" />

  <div className="relative z-10 max-w-lg px-12 text-white">
    {/* Logo */}
    <div className="flex items-center gap-4 mb-10">
         <div className="flex flex-col items-center justify-center gap-3">
                         <Image
                            src={dss}
                            alt="Don't Stuck Solutions Logo"
                            width={204}
                            height={204}
                            priority
                          />
                       
                      </div>
      </div>
     

    

    {/* Main message */}
   

    <p className="text-emerald-100 text-lg mb-10 leading-relaxed">
      Manage clients, agreements, collections, and reports from one simple,
      reliable system. No clutter. No guesswork.
    </p>

    {/* Feature list */}
    <ul className="space-y-4">
      <li className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-white" />
        Real-time financial tracking
      </li>
      <li className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-white" />
        Secure & audit-friendly records
      </li>
      <li className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-white" />
        Designed for teams that scale
      </li>
    </ul>

    {/* Footer note */}
    <div className="mt-12 text-sm text-emerald-100">
      Trusted by growing finance teams
    </div>
  </div>
</div>


            
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

                      <RegisterForm />
                  </div>
              </div>
          </div>
      </div>
  )
}

export default page