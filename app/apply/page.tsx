import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Banknote,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  Home,
  GraduationCap,
  Car,
  Shield,
  Users,
  Calculator,
} from "lucide-react";

export const metadata = {
  title: "Apply for a Loan | Don't Stuck Solution",
  description:
    "Complete our simple application process to get the financing you need",
};

const loanTypes = [
  {
    name: "Personal Loan",
    icon: Users,
    rate: "12.5%",
    minAmount: "$1,000",
    maxAmount: "$50,000",
    term: "6-60 months",
    description: "For personal expenses, emergencies, or debt consolidation",
  },
  {
    name: "Business Loan",
    icon: Briefcase,
    rate: "15.0%",
    minAmount: "$5,000",
    maxAmount: "$500,000",
    term: "12-120 months",
    description: "Fund your business growth, equipment, or working capital",
  },
  {
    name: "Mortgage",
    icon: Home,
    rate: "7.5%",
    minAmount: "$50,000",
    maxAmount: "$2,000,000",
    term: "5-30 years",
    description: "Purchase your dream home with competitive rates",
  },
  {
    name: "Auto Loan",
    icon: Car,
    rate: "9.0%",
    minAmount: "$5,000",
    maxAmount: "$100,000",
    term: "12-84 months",
    description: "Finance your new or used vehicle purchase",
  },
  {
    name: "Education Loan",
    icon: GraduationCap,
    rate: "6.5%",
    minAmount: "$1,000",
    maxAmount: "$200,000",
    term: "12-120 months",
    description: "Invest in your future with flexible education financing",
  },
];

const applicationSteps = [
  {
    step: 1,
    title: "Personal Information",
    description: "Basic details including name, contact, and identification",
    time: "2 min",
  },
  {
    step: 2,
    title: "Employment Details",
    description: "Your current employment status and income information",
    time: "2 min",
  },
  {
    step: 3,
    title: "Loan Requirements",
    description: "Select loan type, amount, and preferred repayment terms",
    time: "3 min",
  },
  {
    step: 4,
    title: "Guarantor Information",
    description: "Add guarantors who can vouch for your application",
    time: "3 min",
  },
  {
    step: 5,
    title: "Collateral Details",
    description: "Provide security for your loan if applicable",
    time: "2 min",
  },
];

const requirements = [
  "Valid government-issued ID (National ID, Passport, or Driver's License)",
  "Proof of income (Pay slips, bank statements, or tax returns)",
  "Proof of residence (Utility bill or rental agreement)",
  "Employment verification letter (for employed applicants)",
  "Business registration documents (for business loans)",
  "At least one guarantor with valid contact information",
];

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Banknote className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">{"Don't Stuck Solution"}</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/investor"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Invest
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin
            </Link>
          </nav>
          <Link href="/apply/start">
            <Button>Start Application</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Clock className="h-4 w-4" />
              Application takes only 10-15 minutes
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
              Apply for a Loan Today
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              Get the financing you need with our simple 5-step application
              process. Competitive rates, flexible terms, and fast approvals.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/apply/start">
                <Button size="lg" className="gap-2">
                  Start Your Application
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent" asChild>
                <a href="#loan-types">
                  <Calculator className="h-4 w-4" />
                  View Loan Options
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Simple 5-Step Process
            </h2>
            <p className="mt-3 text-muted-foreground">
              Complete your application in just a few minutes
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-5">
            {applicationSteps.map((step, index) => (
              <div key={step.step} className="relative">
                {index < applicationSteps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-border md:block" />
                )}
                <Card className="relative h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                        {step.step}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ~{step.time}
                      </span>
                    </div>
                    <CardTitle className="mt-3 text-base">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Types */}
      <section id="loan-types" className="py-16 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Choose Your Loan Type
            </h2>
            <p className="mt-3 text-muted-foreground">
              We offer a variety of loan products to meet your needs
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loanTypes.map((loan) => {
              const Icon = loan.icon;
              return (
                <Card
                  key={loan.name}
                  className="transition-all hover:border-primary hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {loan.rate}
                        </p>
                        <p className="text-xs text-muted-foreground">APR</p>
                      </div>
                    </div>
                    <CardTitle className="mt-4">{loan.name}</CardTitle>
                    <CardDescription>{loan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-medium">
                          {loan.minAmount} - {loan.maxAmount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Term</span>
                        <span className="font-medium">{loan.term}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                What You{"'"}ll Need
              </h2>
              <p className="mt-3 text-muted-foreground">
                Prepare these documents before starting your application for a
                smoother process.
              </p>
              <ul className="mt-8 space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="bg-card">
              <CardHeader>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                  <FileText className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="mt-4 text-xl">
                  Ready to Apply?
                </CardTitle>
                <CardDescription>
                  Have your documents ready? Start your application now and get
                  a decision within 2-3 business days.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <p className="font-medium">Your data is secure</p>
                    <p className="text-muted-foreground">
                      256-bit SSL encryption protects your information
                    </p>
                  </div>
                </div>
                <Link href="/apply/start" className="block">
                  <Button size="lg" className="w-full gap-2">
                    Start Application
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-center text-xs text-muted-foreground">
                  No commitment required. You can save and continue later.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Common Questions
            </h2>
          </div>

          <div className="mt-10 space-y-6">
            {[
              {
                q: "How long does the application process take?",
                a: "The online application takes about 10-15 minutes. Once submitted, you'll receive a decision within 2-3 business days.",
              },
              {
                q: "Do I need a guarantor for all loan types?",
                a: "Guarantors are required for most loan types, but mortgage and auto loans with sufficient collateral may not require one.",
              },
              {
                q: "What happens after I submit my application?",
                a: "Our team reviews your application, verifies documents, and you'll be contacted for any additional information needed before approval.",
              },
              {
                q: "Can I track my application status?",
                a: "Yes! After submission, you'll receive an application ID that you can use to check your status anytime.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    {faq.q}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground">
            Ready to Get Started?
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Take the first step towards achieving your financial goals today.
          </p>
          <Link href="/apply/start" className="mt-8 inline-block">
            <Button size="lg" variant="secondary" className="gap-2">
              Begin Your Application
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Banknote className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">{"Don't Stuck Solution"}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {"Don't Stuck Solution"}. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
