"use server";

import { neon } from "@neondatabase/serverless";
import type { OnboardingFormData } from "@/lib/types";

const sql = neon(process.env.DATABASE_URL!);

export async function submitLoanApplication(data: OnboardingFormData) {
  try {
    // Create user
    const [user] = await sql`
      INSERT INTO users (email, full_name, phone, role)
      VALUES (${data.personal.email}, ${data.personal.full_name}, ${data.personal.phone}, 'applicant')
      ON CONFLICT (email) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        updated_at = NOW()
      RETURNING id
    `;

    // Create applicant profile
    const [applicant] = await sql`
      INSERT INTO applicants (
        user_id, date_of_birth, national_id, address, city, 
        state, postal_code, country, marital_status, dependents
      )
      VALUES (
        ${user.id}, ${data.personal.date_of_birth}, ${data.personal.national_id},
        ${data.personal.address}, ${data.personal.city}, ${data.personal.state},
        ${data.personal.postal_code}, ${data.personal.country || "US"},
        ${data.personal.marital_status || null}, ${data.personal.dependents || 0}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        date_of_birth = EXCLUDED.date_of_birth,
        national_id = EXCLUDED.national_id,
        address = EXCLUDED.address,
        city = EXCLUDED.city,
        state = EXCLUDED.state,
        postal_code = EXCLUDED.postal_code,
        country = EXCLUDED.country,
        marital_status = EXCLUDED.marital_status,
        dependents = EXCLUDED.dependents,
        updated_at = NOW()
      RETURNING id
    `;

    // Create employment details
    await sql`
      INSERT INTO employment_details (
        applicant_id, employment_status, employer_name, job_title,
        monthly_income, employment_start_date, work_address, work_phone
      )
      VALUES (
        ${applicant.id}, ${data.employment.employment_status},
        ${data.employment.employer_name || null}, ${data.employment.job_title || null},
        ${data.employment.monthly_income}, ${data.employment.employment_start_date || null},
        ${data.employment.work_address || null}, ${data.employment.work_phone || null}
      )
      ON CONFLICT (applicant_id) DO UPDATE SET
        employment_status = EXCLUDED.employment_status,
        employer_name = EXCLUDED.employer_name,
        job_title = EXCLUDED.job_title,
        monthly_income = EXCLUDED.monthly_income,
        employment_start_date = EXCLUDED.employment_start_date,
        work_address = EXCLUDED.work_address,
        work_phone = EXCLUDED.work_phone,
        updated_at = NOW()
    `;

    // Create loan application
    const [loanApplication] = await sql`
      INSERT INTO loan_applications (
        applicant_id, loan_type, requested_amount, tenure_months, purpose, status
      )
      VALUES (
        ${applicant.id}, ${data.loan.loan_type}, ${data.loan.requested_amount},
        ${data.loan.tenure_months}, ${data.loan.purpose}, 'submitted'
      )
      RETURNING id
    `;

    // Create guarantors
    for (const guarantor of data.guarantors) {
      await sql`
        INSERT INTO guarantors (
          applicant_id, full_name, relationship, phone, email, address, occupation, monthly_income
        )
        VALUES (
          ${applicant.id}, ${guarantor.full_name}, ${guarantor.relationship},
          ${guarantor.phone}, ${guarantor.email || null}, ${guarantor.address},
          ${guarantor.occupation}, ${guarantor.monthly_income || null}
        )
      `;
    }

    // Create collaterals
    for (const collateral of data.collaterals) {
      await sql`
        INSERT INTO collaterals (
          loan_application_id, collateral_type, description, estimated_value
        )
        VALUES (
          ${loanApplication.id}, ${collateral.collateral_type},
          ${collateral.description}, ${collateral.estimated_value}
        )
      `;
    }

    // Log activity
    await sql`
      INSERT INTO activity_logs (user_id, action, entity_type, entity_id)
      VALUES (${user.id}, 'loan_application_submitted', 'loan_application', ${loanApplication.id})
    `;

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
    const [application] = await sql`
      SELECT 
        la.*,
        a.date_of_birth, a.national_id, a.address, a.city, a.state, a.postal_code, a.country,
        u.full_name, u.email, u.phone,
        ed.employment_status, ed.employer_name, ed.job_title, ed.monthly_income
      FROM loan_applications la
      JOIN applicants a ON la.applicant_id = a.id
      JOIN users u ON a.user_id = u.id
      LEFT JOIN employment_details ed ON a.id = ed.applicant_id
      WHERE la.id = ${applicationId}
    `;

    if (!application) {
      return null;
    }

    const guarantors = await sql`
      SELECT * FROM guarantors WHERE applicant_id = ${application.applicant_id}
    `;

    const collaterals = await sql`
      SELECT * FROM collaterals WHERE loan_application_id = ${applicationId}
    `;

    const repayments = await sql`
      SELECT * FROM repayments WHERE loan_application_id = ${applicationId} ORDER BY due_date ASC
    `;

    return {
      ...application,
      guarantors,
      collaterals,
      repayments,
    };
  } catch (error) {
    console.error("Error fetching loan application:", error);
    return null;
  }
}

