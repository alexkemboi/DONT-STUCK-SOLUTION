
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "./lib/prisma";



const publicroutes = ["/"];


const authRoutes = ["/login", "/register"]


const apiAuthPrefix = "/api/auth";

const DEFAULT_LOGIN_REDIRECT = "/login";

const adminPrefix = "/dss/admin";
const clientPrefix = "/dss/client";




export default async function proxy(req:NextRequest) {

    const session =await auth.api.getSession(
        {
            headers:await headers()
        }
    )
    const { nextUrl } = req;


    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isAuthRoute = authRoutes.some((route) => {
        return nextUrl.pathname.startsWith(route);
    });

    // Check if route is public - handle home page and other routes
    const isPublicRoute =
        nextUrl.pathname === "/" ||
        publicroutes.some((route) => {
        if (route === "/") return nextUrl.pathname === "/";
        return nextUrl.pathname.startsWith(route);
        });

    if (isApiAuthRoute) {
        if (!session){
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
        }
        return NextResponse.next();
    }

    if (isPublicRoute) {
        return NextResponse.next();
    }

    if(isAuthRoute){
        if (session){
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    // For all other routes, require authentication
    if (session) {
        if(nextUrl.pathname.startsWith(adminPrefix)){
            // check if user is admin
            const userRole = await prisma.user.findUnique({
                where:{
                    id:session.user.id
                },
                select:{
                    role:true
                }
            });
            if( userRole && userRole.role !== "Admin"){
                return NextResponse.redirect(new URL("/", req.url));
            }
        }
        
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
}




export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)",  "/" , "/admin/:path*"],
};