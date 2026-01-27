"use server";

import { auth } from "@/lib/auth";
import { UserRole } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
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

    const user = await auth.api.signUpEmail({
        body:{
            email:userdata.email,
            password:userdata.password,
            name:userdata.fullname,
            role:UserRole.Client,
        }  
    });


    if(user.user.id){
        // fetch user role
        const role= await prisma.user.findUnique({
            where:{
                id:user.user.id as string
            },
            select:{
                role:true,
            }
        })

        //
        return {
            user:{
                id: user.user.id,
                email: user.user.email,
                role: role?.role || UserRole.Client,
                name: user.user.name,
            },
            success:"successfully registered",
            error:null,
            status:201
        }
    }

    return {
        error:"Registration failed",
        success:null,
        user:null,
        status:400
    }
}



export async function loginAction(data:LoginInfo){
    const email = data.email;
    const password = data.password;

    const user = await auth.api.signInEmail({
        body:{
            email,
            password,
        }  
    });

    if(user.user){
        return redirect("/dss/client");
    }else{
        // throw new Error("Invalid credentials");
        return {
            error:"Invalid credentials",
            user:null,
            status:401
        }
    }

   
}



export async function logoutAction(){
    await auth.api.signOut({
        headers:await headers()
    });
    redirect("/auth/login");
}