import * as React from 'react';

interface ResetPasswordEmailProps {
  userName: string;
  resetLink: string;
}

const colors = {
  brand: '#0f172a',
  accent: '#2563eb',
  accentDark: '#1d4ed8',
  text: '#334155',
  muted: '#94a3b8',
  border: '#e2e8f0',
  bg: '#f1f5f9',
  card: '#ffffff',
};

export function ResetPasswordEmail({ userName, resetLink }: ResetPasswordEmailProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light" />
        <title>Reset Your Password</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: colors.bg,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ backgroundColor: colors.bg, padding: '40px 16px' }}
        >
          <tbody>
            <tr>
              <td align="center">
                <table
                  role="presentation"
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{
                    maxWidth: 560,
                    width: '100%',
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
                  }}
                >
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td
                        style={{
                          backgroundColor: colors.brand,
                          padding: '28px 40px',
                          textAlign: 'center',
                        }}
                      >
                        <span
                          style={{
                            color: '#ffffff',
                            fontSize: 18,
                            fontWeight: 700,
                            letterSpacing: 0.3,
                          }}
                        >
                          Dont Stuck Solutions
                        </span>
                      </td>
                    </tr>

                    {/* Content */}
                    <tr>
                      <td style={{ padding: '40px 40px 24px' }}>
                        <h1
                          style={{
                            margin: '0 0 16px',
                            fontSize: 22,
                            fontWeight: 700,
                            color: colors.brand,
                          }}
                        >
                          Reset your password
                        </h1>
                        <p
                          style={{
                            margin: '0 0 16px',
                            fontSize: 15,
                            lineHeight: '24px',
                            color: colors.text,
                          }}
                        >
                          Hi {userName},
                        </p>
                        <p
                          style={{
                            margin: '0 0 24px',
                            fontSize: 15,
                            lineHeight: '24px',
                            color: colors.text,
                          }}
                        >
                          We received a request to reset the password for your Dont Stuck
                          Solutions account. Click the button below to choose a new password.
                        </p>

                        <table role="presentation" cellPadding={0} cellSpacing={0}>
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  borderRadius: 8,
                                  backgroundColor: colors.accent,
                                }}
                              >
                                <a
                                  href={resetLink}
                                  style={{
                                    display: 'inline-block',
                                    padding: '14px 28px',
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: '#ffffff',
                                    textDecoration: 'none',
                                    borderRadius: 8,
                                  }}
                                >
                                  Reset Password
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p
                          style={{
                            margin: '28px 0 0',
                            fontSize: 13,
                            lineHeight: '20px',
                            color: colors.muted,
                          }}
                        >
                          This link will expire in 1 hour. If the button above doesn&apos;t
                          work, copy and paste this URL into your browser:
                        </p>
                        <p
                          style={{
                            margin: '8px 0 0',
                            fontSize: 13,
                            lineHeight: '20px',
                            wordBreak: 'break-all',
                          }}
                        >
                          <a href={resetLink} style={{ color: colors.accentDark }}>
                            {resetLink}
                          </a>
                        </p>
                      </td>
                    </tr>

                    {/* Security notice */}
                    <tr>
                      <td style={{ padding: '0 40px 32px' }}>
                        <table
                          role="presentation"
                          width="100%"
                          cellPadding={0}
                          cellSpacing={0}
                          style={{
                            backgroundColor: colors.bg,
                            borderRadius: 8,
                          }}
                        >
                          <tbody>
                            <tr>
                              <td style={{ padding: '16px 20px' }}>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: 13,
                                    lineHeight: '20px',
                                    color: colors.text,
                                  }}
                                >
                                  Didn&apos;t request this? You can safely ignore this email
                                  &mdash; your password will remain unchanged.
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td
                        style={{
                          padding: '24px 40px',
                          borderTop: `1px solid ${colors.border}`,
                          textAlign: 'center',
                        }}
                      >
                        <p style={{ margin: 0, fontSize: 12, color: colors.muted }}>
                          &copy; {new Date().getFullYear()} Dont Stuck Solutions. All rights
                          reserved.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
