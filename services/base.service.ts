// import { prisma } from "../lib/prisma";
// import type { PrismaClient } from "../lib/generated/prisma";

// export abstract class BaseService {
//   protected db: PrismaClient;

//   constructor() {
//     this.db = prisma;
//   }

//   protected generateCode(prefix: string): string {
//     const timestamp = Date.now().toString(36).toUpperCase();
//     const random = Math.random().toString(36).substring(2, 6).toUpperCase();
//     return `${prefix}-${timestamp}-${random}`;
//   }

//   protected calculateProcessingFee(amount: number, rate = 0.03): number {
//     return Math.round(amount * rate * 100) / 100;
//   }

//   protected calculateInterest(
//     principal: number,
//     annualRate: number,
//     months: number
//   ): number {
//     const monthlyRate = annualRate / 100 / 12;
//     if (monthlyRate === 0) return 0;
//     const totalInterest = principal * monthlyRate * months;
//     return Math.round(totalInterest * 100) / 100;
//   }

//   protected calculateMonthlyInstallment(
//     principal: number,
//     annualRate: number,
//     months: number
//   ): number {
//     const monthlyRate = annualRate / 100 / 12;
//     if (monthlyRate === 0) return principal / months;
//     const installment =
//       (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
//       (Math.pow(1 + monthlyRate, months) - 1);
//     return Math.round(installment * 100) / 100;
//   }
// }

export type ServiceResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
