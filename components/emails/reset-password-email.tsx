import * as React from 'react';

interface ResetPasswordEmailProps {
  userName: string;
  resetLink: string;
}

export function ResetPasswordEmail({ userName, resetLink }: ResetPasswordEmailProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your Password</title>
        <style>
          {`
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #eeeeee;
            }
            .header h1 {
              color: #333333;
              font-size: 24px;
              margin: 0;
            }
            .content {
              padding: 20px 0;
              line-height: 1.6;
              color: #555555;
            }
            .content p {
              margin-bottom: 15px;
            }
            .button-container {
              text-align: center;
              margin-top: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #eeeeee;
              margin-top: 30px;
              font-size: 12px;
              color: #aaaaaa;
            }
          `}
        </style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>Dont Stuck Solutions</h1>
          </div>
          <div className="content">
            <p>Hello {userName},</p>
            <p>You have requested to reset your password for your Dont Stuck Solutions account.</p>
            <p>Please click the button below to reset your password:</p>
            <div className="button-container">
              <a href={resetLink} className="button">Reset Password</a>
            </div>
            <p>If you did not request a password reset, please ignore this email. This link is valid for a limited time.</p>
            <p>Thank you,</p>
            <p>The Dont Stuck Solutions Team</p>
          </div>
          <div className="footer">
            <p>&copy; {new Date().getFullYear()} Dont Stuck Solutions. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  );
}