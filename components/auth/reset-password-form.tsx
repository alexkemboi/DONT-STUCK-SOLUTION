"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ResetPasswordSchema } from "@/src/helpers/yup/reset-password-schema";
import { authClient } from "@/lib/authclient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetState = () => {
    setSuccess(null);
    setError(null);
  };

  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validationSchema={ResetPasswordSchema}
      onSubmit={async (values, { setSubmitting }) => {
        resetState();
        setLoading(true);
        try {
          await authClient.resetPassword({
            newPassword: values.password,
            token: token,
          }, {
            onResponse: () => {
              setLoading(false);
              setSubmitting(false);
            },
            onRequest: () => {
              resetState();
              setLoading(true);
            },
            onSuccess: () => {
              setSuccess("New password has been created.");
              toast({
                title: "Success",
                description: "New password has been created.",
                variant: "default",
              });
              router.replace("/login");
            },
            onError: (ctx) => {
              setError(ctx.error.message);
              toast({
                title: "Error",
                description: ctx.error.message,
                variant: "destructive",
              });
            },
          });
        } catch (err: any) {
          setError(err.message);
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
          setLoading(false);
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className="space-y-6">
          {/* New Password Field */}
          <div>
            <Label htmlFor="password">New Password</Label>
            <div className="mt-2 relative">
              <Field
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                as={Input}
                disabled={loading}
                className={`h-11 pr-10 ${
                  errors.password && touched.password
                    ? "border-red-300 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              <ErrorMessage name="password" component="p" className="mt-2 text-sm text-red-500" />
            </div>
          </div>

          {/* Confirm New Password Field */}
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="mt-2 relative">
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                as={Input}
                disabled={loading}
                className={`h-11 pr-10 ${
                  errors.confirmPassword && touched.confirmPassword
                    ? "border-red-300 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              <ErrorMessage name="confirmPassword" component="p" className="mt-2 text-sm text-red-500" />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset password"
              )}
            </Button>
          </div>

          {success && (
            <p className="mt-2 text-center text-sm text-green-600">{success}</p>
          )}
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}
        </Form>
      )}
    </Formik>
  );
}
