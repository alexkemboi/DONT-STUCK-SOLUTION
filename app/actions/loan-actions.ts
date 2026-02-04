"use server";

import { neon } from "@neondatabase/serverless";

import prisma from "@/lib/prisma";
import type { OnboardingFormData } from "@/lib/types";
import { auth } from "@/lib/auth";
import { generateRepaymentSchedule } from "@/services/repayment-schedule.service";
import { LoanApplicationStatus, ScheduleStatus } from "@/lib/generated/prisma";

export async function submitLoanApplication(data: OnboardingFormData) {
  try {
    const session = await auth.api.getSession();
    if (!session?.user) {
      return {
        success: false,
        message: "User not authenticated. Please log in.",
      };
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: data.personal.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.personal.email,
          name: data.personal.full_name,
          phone: data.personal.phone,
          role: "Client",
        },
      });
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: data.personal.full_name,
          phone: data.personal.phone,
        },
      });
    }

    // Find or create client profile
    let client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          userId: user.id,
          title: data.personal.title,
          surname: data.personal.full_name.split(" ").slice(0, -1).join(" "), // Assuming last word is otherNames
          otherNames: data.personal.full_name.split(" ").pop() || "",
          dateOfBirth: new Date(data.personal.date_of_birth),
          maritalStatus: data.personal.marital_status,
          nationality: data.personal.country || "Unknown",
          dependents: data.personal.dependents || 0,
          idPassportNo: data.personal.national_id,
          phoneMobile: data.personal.phone,
          emailPersonal: data.personal.email,
        },
      });
    } else {
      // Update existing client
      client = await prisma.client.update({
        where: { id: client.id },
        data: {
          title: data.personal.title,
          surname: data.personal.full_name.split(" ").slice(0, -1).join(" "),
          otherNames: data.personal.full_name.split(" ").pop() || "",
          dateOfBirth: new Date(data.personal.date_of_birth),
          maritalStatus: data.personal.marital_status,
          nationality: data.personal.country || "Unknown",
          dependents: data.personal.dependents || 0,
          idPassportNo: data.personal.national_id,
          phoneMobile: data.personal.phone,
          emailPersonal: data.personal.email,
        },
      });
    }

    // Create or update client address
    await prisma.clientAddress.upsert({
      where: { clientId: client.id },
      update: {
        postalAddress: data.personal.address,
        postalCode: data.personal.postal_code,
        townCity: data.personal.city,
        residentialAddress: data.personal.address, // Assuming residential is same as postal for now
        location: data.personal.state,
        // No direct mapping for country in ClientAddress, handled by Client.nationality
      },
      create: {
        clientId: client.id,
        postalAddress: data.personal.address,
        postalCode: data.personal.postal_code,
        townCity: data.personal.city,
        residentialAddress: data.personal.address,
        location: data.personal.state,
      },
    });

    // Create or update employment details
    await prisma.employmentDetail.upsert({
      where: { clientId: client.id },
      update: {
        employmentType: data.employment.employment_status,
        employerName: data.employment.employer_name || null,
        jobTitle: data.employment.job_title || null,
        netSalary: data.employment.monthly_income,
        dateJoined: data.employment.employment_start_date
          ? new Date(data.employment.employment_start_date)
          : null,
        branchLocation: data.employment.work_address || null,
        telephone: data.employment.work_phone || null,
      },
      create: {
        clientId: client.id,
        employmentType: data.employment.employment_status,
        employerName: data.employment.employer_name || null,
        jobTitle: data.employment.job_title || null,
        netSalary: data.employment.monthly_income,
        dateJoined: data.employment.employment_start_date
          ? new Date(data.employment.employment_start_date)
          : null,
        branchLocation: data.employment.work_address || null,
        telephone: data.employment.work_phone || null,
      },
    });

    // Create loan application
    const loanApplication = await prisma.loanApplication.create({
      data: {
        clientId: client.id,
        purpose: data.loan.purpose,
        amountRequested: data.loan.requested_amount,
        repaymentPeriod: data.loan.tenure_months,
        status: LoanApplicationStatus.Pending, // Initial status
        startDate: new Date(), // Assuming start date is now
        interestRate: 20, // Default interest rate
      },
    });

    // Create guarantors
    for (const guarantorData of data.guarantors) {
      await prisma.guarantor.create({
        data: {
          loanId: loanApplication.id,
          fullName: guarantorData.full_name,
          relationship: guarantorData.relationship,
          phone: guarantorData.phone,
          email: guarantorData.email || null,
          idNumber: guarantorData.id_number || null, // Assuming id_number maps to idNumber
        },
      });
    }

    // Collaterals - This part needs schema definition. For now, skipping or mapping to LoanSecurity
    // Assuming collateral_type 'vehicle' maps to VehicleSecurity, others to LoanSecurity
    for (const collateralData of data.collaterals) {
      if (collateralData.collateral_type === "Vehicle") {
        await prisma.vehicleSecurity.create({
          data: {
            loanId: loanApplication.id,
            registrationNumber: collateralData.registration_number || "N/A",
            chassisNumber: collateralData.chassis_number || "N/A",
            engineNumber: collateralData.engine_number || "N/A",
            yearOfManufacture: collateralData.year_of_manufacture || 2000,
            make: collateralData.make || "Unknown",
            model: collateralData.model || "Unknown",
            bodyColor: collateralData.body_color || "Unknown",
          },
        });
      } else {
        // Generic LoanSecurity for other types
        await prisma.loanSecurity.create({
          data: {
            loanId: loanApplication.id,
            // Map generic collateral fields to LoanSecurity fields if applicable
            // For now, just creating a basic entry
            idCopy: true, // Placeholder
            passportPhoto: true, // Placeholder
            appointmentLetter: true, // Placeholder
            payslips: true, // Placeholder
            bankStatement: true, // Placeholder
          },
        });
      }
    }

    // Log activity
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE",
        entity: "LoanApplication",
        entityId: loanApplication.id,
        newValue: {
          clientId: client.id,
          purpose: data.loan.purpose,
          amountRequested: data.loan.requested_amount,
        },
      },
    }).catch(() => {});

    return {
      success: true,
      message: "Your loan application has been submitted successfully! We will review it and get back to you within 2-3 business days.",
      applicationId: loanApplication.id,
    };
  } catch (error) {
    console.error("Error submitting loan application:", error);
    return {
      success: false,
      message: "Failed to submit your application. Please try again.",
    };
  }
}

