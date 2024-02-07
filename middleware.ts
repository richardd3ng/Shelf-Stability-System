import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth';
import { USER_ID } from "./lib/api/auth/authHelpers";
import { getToken } from 'next-auth/jwt';
import { url } from 'inspector';
import { redirectOrBlockIfNotLoggedIn } from './lib/middleware/checkIfLoggedIn';
import { middlewareForFrontendAuthPages } from './lib/middleware/mwForFrontendAuthPages';
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/auth")){
        return await middlewareForFrontendAuthPages(request);
    }
    if (request.nextUrl.pathname.startsWith("/api") && !request.nextUrl.pathname.startsWith("/api/auth")){
        return await redirectOrBlockIfNotLoggedIn(request);
    }
    
}

 
export const config = {
    matcher: ['/:path*'],
  }