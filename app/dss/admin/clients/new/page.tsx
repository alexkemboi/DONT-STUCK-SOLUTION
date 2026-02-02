"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { ArrowLeft, Copy, Check, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import { FormSelect } from "@/components/forms/form-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { createClientByAdminAction } from "@/app/actions/admin";

const titleOptions = [
  { value: "Mr", label: "Mr" },
  { value: "Mrs", label: "Mrs" },
  { value: "Ms", label: "Ms" },
  { value: "Dr", label: "Dr" },
  { value: "Prof", label: "Prof" },
];

const maritalStatusOptions = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Divorced", label: "Divorced" },
  { value: "Widowed", label: "Widowed" },
];

function generatePassword(length = 12) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  title: Yup.string().required("Title is required"),
  surname: Yup.string().required("Surname is required"),
  otherNames: Yup.string().required("Other names are required"),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  maritalStatus: Yup.string().required("Marital status is required"),
  nationality: Yup.string().required("Nationality is required"),
  dependents: Yup.number().min(0).required("Number of dependents is required"),
  idPassportNo: Yup.string().required("ID/Passport number is required"),
  phoneMobile: Yup.string().required("Mobile phone is required"),
});

interface FormValues {
  name: string;
  email: string;
  password: string;
  title: string;
  surname: string;
  otherNames: string;
  dateOfBirth: string;
  maritalStatus: string;
  nationality: string;
  dependents: number;
  idPassportNo: string;
  kraPin: string;
  phoneMobile: string;
  phoneWork: string;
  phoneAlternative: string;
  emailPersonal: string;
  emailOfficial: string;
}

export default function NewClientPage() {
  const router = useRouter();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdPassword, setCreatedPassword] = useState("");
  const [createdClientId, setCreatedClientId] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: FormValues = {
    name: "",
    email: "",
    password: generatePassword(),
    title: "Mr",
    surname: "",
    otherNames: "",
    dateOfBirth: "",
    maritalStatus: "Single",
    nationality: "Kenyan",
    dependents: 0,
    idPassportNo: "",
    kraPin: "",
    phoneMobile: "",
    phoneWork: "",
    phoneAlternative: "",
    emailPersonal: "",
    emailOfficial: "",
  };

  const handleSubmit = async (values: FormValues) => {
    const result = await createClientByAdminAction({
      name: values.name,
      email: values.email,
      password: values.password,
      title: values.title,
      surname: values.surname,
      otherNames: values.otherNames,
      dateOfBirth: values.dateOfBirth,
      maritalStatus: values.maritalStatus,
      nationality: values.nationality,
      dependents: values.dependents,
      idPassportNo: values.idPassportNo,
      kraPin: values.kraPin || undefined,
      phoneMobile: values.phoneMobile,
      phoneWork: values.phoneWork || undefined,
      phoneAlternative: values.phoneAlternative || undefined,
      emailPersonal: values.emailPersonal || undefined,
      emailOfficial: values.emailOfficial || undefined,
    });


    console.log(result, "res")

    if (!result.success) {
      toast.error(result.error || "Failed to create client");
      return;
    }

    setCreatedPassword(values.password);
    setCreatedClientId(result.clientId || "");
    setShowSuccessDialog(true);
  };

  const handleCopyPassword = async () => {
    await navigator.clipboard.writeText(createdPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    router.push(`/dss/admin/clients/${createdClientId}`);
  };

  return (
    <div className="space-y-6">
      <Link
        href="/dss/admin/clients"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clients
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add New Client</h1>
        <p className="text-slate-500">
          Create a user account and client profile.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-8">
            {/* Account Details */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Account Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  name="name"
                  label="Full Name"
                  placeholder="John Doe"
                />
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FormField
                        name="password"
                        label=""
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-0.5 shrink-0"
                      onClick={() =>
                        setFieldValue("password", generatePassword())
                      }
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Personal Information
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormSelect
                    name="title"
                    label="Title"
                    options={titleOptions}
                  />
                  <FormField
                    name="surname"
                    label="Surname"
                    placeholder="Enter surname"
                  />
                  <FormField
                    name="otherNames"
                    label="Other Names"
                    placeholder="Enter other names"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                  />
                  <FormSelect
                    name="maritalStatus"
                    label="Marital Status"
                    options={maritalStatusOptions}
                  />
                  <FormField
                    name="nationality"
                    label="Nationality"
                    placeholder="Kenyan"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    name="dependents"
                    label="Number of Dependents"
                    type="number"
                  />
                  <FormField
                    name="idPassportNo"
                    label="ID/Passport Number"
                    placeholder="Enter ID or Passport"
                  />
                  <FormField
                    name="kraPin"
                    label="KRA PIN"
                    placeholder="Optional"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    name="phoneMobile"
                    label="Mobile Phone"
                    placeholder="+254..."
                  />
                  <FormField
                    name="phoneWork"
                    label="Work Phone"
                    placeholder="Optional"
                  />
                  <FormField
                    name="phoneAlternative"
                    label="Alternative Phone"
                    placeholder="Optional"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    name="emailPersonal"
                    label="Personal Email"
                    type="email"
                    placeholder="Optional"
                  />
                  <FormField
                    name="emailOfficial"
                    label="Official Email"
                    type="email"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dss/admin/clients")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isSubmitting ? "Creating..." : "Create Client"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Success Dialog — shows password */}
      <Dialog open={showSuccessDialog} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Client Created Successfully</DialogTitle>
            <DialogDescription>
              The client account has been created. Please share the login
              credentials with the client.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Password</p>
              <div className="mt-1 flex items-center gap-2">
                <code className="flex-1 rounded bg-slate-100 px-3 py-2 text-sm font-mono">
                  {createdPassword}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPassword}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs text-amber-600">
              Make sure to copy this password. It will not be shown again.
            </p>
          </div>

          <DialogFooter>
            <Button onClick={handleDialogClose}>
              Continue to Client Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
