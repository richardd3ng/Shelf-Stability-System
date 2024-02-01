import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth';
import { USER_ID } from './pages/api/auth/USERID';
import { getToken } from 'next-auth/jwt';
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    try{
        const token = await getToken({req : request});
        
        if (!token){
            return NextResponse.redirect(new URL('/login'));
        }
        

        if (token && token.name !== USER_ID){
            if (request.url.startsWith("/api")){
                console.log("non logged in guy is trying to reach api");
                return NextResponse.json({message : "You are not logged in bruh"})
            }
            return NextResponse.redirect(new URL('/login'));
        }
        
    } catch {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    
}

 
export const config = {
    matcher: ['/api/experiments/:path*', '/api/assays/:path*', '/experiments/:path*', '/experiment-list'],
  }