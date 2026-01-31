import { getClientById } from "@/app/actions/admin";
import { PersonalInfoForm } from "@/components/client/profile/personal-info-form";
import { AddressForm } from "@/components/client/profile/address-form";
import { EmploymentForm } from "@/components/client/profile/employment-form";
import { RefereeForm } from "@/components/client/profile/referee-form";
import { BankDetails } from "@/components/client/profile/bank-details";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ClientDetailsPage({
  params,
}: {
    params: Promise<{ id: string }>;
}) {
  const { id } = (await params);
  const { data: client, error } = await getClientById(id);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  const employment = client.employmentDetails?.[0]
    ? {
        ...client.employmentDetails[0],
        netSalary: client.employmentDetails[0].netSalary.toString(),
      }
    : undefined;

  const referees = client.referees?.map((referee) => ({
    ...referee,
    createdAt: referee.createdAt?.toISOString(),
  }));


  const bankDetails = client.bankDetails?.[0]
    ? {
      ...client.bankDetails[0],
      proofDocument: client.bankDetails[0].proofDocument ?? undefined,
    }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          {client.surname} {client.otherNames}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <PersonalInfoForm client={client} isReadOnly={true} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              <AddressForm addresses={client.addresses} isReadOnly={true} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <EmploymentForm employment={employment} isReadOnly={true} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
            </CardHeader>
            <CardContent>
      
          <BankDetails bankDetails={
            {
              ...bankDetails,
              accountName:bankDetails?.accountName as string,
              accountNumber:bankDetails?.accountNumber as string,
              branch:bankDetails?.branch as string,
              bankName:bankDetails?.bankName as string,
            proofDocumentUrl:bankDetails?.proofDocumentUrl as string,
            createdAt:bankDetails?.createdAt.toISOString() as string,
                  updatedAt: bankDetails?.createdAt.toISOString() as string
            }
          } isReadOnly={true} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referees</CardTitle>
            </CardHeader>
            <CardContent>
       
            <RefereeForm referees={referees} isReadOnly={true} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
