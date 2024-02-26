import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';
import { getApiError } from '../api/error';

export async function redirectOrBlockIfNotLoggedIn(request: NextRequest) {
    try {
        const token = await getToken({ req: request });

        if (!token) {
            if (request.nextUrl.pathname.startsWith("/api")) {
                return NextResponse.json(getApiError(400, "You need to log in", "Not Logged in"))
            }
            return NextResponse.redirect(new URL('/auth/login'));
        }


    } catch {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}