export async function getLoanApplication(applicationId: string) {
  try {
    const session = await auth.api.getSession();
    if (!session?.user) {
      return {
        success: false,
        message: "User not authenticated. Please log in.",
      };
    }

    const application = await prisma.loanApplication.findUnique({
      where: { id: applicationId },
      include: {
        client: {
          include: {
            user: true,
            addresses: true,
            employmentDetails: true,
          },
        },
        guarantors: true,
        loanSecurity: true,
        vehicleSecurity: true,
        repaymentSchedule: {
          orderBy: { installmentNumber: "asc" },
        },
      },
    });

    if (!application) {
      return null;
    }

    // Flatten the structure for easier consumption if needed, or return as is
    const client = application.client;
    const user = client?.user;
    const address = client?.addresses[0]; // Assuming one address for simplicity
    const employment = client?.employmentDetails[0]; // Assuming one employment detail

    return {
      ...application,
      // Flattened client/user/employment details
      dateOfBirth: client?.dateOfBirth,
      nationalId: client?.idPassportNo,
      address: address?.residentialAddress,
      city: address?.townCity,
      state: address?.location,
      postalCode: address?.postalCode,
      country: client?.nationality,
      fullName: user?.name,
      email: user?.email,
      phone: user?.phone,
      employmentStatus: employment?.employmentType,
      employerName: employment?.employerName,
      jobTitle: employment?.jobTitle,
      monthlyIncome: employment?.netSalary,
      // Collaterals (combine loanSecurity and vehicleSecurity)
      collaterals: application.loanSecurity || application.vehicleSecurity, // Adjust as needed for multiple collaterals
      repayments: application.repaymentSchedule,
    };
  } catch (error) {
    console.error("Error fetching loan application:", error);
    return null;
  }
}

