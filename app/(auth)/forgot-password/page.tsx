import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <div className="flex w-full lg:w-1/2 xl:w-2/5 items-center justify-center p-6 sm:p-12 m-auto">
          <div className="w-full max-w-md">
            <div className="space-y-6 rounded-md border border-gray-200 bg-white p-5">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Forgot your password?
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Enter your email address below and we&apos;ll send you a link to reset your password.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <ForgotPasswordForm />
              <p className="mt-4 text-center text-sm text-slate-600">
                Remember your password?{" "}
                <Link href="/login" className="font-medium text-red-950 hover:text-[#FFCC00]">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}