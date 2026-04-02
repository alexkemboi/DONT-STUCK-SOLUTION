import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Suspense } from "react";
import Link from "next/link";

export default async function ResetPasswordPage({ // Added async
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // Changed type to Promise
}) {
  const resolvedSearchParams = await searchParams; // Await the searchParams object
  const token = resolvedSearchParams.token as string;


  console.log("Reset password token:", token); // Debugging log to check the token value

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-6 rounded-md border border-gray-200 bg-white p-5">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-slate-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Enter your new password below.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Suspense>
          <ResetPasswordForm token={token} />
        </Suspense>
        <p className="mt-4 text-center text-sm text-slate-600">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}