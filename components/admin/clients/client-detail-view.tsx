"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalInfoForm } from "@/components/client/profile/personal-info-form";
import { AddressForm } from "@/components/client/profile/address-form";
import { EmploymentForm } from "@/components/client/profile/employment-form";
import { RefereeForm } from "@/components/client/profile/referee-form";
import { BankDetails } from "@/components/client/profile/bank-details";

interface ClientDetailViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any;
  addresses: any[];
  employment: any | undefined;
  bankDetails: any | undefined;
  referees: any[];
}

export function ClientDetailView({
  client,
  addresses,
  employment,
  bankDetails,
  referees,
}: ClientDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          {client.surname} {client.otherNames}
        </h1>
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Done Editing
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Client
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <PersonalInfoForm
                client={client as any}
                isReadOnly={!isEditing}
                onSuccess={handleSuccess}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              <AddressForm
                addresses={addresses as any}
                isReadOnly={!isEditing}
                clientId={client.id}
                onSuccess={handleSuccess}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <EmploymentForm
                employment={employment as any}
                isReadOnly={!isEditing}
                clientId={client.id}
                onSuccess={handleSuccess}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
            </CardHeader>
            <CardContent>
              <BankDetails
                bankDetails={bankDetails as any}
                isReadOnly={!isEditing}
                clientId={client.id}
                onSuccess={handleSuccess}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referees</CardTitle>
            </CardHeader>
            <CardContent>
              <RefereeForm
                referees={referees as any}
                isReadOnly={!isEditing}
                clientId={client.id}
                onSuccess={handleSuccess}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
