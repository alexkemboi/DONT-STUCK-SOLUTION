"use server";

import { Resend } from "resend";
import { ResetPasswordEmail } from "@/components/emails/reset-password-email";

interface SendResetPasswordEmailProps {
  userEmail: string;
  userName: string;
  resetLink: string;
}

export async function sendResetPasswordEmail({
  userEmail,
  userName,
  resetLink,
}: SendResetPasswordEmailProps) {

  const apikey = process.env.RESEND_API_KEY;
  if(!apikey){
    throw new Error("Resend API key is not defined in environment variables.");
  }

  const resend = new Resend(apikey);


  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: userEmail,
      subject: "Reset your password",
      react: ResetPasswordEmail({ userName, resetLink }),
    });
    return { success: true };
  } catch (error:any) {
    console.log(error?.message)
    console.error("Error sending reset password email:", error);
    return { success: false, error: (error as Error).message };
  }
}