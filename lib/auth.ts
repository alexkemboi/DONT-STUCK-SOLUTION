import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import prisma from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from "better-auth/plugins";
import { sendResetPasswordEmail } from "@/app/actions/email";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        maxPasswordLength: 20,
        requireEmailVerification: false,
        sendResetPassword: async ({ user, url }) => {
            await sendResetPasswordEmail({
                userEmail: user.email,
                userName: user.email, // Assuming user.email can be used as userName
                resetLink: url,
            });
        },
    },
    user:{
        additionalFields:{
            role:{
                type:"string"
            }
        }
    },
    session: {
        cookieCache: {
            enabled: false,
        }
    },
    plugins:[
        customSession(async ({ user, session }) => {
            const roles = await prisma.user.findUnique({
                where: {
                    id: user.id
                },
                select: {
                    role: true
                }
            });
            return {
                user: {
                    ...user,
                    role: roles?.role || "Client",
                },
                session
            };
        }),
        nextCookies()
        
        
    
    ]
});