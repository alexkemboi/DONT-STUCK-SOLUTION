// app/api/send-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { recipientEmail, message } = await req.json();

    if (!recipientEmail || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "recipientEmail and message are required",
        },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"IKONEX ENTERPRISES" <${process.env.GOOGLE_EMAIL}>`,
      to: recipientEmail,
      subject: "New Message",
html: `
<div style="margin:0;padding:0;background-color:#eef2f7;padding:40px 20px;">
  <table align="center" width="100%" cellpadding="0" cellspacing="0"
    style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;
    box-shadow:0 10px 28px rgba(17,24,39,0.10);font-family:Arial,sans-serif;">

    <!-- Header -->
    <tr>
      <td style="background:linear-gradient(135deg,#0f172a,#1e3a8a);padding:30px;text-align:center;">
        <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:0.4px;">
          DON’T STUCK SOLUTIONS
        </h1>
        <p style="margin:8px 0 0;color:#dbeafe;font-size:13px;letter-spacing:0.3px;">
          Smart Finance • Trusted Support • Fast Solutions
        </p>
      </td>
    </tr>

    <!-- Accent Bar -->
    <tr>
      <td style="height:5px;background:linear-gradient(90deg,#2563eb,#10b981,#f59e0b);"></td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:34px 30px;">

        <h2 style="margin:0 0 16px;color:#111827;font-size:22px;font-weight:700;">
          Notification Message
        </h2>

        <p style="margin:0 0 18px;color:#475569;font-size:14px;line-height:1.7;">
          You have received a secure notification from the DSS platform.
        </p>

        <div style="background:#f8fafc;border:1px solid #dbeafe;border-left:5px solid #2563eb;
          padding:18px;border-radius:10px;color:#111827;font-size:15px;line-height:1.7;">
          ${message}
        </div>

        <p style="margin:22px 0 0;color:#64748b;font-size:13px;line-height:1.6;">
          If action is required, kindly log in to your DSS portal or contact support.
        </p>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:24px;text-align:center;">

        <p style="margin:0;color:#0f172a;font-size:13px;font-weight:600;">
          DON’T STUCK SOLUTIONS
        </p>

        <p style="margin:8px 0 0;color:#64748b;font-size:12px;">
          Nairobi, Kenya • +254 725 228 380
        </p>

        <p style="margin:6px 0 0;color:#64748b;font-size:12px;">
          dontstucksolutions2@gmail.com
        </p>

        <p style="margin:12px 0 0;color:#94a3b8;font-size:11px;">
          © ${new Date().getFullYear()} DSS. All rights reserved.
        </p>

      </td>
    </tr>

  </table>
</div>
`
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}