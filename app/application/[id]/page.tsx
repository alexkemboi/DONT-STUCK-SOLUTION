import { getLoanApplication } from "@/app/actions/loan-actions";
import { ApplicationDetails } from "@/components/application/application-details";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Application Details | Don't Stuck Solution",
  description: "View your loan application status and details",
};

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await getLoanApplication(id);

  if (!application || ('success' in application && !application.success)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <ApplicationDetails application={application} />
    </div>
  );
}
