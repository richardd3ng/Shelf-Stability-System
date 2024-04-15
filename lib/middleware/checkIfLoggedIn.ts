import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';
import { getApiError } from '../api/error';

export async function redirectOrBlockIfNotLoggedIn(request: NextRequest) {
    try {
        const token = await getToken({ req: request });

        if (!token) {
            if (request.nextUrl.pathname.startsWith("/api")) {
                return NextResponse.json(getApiError(400, "You need to log in"))
            } else {
                const redirectUrl = new URL('/auth/login', request.nextUrl);
                redirectUrl.searchParams.append('redirect', request.nextUrl.pathname);
                return NextResponse.redirect(new URL(redirectUrl)); //here I want to include the new URL to redirect to after logging in
            }
            
        }


    } catch {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}