export async function getAllLoanApplications(status?: string) {
  const session = await auth.api.getSession();
  if (!session?.user) {
    return {
      success: false,
      message: "User not authenticated. Please log in.",
    };
  }

  try {
    const whereClause: any = {};
    if (status && status !== "all") {
      whereClause.status = status;
    }

    const applications = await prisma.loanApplication.findMany({
      where: whereClause,
      include: {
        client: {
          include: {
            user: true,
            employmentDetails: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return applications.map((app) => ({
      ...app,
      fullName: app.client?.user?.name,
      email: app.client?.user?.email,
      phone: app.client?.user?.phoneMobile, // Assuming phoneMobile is the primary phone
      monthlyIncome: app.client?.employmentDetails[0]?.netSalary, // Assuming one employment detail
    }));
  } catch (error) {
    console.error("Error fetching loan applications:", error);
    return [];
  }
}

export async function updateLoanStatus(
  applicationId: string,
  status: LoanApplicationStatus, // Use the enum type
  reviewerId: string,
  rejectionReason?: string
) {
  try {
    const session = await auth.api.getSession();
    if (!session?.user) {
      return {
        success: false,
        message: "User not authenticated. Please log in.",
      };
    }

    const loan = await prisma.loanApplication.findUnique({
      where: { id: applicationId },
    });

    if (!loan) {
      return { success: false, message: "Loan application not found" };
    }

    const updateData: any = {
      status: status,
      reviewedById: reviewerId,
      reviewedAt: new Date(),
    };

    if (status === LoanApplicationStatus.Rejected) {
      updateData.rejectionReason = rejectionReason || null;
    }

    if (status === LoanApplicationStatus.Approved) {
      // For simplicity, approved amount equals requested amount
      updateData.approvedAmount = loan.amountRequested;
      // Set interest rate based on purpose (loan_type)
      updateData.interestRate = 20; // Default to 20% as per acceptance criteria
    }

    const updatedLoan = await prisma.loanApplication.update({
      where: { id: applicationId },
      data: updateData,
    });

    if (status === LoanApplicationStatus.Disbursed) {
      // Create LoanDisbursement entry
      await prisma.loanDisbursement.create({
        data: {
          loanId: applicationId,
          amount: updatedLoan.approvedAmount || updatedLoan.amountRequested,
          method: "Bank", // Default method, can be made dynamic
          disbursedAt: new Date(),
        },
      });

      // Generate repayment schedule
      const scheduleResult = await generateRepaymentSchedule(applicationId);
      if (!scheduleResult.success) {
        console.error("Failed to generate repayment schedule:", scheduleResult.error);
        // Optionally revert loan status or log a critical error
        return { success: false, message: "Failed to generate repayment schedule" };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating loan status:", error);
    return { success: false, message: "Failed to update status" };
  }
}

export async function getDashboardStats() {
  const session = await auth.api.getSession();
  if (!session?.user) {
    return {
      success: false,
      message: "User not authenticated. Please log in.",
    };
  }

  try {
    const totalApplications = await prisma.loanApplication.count();
    const pendingReview = await prisma.loanApplication.count({
      where: {
        status: { in: ["Pending", "Approved"] }, // Assuming 'Approved' means awaiting disbursement
      },
    });
    const approvedLoans = await prisma.loanApplication.count({
      where: {
        status: { in: ["Approved", "Disbursed", "Active", "NPL", "Closed"] },
      },
    });
    const totalDisbursed = await prisma.loanApplication.aggregate({
      _sum: {
        approvedAmount: true,
      },
      where: {
        status: { in: ["Disbursed", "Active", "NPL", "Closed"] },
      },
    });
    const activeLoans = await prisma.loanApplication.count({
      where: {
        status: "Active",
      },
    });

    const overduePayments = await prisma.repaymentSchedule.count({
      where: {
        status: "Overdue",
      },
    });

    return {
      totalApplications: totalApplications,
      pendingReview: pendingReview,
      approvedLoans: approvedLoans,
      totalDisbursed: Number(totalDisbursed._sum.approvedAmount || 0),
      activeLoans: activeLoans,
      overduePayments: overduePayments,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalApplications: 0,
      pendingReview: 0,
      approvedLoans: 0,
      totalDisbursed: 0,
      activeLoans: 0,
      overduePayments: 0,
    };
  }
}
