import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Don't Stuck Solution - Loan Management",
  description: 'Professional loan management platform for applicants, administrators, and investors',
  icons: {
    icon: [
      {
        url: '/cash-money-business-growth-saving-currency-profit-svgrepo-com.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/cash-money-business-growth-saving-currency-profit-svgrepo-com.svg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/cash-money-business-growth-saving-currency-profit-svgrepo-com.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/cash-money-business-growth-saving-currency-profit-svgrepo-com.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
