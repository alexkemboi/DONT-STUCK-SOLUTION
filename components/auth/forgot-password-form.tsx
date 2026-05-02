"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ForgotPasswordSchema } from "@/src/helpers/yup/forgot-password-schema";
import { authClient } from "@/lib/authclient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const baseUrl =   process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  const resetState = () => {
    setSuccess(null);
    setError(null);
  };

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={ForgotPasswordSchema}
      onSubmit={async (values, { setSubmitting }) => {
        resetState();
        setLoading(true);
        try {
          // await authClient.requestPasswordReset({
          //   email: values.email,
          //   redirectTo: "/reset-password",
          // }, {
          //   onResponse: () => {
          //     setLoading(false);
          //     setSubmitting(false);
          //   },
          //   onRequest: () => {
          //     resetState();
          //     setLoading(true);
          //   },
          //   onSuccess: () => {
          //     setSuccess("Reset password link has been sent to your email.");
          //     toast({
          //       title: "Success",
          //       description: "Reset password link has been sent to your email.",
          //       variant: "default",
          //     });
          //   },
          //   onError: (ctx) => {
          //     setError(ctx.error.message);
          //     toast({
          //       title: "Error",
          //       description: ctx.error.message,
          //       variant: "destructive",
          //     });
          //   },
          // });


       
const response = await fetch(`${baseUrl}/api/auth/sendemail`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    recipientEmail: values.email,
    message: `${baseUrl}/reset-password`,
  }),
});

    if (response.ok) {
         setSuccess("Reset password link has been sent to your email.");
              toast({
                title: "Success",
                description: "Reset password link has been sent to your email.",
                variant: "default",
              });
    } else {
      setError('Reset password link has not been sent to your email.');
              toast({
                title: "Error",
                description: 'Reset password link has not been sent to your email.',
                variant: "destructive",
              });
    }

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
          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="mt-2">
              <Field
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                as={Input}
                disabled={loading}
                className={`h-11 ${
                  errors.email && touched.email
                    ? "border-red-300 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              <ErrorMessage name="email" component="p" className="mt-2 text-sm text-red-500" />
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
                  Sending...
                </>
              ) : (
                "Send reset link"
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
