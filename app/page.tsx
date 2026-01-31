import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function page() {


  const session = await auth.api.getSession(
    {
      headers:await headers()
    }
  );


  if (session?.user) {

    const role = session.user.role;

    if (role === "Admin") {
      redirect("/dss/admin");
    } else if (role === "Client") {
      redirect("/dss/client");
    } else if (role === "LoanOfficer") {
      redirect("/dss/loan-officer");
    } else if (role === "Investor") {
      redirect("/dss/investor");
    } else if (role === "RecoveryAgent") {
      redirect("/dss/recovery-agent");
    }

  }else{
      redirect("/login");
  }


  // const { data: session } = authClient.useSession()
  // const router = useRouter();

  // return (
  //   <div className="min-h-screen bg-background">
  //     {/* Header */}
  //     <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
  //       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
  //         <div className="flex items-center gap-2">
  //           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
  //             <Banknote className="h-5 w-5 text-primary-foreground" />
  //           </div>
  //           <span className="text-lg font-bold">{"Don't Stuck Solution"}</span>
  //         </div>
  //         <nav className="hidden items-center gap-6 md:flex">
  //           <Link
  //             href="/apply"
  //             className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
  //           >
  //             Apply for Loan
  //           </Link>
  //           <Link
  //             href="/investor"
  //             className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
  //           >
  //             Invest
  //           </Link>
  //           <Link
  //             href="/admin"
  //             className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
  //           >
  //             Admin
  //           </Link>

  //           {!session?.user ? (
  //             <Button
  //               className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
  //               onClick={async () => {
  //                 router.push("/login");
  //               }}
  //             >
  //               Sign In
  //             </Button>


  //           ) :(

  //               <Button
  //             className = "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
  //             onClick = { async()=> {
  //               await authClient.signOut();
  //             }}
  //           >
  //           Sign Out
  //         </Button>

  //           )}

           
  //         </nav>
  //         <div className="flex items-center gap-3">
  //           <Link href="/apply">
  //             <Button>Get Started</Button>
  //           </Link>
  //         </div>
  //       </div>
  //     </header>

  //     {/* Hero Section */}
  //     <section className="relative overflow-hidden">
  //       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
  //       <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
  //         <div className="mx-auto max-w-3xl text-center">
  //           <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
  //             Financial Solutions That{" "}
  //             <span className="text-primary">{"Don't Let You Get Stuck"}</span>
  //           </h1>
  //           <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
  //             Get fast, transparent loan approvals with competitive rates.
  //             Whether you need personal, business, or educational financing,
  //             {"we've"} got you covered.
  //           </p>
  //           <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
  //             <Link href="/apply">
  //               <Button size="lg" className="gap-2">
  //                 Apply for a Loan
  //                 <ArrowRight className="h-4 w-4" />
  //               </Button>
  //             </Link>
  //             <Link href="/investor">
  //               <Button size="lg" variant="outline" className="gap-2 bg-transparent">
  //                 <PiggyBank className="h-4 w-4" />
  //                 Become an Investor
  //               </Button>
  //             </Link>
  //           </div>
  //         </div>
  //       </div>
  //     </section>

  //     {/* Features Section */}
  //     <section className="border-t bg-muted/30 py-20">
  //       <div className="mx-auto max-w-7xl px-4">
  //         <div className="text-center">
  //           <h2 className="text-3xl font-bold tracking-tight">
  //             Why Choose Us?
  //           </h2>
  //           <p className="mt-3 text-muted-foreground">
  //             We make borrowing and investing simple, secure, and transparent.
  //           </p>
  //         </div>

  //         <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  //           <Card>
  //             <CardHeader>
  //               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
  //                 <Zap className="h-6 w-6 text-primary" />
  //               </div>
  //               <CardTitle className="mt-4">Fast Approvals</CardTitle>
  //             </CardHeader>
  //             <CardContent>
  //               <CardDescription>
  //                 Get your loan approved within 2-3 business days with our
  //                 streamlined application process.
  //               </CardDescription>
  //             </CardContent>
  //           </Card>

  //           <Card>
  //             <CardHeader>
  //               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
  //                 <Shield className="h-6 w-6 text-success" />
  //               </div>
  //               <CardTitle className="mt-4">Secure Platform</CardTitle>
  //             </CardHeader>
  //             <CardContent>
  //               <CardDescription>
  //                 Your data is protected with bank-grade encryption and strict
  //                 privacy controls.
  //               </CardDescription>
  //             </CardContent>
  //           </Card>

  //           <Card>
  //             <CardHeader>
  //               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
  //                 <Clock className="h-6 w-6 text-warning" />
  //               </div>
  //               <CardTitle className="mt-4">Flexible Terms</CardTitle>
  //             </CardHeader>
  //             <CardContent>
  //               <CardDescription>
  //                 Choose from various loan tenures from 6 months to 30 years
  //                 based on your needs.
  //               </CardDescription>
  //             </CardContent>
  //           </Card>

  //           <Card>
  //             <CardHeader>
  //               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
  //                 <Users className="h-6 w-6 text-primary" />
  //               </div>
  //               <CardTitle className="mt-4">Expert Support</CardTitle>
  //             </CardHeader>
  //             <CardContent>
  //               <CardDescription>
  //                 Our dedicated team is here to guide you through every step of
  //                 your financial journey.
  //               </CardDescription>
  //             </CardContent>
  //           </Card>
  //         </div>
  //       </div>
  //     </section>

  //     {/* User Portals Section */}
  //     <section className="py-20">
  //       <div className="mx-auto max-w-7xl px-4">
  //         <div className="text-center">
  //           <h2 className="text-3xl font-bold tracking-tight">
  //             Choose Your Portal
  //           </h2>
  //           <p className="mt-3 text-muted-foreground">
  //             Access the right tools for your financial needs.
  //           </p>
  //         </div>

  //         <div className="mt-12 grid gap-6 md:grid-cols-3">
  //           <Card className="relative overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg">
  //             <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y-[-50%] rounded-full bg-primary/10" />
  //             <CardHeader className="relative">
  //               <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
  //                 <Banknote className="h-7 w-7 text-primary-foreground" />
  //               </div>
  //               <CardTitle className="mt-4 text-xl">Loan Applicant</CardTitle>
  //               <CardDescription>
  //                 Apply for personal, business, education, auto, or mortgage
  //                 loans with competitive rates.
  //               </CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               <ul className="space-y-2 text-sm text-muted-foreground">
  //                 <li className="flex items-center gap-2">
  //                   <CheckCircle2 className="h-4 w-4 text-success" />
  //                   Simple 5-step application
  //                 </li>
  //                 <li className="flex items-center gap-2">
  //                   <CheckCircle2 className="h-4 w-4 text-success" />
  //                   Track application status
  //                 </li>
  //                 <li className="flex items-center gap-2">
  //                   <CheckCircle2 className="h-4 w-4 text-success" />
  //                   Manage repayments online
  //                 </li>
  //               </ul>
  //               <Link href="/apply" className="mt-6 block">
  //                 <Button className="w-full gap-2">
  //                   Apply Now
  //                   <ArrowRight className="h-4 w-4" />
  //                 </Button>
  //               </Link>
  //             </CardContent>
  //           </Card>

  //           <Card className="relative overflow-hidden border-2 transition-all hover:border-success hover:shadow-lg">
  //             <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y-[-50%] rounded-full bg-success/10" />
  //             <CardHeader className="relative">
  //               <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-success">
  //                 <PiggyBank className="h-7 w-7 text-success-foreground" />
  //               </div>
  //               <CardTitle className="mt-4 text-xl">Investor</CardTitle>
  //               <CardDescription>
  //                 Grow your wealth by funding verified loans with attractive
  //                 returns.
  //               </CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               <ul className="space-y-2 text-sm text-muted-foreground">
  //                 <li className="flex items-center gap-2">
  //                   <CheckCircle2 className="h-4 w-4 text-success" />
  //                   Up to 15% annual returns
  //                 </li>
  //                 <li className="flex items-center gap-2">
  //                   <CheckCircle2 className="h-4 w-4 text-success" />
  //                   Diversified portfolio
  //                 </li>
  //                 <li className="flex items-center gap-2">
  //                   <CheckCircle2 className="h-4 w-4 text-success" />
  //                   Real-time performance tracking
  //                 </li>
  //               </ul>
  //               <Link href="/investor" className="mt-6 block">
  //                 <Button
  //                   variant="outline"
  //                   className="w-full gap-2 border-success text-success hover:bg-success hover:text-success-foreground bg-transparent"
  //                 >
  //                   Start Investing
  //                   <ArrowRight className="h-4 w-4" />
  //                 </Button>
  //               </Link>
  //             </CardContent>
  //           </Card>

  //           <Card className="relative overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg">
  //             <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y-[-50%] rounded-full bg-primary/10" />
  //             <CardHeader className="relative">
  //               <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
  //                 <LayoutDashboard className="h-7 w-7 text-primary-foreground" />
  //               </div>
  //               <CardTitle className="mt-4 text-xl">Administrator</CardTitle>
  //               <CardDescription>
  //                 Manage loan applications, review requests, and monitor
  //                 platform activity.
  //               </CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               <ul className="space-y-2 text-sm text-muted-foreground">
  //                 <li className="flex items-center gap-2">
  //                   <CheckCircle2 className="h-4 w-4 text-success" />
  //                   Review applications
  //                 </li>
  //                 <li className="flex items-center gap-2">
  //                   <CheckCircle2 className="h-4 w-4 text-success" />
  //                   Approve/reject loans
  //                 </li>
  //                 <li className="flex items-center gap-2">
  //                   <CheckCircle2 className="h-4 w-4 text-success" />
  //                   Monitor repayments
  //                 </li>
  //               </ul>
  //               <Link href="/admin" className="mt-6 block">
  //                 <Button variant="outline" className="w-full gap-2 bg-transparent">
  //                   Admin Dashboard
  //                   <ArrowRight className="h-4 w-4" />
  //                 </Button>
  //               </Link>
  //             </CardContent>
  //           </Card>
  //         </div>
  //       </div>
  //     </section>

  //     {/* Loan Types Section */}
  //     <section className="border-t bg-muted/30 py-20">
  //       <div className="mx-auto max-w-7xl px-4">
  //         <div className="text-center">
  //           <h2 className="text-3xl font-bold tracking-tight">
  //             Loan Products
  //           </h2>
  //           <p className="mt-3 text-muted-foreground">
  //             Find the right financing solution for your needs.
  //           </p>
  //         </div>

  //         <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
  //           {[
  //             { name: "Personal Loan", rate: "12.5%", term: "Up to 60 months" },
  //             { name: "Business Loan", rate: "15.0%", term: "Up to 120 months" },
  //             { name: "Mortgage", rate: "7.5%", term: "Up to 30 years" },
  //             { name: "Auto Loan", rate: "9.0%", term: "Up to 84 months" },
  //             { name: "Education Loan", rate: "6.5%", term: "Up to 120 months" },
  //           ].map((loan) => (
  //             <Card key={loan.name} className="text-center">
  //               <CardHeader>
  //                 <CardTitle className="text-lg">{loan.name}</CardTitle>
  //               </CardHeader>
  //               <CardContent>
  //                 <p className="text-2xl font-bold text-primary">{loan.rate}</p>
  //                 <p className="text-sm text-muted-foreground">APR</p>
  //                 <p className="mt-2 text-xs text-muted-foreground">
  //                   {loan.term}
  //                 </p>
  //               </CardContent>
  //             </Card>
  //           ))}
  //         </div>
  //       </div>
  //     </section>

  //     {/* CTA Section */}
  //     <section className="py-20">
  //       <div className="mx-auto max-w-7xl px-4">
  //         <Card className="bg-primary text-primary-foreground">
  //           <CardContent className="flex flex-col items-center p-12 text-center">
  //             <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
  //             <p className="mt-3 max-w-xl text-primary-foreground/80">
  //               Join thousands of satisfied customers who have achieved their
  //               financial goals with {"Don't Stuck Solution"}.
  //             </p>
  //             <div className="mt-8 flex flex-col gap-4 sm:flex-row">
  //               <Link href="/apply">
  //                 <Button
  //                   size="lg"
  //                   variant="secondary"
  //                   className="gap-2"
  //                 >
  //                   Apply for a Loan
  //                   <ArrowRight className="h-4 w-4" />
  //                 </Button>
  //               </Link>
  //               <Link href="/investor">
  //                 <Button
  //                   size="lg"
  //                   variant="outline"
  //                   className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
  //                 >
  //                   Become an Investor
  //                 </Button>
  //               </Link>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </section>

  //     {/* Footer */}
  //     <footer className="border-t py-12">
  //       <div className="mx-auto max-w-7xl px-4">
  //         <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
  //           <div className="flex items-center gap-2">
  //             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
  //               <Banknote className="h-4 w-4 text-primary-foreground" />
  //             </div>
  //             <span className="font-semibold">{"Don't Stuck Solution"}</span>
  //           </div>
  //           <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
  //             <Link href="/apply" className="hover:text-foreground">
  //               Apply
  //             </Link>
  //             <Link href="/investor" className="hover:text-foreground">
  //               Invest
  //             </Link>
  //             <Link href="/admin" className="hover:text-foreground">
  //               Admin
  //             </Link>
  //             <span className="cursor-default">Terms</span>
  //             <span className="cursor-default">Privacy</span>
  //             <span className="cursor-default">Contact</span>
  //           </nav>
  //           <p className="text-sm text-muted-foreground">
  //             &copy; {new Date().getFullYear()} {"Don't Stuck Solution"}. All rights reserved.
  //           </p>
  //         </div>
  //       </div>
  //     </footer>
  //   </div>
  // );
}
