"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GuarantorFormData } from "@/lib/types";
import { ArrowLeft, ArrowRight, Plus, Trash2, Users } from "lucide-react";

interface GuarantorsFormProps {
  data: GuarantorFormData[];
  onSubmit: (data: GuarantorFormData[]) => void;
  onBack: () => void;
}

const emptyGuarantor: GuarantorFormData = {
  full_name: "",
  relationship: "",
  phone: "",
  email: "",
  address: "",
  occupation: "",
  monthly_income: 0,
};

export function GuarantorsForm({ data, onSubmit, onBack }: GuarantorsFormProps) {
  const [guarantors, setGuarantors] = useState<GuarantorFormData[]>(
    data.length > 0 ? data : [{ ...emptyGuarantor }]
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GuarantorFormData>({
    defaultValues: guarantors[currentIndex],
  });

  const saveCurrentGuarantor = (formData: GuarantorFormData) => {
    const updated = [...guarantors];
    updated[currentIndex] = formData;
    setGuarantors(updated);
    return updated;
  };

  const handleAddGuarantor = handleSubmit((formData) => {
    const updated = saveCurrentGuarantor(formData);
    updated.push({ ...emptyGuarantor });
    setGuarantors(updated);
    setCurrentIndex(updated.length - 1);
    reset(emptyGuarantor);
  });

  const handleRemoveGuarantor = (index: number) => {
    if (guarantors.length <= 1) return;
    const updated = guarantors.filter((_, i) => i !== index);
    setGuarantors(updated);
    const newIndex = Math.min(currentIndex, updated.length - 1);
    setCurrentIndex(newIndex);
    reset(updated[newIndex]);
  };

  const handleSelectGuarantor = (index: number) => {
    handleSubmit((formData) => {
      saveCurrentGuarantor(formData);
      setCurrentIndex(index);
      reset(guarantors[index]);
    })();
  };

  const handleFormSubmit = handleSubmit((formData) => {
    const updated = saveCurrentGuarantor(formData);
    // Filter out empty guarantors
    const validGuarantors = updated.filter(
      (g) => g.full_name && g.phone && g.relationship
    );
    onSubmit(validGuarantors);
  });

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Guarantors</CardTitle>
            <CardDescription>
              Add at least one guarantor for your loan application
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {guarantors.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {guarantors.map((g, index) => (
              <Button
                key={index}
                type="button"
                variant={currentIndex === index ? "default" : "outline"}
                size="sm"
                onClick={() => handleSelectGuarantor(index)}
                className="gap-2"
              >
                {g.full_name || `Guarantor ${index + 1}`}
                {guarantors.length > 1 && (
                  <Trash2
                    className="h-3 w-3 opacity-70 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveGuarantor(index);
                    }}
                  />
                )}
              </Button>
            ))}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                placeholder="Jane Smith"
                {...register("full_name", { required: "Name is required" })}
                className={errors.full_name ? "border-destructive" : ""}
              />
              {errors.full_name && (
                <p className="text-sm text-destructive">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship *</Label>
              <Input
                id="relationship"
                placeholder="Spouse, Parent, Sibling, etc."
                {...register("relationship", {
                  required: "Relationship is required",
                })}
                className={errors.relationship ? "border-destructive" : ""}
              />
              {errors.relationship && (
                <p className="text-sm text-destructive">
                  {errors.relationship.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register("phone", { required: "Phone is required" })}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                {...register("email")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation *</Label>
              <Input
                id="occupation"
                placeholder="Teacher, Doctor, etc."
                {...register("occupation", { required: "Occupation is required" })}
                className={errors.occupation ? "border-destructive" : ""}
              />
              {errors.occupation && (
                <p className="text-sm text-destructive">
                  {errors.occupation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly_income">Monthly Income (USD)</Label>
              <Input
                id="monthly_income"
                type="number"
                min="0"
                step="100"
                placeholder="4000"
                {...register("monthly_income", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="789 Oak Street, Apt 5C, City, State 12345"
                {...register("address", { required: "Address is required" })}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddGuarantor}
              className="gap-2 bg-transparent"
            >
              <Plus className="h-4 w-4" />
              Add Another Guarantor
            </Button>
            <p className="text-sm text-muted-foreground">
              {guarantors.length} guarantor(s) added
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onBack}
              className="gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button type="submit" size="lg" className="gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