export async function getAllLoanApplications(status?: string) {
  try {
    let applications;
    if (status && status !== "all") {
      applications = await sql`
        SELECT 
          la.*,
          u.full_name, u.email, u.phone,
          ed.monthly_income
        FROM loan_applications la
        JOIN applicants a ON la.applicant_id = a.id
        JOIN users u ON a.user_id = u.id
        LEFT JOIN employment_details ed ON a.id = ed.applicant_id
        WHERE la.status = ${status}
        ORDER BY la.created_at DESC
      `;
    } else {
      applications = await sql`
        SELECT 
          la.*,
          u.full_name, u.email, u.phone,
          ed.monthly_income
        FROM loan_applications la
        JOIN applicants a ON la.applicant_id = a.id
        JOIN users u ON a.user_id = u.id
        LEFT JOIN employment_details ed ON a.id = ed.applicant_id
        ORDER BY la.created_at DESC
      `;
    }
    return applications;
  } catch (error) {
    console.error("Error fetching loan applications:", error);
    return [];
  }
}

export async function updateLoanStatus(
  applicationId: string,
  status: string,
  reviewerId: string,
  rejectionReason?: string
) {
  try {
    const updateData: Record<string, unknown> = {
      status,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    };

    if (status === "rejected" && rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    if (status === "approved") {
      // For simplicity, approved amount equals requested amount
      await sql`
        UPDATE loan_applications
        SET status = ${status}, 
            reviewed_by = ${reviewerId}, 
            reviewed_at = NOW(),
            approved_amount = requested_amount,
            interest_rate = CASE 
              WHEN loan_type = 'personal' THEN 12.5
              WHEN loan_type = 'business' THEN 15.0
              WHEN loan_type = 'mortgage' THEN 7.5
              WHEN loan_type = 'auto' THEN 9.0
              WHEN loan_type = 'education' THEN 6.5
              ELSE 10.0
            END,
            updated_at = NOW()
        WHERE id = ${applicationId}
      `;
    } else if (status === "rejected") {
      await sql`
        UPDATE loan_applications
        SET status = ${status}, 
            reviewed_by = ${reviewerId}, 
            reviewed_at = NOW(),
            rejection_reason = ${rejectionReason || null},
            updated_at = NOW()
        WHERE id = ${applicationId}
      `;
    } else if (status === "disbursed") {
      await sql`
        UPDATE loan_applications
        SET status = ${status}, 
            disbursed_at = NOW(),
            updated_at = NOW()
        WHERE id = ${applicationId}
      `;

      // Generate repayment schedule
      const [loan] = await sql`
        SELECT * FROM loan_applications WHERE id = ${applicationId}
      `;

      if (loan && loan.approved_amount && loan.tenure_months) {
        const rate = (loan.interest_rate || 10) / 100 / 12;
        const payment =
          (loan.approved_amount * rate * Math.pow(1 + rate, loan.tenure_months)) /
          (Math.pow(1 + rate, loan.tenure_months) - 1);

        for (let i = 1; i <= loan.tenure_months; i++) {
          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + i);
          await sql`
            INSERT INTO repayments (loan_application_id, due_date, amount_due, status)
            VALUES (${applicationId}, ${dueDate.toISOString()}, ${payment}, 'pending')
          `;
        }
      }
    } else {
      await sql`
        UPDATE loan_applications
        SET status = ${status}, 
            updated_at = NOW()
        WHERE id = ${applicationId}
      `;
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating loan status:", error);
    return { success: false, message: "Failed to update status" };
  }
}

export async function getDashboardStats() {
  try {
    const [stats] = await sql`
      SELECT
        COUNT(*) as total_applications,
        COUNT(*) FILTER (WHERE status = 'submitted' OR status = 'under_review') as pending_review,
        COUNT(*) FILTER (WHERE status = 'approved' OR status = 'disbursed' OR status = 'repaying') as approved_loans,
        COALESCE(SUM(approved_amount) FILTER (WHERE status = 'disbursed' OR status = 'repaying' OR status = 'completed'), 0) as total_disbursed,
        COUNT(*) FILTER (WHERE status = 'repaying') as active_loans
      FROM loan_applications
    `;

    const [overdueStats] = await sql`
      SELECT COUNT(DISTINCT loan_application_id) as overdue_payments
      FROM repayments
      WHERE status = 'overdue' OR (status = 'pending' AND due_date < NOW())
    `;

    return {
      totalApplications: Number(stats.total_applications),
      pendingReview: Number(stats.pending_review),
      approvedLoans: Number(stats.approved_loans),
      totalDisbursed: Number(stats.total_disbursed),
      activeLoans: Number(stats.active_loans),
      overduePayments: Number(overdueStats?.overdue_payments || 0),
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
