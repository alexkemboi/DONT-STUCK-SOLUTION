"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CollateralFormData, CollateralType } from "@/lib/types";
import { ArrowLeft, Building2, Plus, Send, Trash2 } from "lucide-react";

interface CollateralsFormProps {
  data: CollateralFormData[];
  onSubmit: (data: CollateralFormData[]) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const emptyCollateral: CollateralFormData = {
  collateral_type: "property",
  description: "",
  estimated_value: 0,
};

export function CollateralsForm({
  data,
  onSubmit,
  onBack,
  isSubmitting,
}: CollateralsFormProps) {
  const [collaterals, setCollaterals] = useState<CollateralFormData[]>(
    data.length > 0 ? data : [{ ...emptyCollateral }]
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CollateralFormData>({
    defaultValues: collaterals[currentIndex],
  });

  const collateralType = watch("collateral_type");

  const saveCurrentCollateral = (formData: CollateralFormData) => {
    const updated = [...collaterals];
    updated[currentIndex] = formData;
    setCollaterals(updated);
    return updated;
  };

  const handleAddCollateral = handleSubmit((formData) => {
    const updated = saveCurrentCollateral(formData);
    updated.push({ ...emptyCollateral });
    setCollaterals(updated);
    setCurrentIndex(updated.length - 1);
    reset(emptyCollateral);
  });

  const handleRemoveCollateral = (index: number) => {
    if (collaterals.length <= 1) return;
    const updated = collaterals.filter((_, i) => i !== index);
    setCollaterals(updated);
    const newIndex = Math.min(currentIndex, updated.length - 1);
    setCurrentIndex(newIndex);
    reset(updated[newIndex]);
  };

  const handleSelectCollateral = (index: number) => {
    handleSubmit((formData) => {
      saveCurrentCollateral(formData);
      setCurrentIndex(index);
      reset(collaterals[index]);
    })();
  };

  const handleFormSubmit = handleSubmit((formData) => {
    const updated = saveCurrentCollateral(formData);
    // Filter out empty collaterals
    const validCollaterals = updated.filter(
      (c) => c.description && c.estimated_value > 0
    );
    onSubmit(validCollaterals);
  });

  const getCollateralLabel = (type: CollateralType) => {
    const labels: Record<CollateralType, string> = {
      property: "Property",
      vehicle: "Vehicle",
      equipment: "Equipment",
      inventory: "Inventory",
      other: "Other",
    };
    return labels[type];
  };

  const totalCollateralValue = collaterals.reduce(
    (sum, c) => sum + (c.estimated_value || 0),
    0
  );

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Collateral Information</CardTitle>
            <CardDescription>
              Add collateral to secure your loan (optional but recommended)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {collaterals.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {collaterals.map((c, index) => (
              <Button
                key={index}
                type="button"
                variant={currentIndex === index ? "default" : "outline"}
                size="sm"
                onClick={() => handleSelectCollateral(index)}
                className="gap-2"
              >
                {c.collateral_type
                  ? getCollateralLabel(c.collateral_type)
                  : `Collateral ${index + 1}`}
                {collaterals.length > 1 && (
                  <Trash2
                    className="h-3 w-3 opacity-70 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCollateral(index);
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
              <Label htmlFor="collateral_type">Collateral Type *</Label>
              <Select
                value={collateralType}
                onValueChange={(value) =>
                  setValue("collateral_type", value as CollateralType)
                }
              >
                <SelectTrigger id="collateral_type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property">
                    Property (Land, Building)
                  </SelectItem>
                  <SelectItem value="vehicle">Vehicle (Car, Truck)</SelectItem>
                  <SelectItem value="equipment">
                    Equipment (Machinery)
                  </SelectItem>
                  <SelectItem value="inventory">
                    Inventory (Stock, Goods)
                  </SelectItem>
                  <SelectItem value="other">Other Assets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_value">Estimated Value (USD) *</Label>
              <Input
                id="estimated_value"
                type="number"
                min="0"
                step="1000"
                placeholder="50000"
                {...register("estimated_value", {
                  required: "Estimated value is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Value must be greater than 0" },
                })}
                className={errors.estimated_value ? "border-destructive" : ""}
              />
              {errors.estimated_value && (
                <p className="text-sm text-destructive">
                  {errors.estimated_value.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide details about the collateral (e.g., 2020 Toyota Camry, VIN: ABC123, Located at...)"
                rows={3}
                {...register("description", {
                  required: "Description is required",
                })}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t pt-4">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCollateral}
                className="gap-2 bg-transparent"
              >
                <Plus className="h-4 w-4" />
                Add Another Collateral
              </Button>
              <p className="text-sm text-muted-foreground">
                {collaterals.length} collateral(s) added
              </p>
            </div>
            <p className="text-sm font-medium">
              Total Value:{" "}
              <span className="text-primary">
                ${totalCollateralValue.toLocaleString()}
              </span>
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
            <Button
              type="submit"
              size="lg"
              className="gap-2 bg-success text-success-foreground hover:bg-success/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  Submit Application
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
