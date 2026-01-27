"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  setAcceptedTerms,
} from "@/lib/store/slices/auth-slice";
import Link from "next/link";
import { signUpAction } from "@/app/actions/auth";
import { redirect, useRouter } from "next/navigation";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  acceptTerms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});

interface RegisterFormValues {
  email: string;
  password: string;
  acceptTerms: boolean;
  fullname: string;
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const router = useRouter()

  const initialValues: RegisterFormValues = {
    email: "",
    password: "",
    acceptTerms: false,
    fullname: "",
  };

  const handleSubmit = async (values: RegisterFormValues) => {
    dispatch(loginStart());
    dispatch(setAcceptedTerms(values.acceptTerms));


    // call sigUp action

    const user = await signUpAction({
        email:values.email,
        password:values.password,
        fullname:values.fullname

    })

    console.log("signup response", user);

    if(user.status === 201 && user.user){
        dispatch(
            loginSuccess({
              id: user.user.id,
              email: user.user.email,
              name: user.user.name,
              role: user.user.role as "admin" | "officer" | "investor" | "recovery_agent" | "client",
            })
          );
          toast.success("Welcome aboard!", {
            description: "Your account has been created successfully.",
          });
          router.push("/client");
    }else{

      dispatch(loginFailure(user.error || "Registration failed"));
      toast.error("Registration failed", {
        description: user.error || "Please try again later.",
      });

    }

    
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Ready To Get Started ?
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          create an account to get started with applying for a loan
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Login Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values, errors, touched }) => (
          <Form className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Field
                as={Input}
                id="fullname"
                name="fullname"
                type="text"
                placeholder="Your full name"
                className={`h-11 ${
                  errors.fullname && touched.fullname
                    ? "border-red-300 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              <ErrorMessage
                name="fullname"
                component="p"
                className="text-sm text-red-500"
              />
            </div>
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Your Email address</Label>
              <Field
                as={Input}
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                className={`h-11 ${
                  errors.email && touched.email
                    ? "border-red-300 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-sm text-red-500"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Field
                  as={Input}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
              </div>
              <ErrorMessage
                name="password"
                component="p"
                className="text-sm text-red-500"
              />
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="acceptTerms"
                  checked={values.acceptTerms}
                  onCheckedChange={(checked) =>
                    setFieldValue("acceptTerms", checked)
                  }
                  className="mt-0.5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="acceptTerms"
                    className="text-sm font-normal text-slate-600 cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="font-medium text-emerald-600 hover:text-emerald-500 underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-medium text-emerald-600 hover:text-emerald-500 underline"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>
              <ErrorMessage
                name="acceptTerms"
                component="p"
                className="text-sm text-red-500"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  creating account...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign Up
                </>
              )}
            </Button>
          </Form>
        )}
      </Formik>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-50 px-2 text-slate-500">
            Need assistance?
          </span>
        </div>
      </div>

      {/* Contact Support */}
      <div className="text-center">
        <p className="text-sm text-slate-600">
          Contact support at{" "}
          <a
            href="mailto:support@dssfinance.com"
            className="font-medium text-emerald-600 hover:text-emerald-500"
          >
            support@dssfinance.com
          </a>
        </p>
      </div>
    </div>
  );
}
