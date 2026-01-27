import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import prisma from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from "better-auth/plugins";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
    },
    user:{
        additionalFields:{
            role:{
                type:"string"
            }
        }
    },
    plugins:[
        nextCookies(),
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
    
    ]
});