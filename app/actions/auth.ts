"use server";

import { auth } from "@/lib/auth";
import { UserRole } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { APIError } from "better-auth/api";
import { error } from "console";
import { stat } from "fs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


interface UserInfo {
    email:string
    password:string;
    fullname:string;
}

interface LoginInfo {
    email:string
    password:string;
}



interface UserInfoResponse{
    user: {
        id: string;
        email: string;
        role: UserRole;
        name: string;
    } | null;
    success: string | null;
    error: string | null;
    status: number | null;
}

export async function signUpAction(userdata:UserInfo):Promise<UserInfoResponse>{
    // to avoid  unauthorized executions we need to expilicity pass the role

    // TODO: Implement data validation 


    try{

        const user = await auth.api.signUpEmail({
            body: {
                email: userdata.email,
                password: userdata.password,
                name: userdata.fullname,
                role: UserRole.Client,
            }
        });


        if (user.user.id) {
            // fetch user role
            const role = await prisma.user.findUnique({
                where: {
                    id: user.user.id as string
                },
                select: {
                    role: true,
                }
            })

            //
            return {
                user: {
                    id: user.user.id,
                    email: user.user.email,
                    role: role?.role || UserRole.Client,
                    name: user.user.name,
                },
                success: "successfully registered",
                error: null,
                status: 201
            }
        }
        return {
            user: null,
            success: null,
            error: "Registration failed",
            status: 400
        }

    }catch(error){
        if (error instanceof APIError) {
            // throw new Error("Invalid credentials");
            return {
                error: "Registration failed",
                success: null,
                user: null,
                status: 400
            }
        }
        return {
            error: "Registration failed",
            success: null,
            user: null,
            status: 500
        }
    }

   

    
}



export async function loginAction(data:LoginInfo){
    const email = data.email;
    const password = data.password;


    try {
        const user = await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        });

        console.log("login user", user);

        if (user.user) {
            if (user.user.role === UserRole.Client) {
                return redirect("/dss/client");
            } else if (user.user.role === UserRole.Admin || user.user.role === UserRole.LoanOfficer) {
                return redirect("/dss/admin");
            }
        } else {
            return redirect("/");
        }
    } catch (error) {
        if (error instanceof APIError) {
            console.log(error.message, error.status)
            // throw new Error("Invalid credentials");
            return {
                error: "Invalid credentials",
                user: null,
                status: 401
            }
        }
    }

    
}



export async function logoutAction(){
    await auth.api.signOut({
        headers:await headers()
    });
    redirect("/login");
}



export async function getCurrentUser(){
    const session = await auth.api.getSession({
        headers:await headers()
    });

    if(session && session.user){
        return session.user;
    }
    return null;
}