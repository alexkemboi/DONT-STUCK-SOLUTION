"use server";

import { Resend } from "resend";
import { ResetPasswordEmail } from "@/components/emails/reset-password-email";

interface SendResetPasswordEmailProps {
  userEmail: string;
  userName: string;
  resetLink: string;
}

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendResetPasswordEmail({
  userEmail,
  userName,
  resetLink,
}: SendResetPasswordEmailProps) {


  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: userEmail,
      subject: "Reset your password",
      react: ResetPasswordEmail({ userName, resetLink }),
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return { success: false, error: (error as Error).message };
  }
}