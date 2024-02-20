import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth';
import { USER_ID } from '../api/auth/authHelpers';
import { getToken } from 'next-auth/jwt';
// This function can be marked `async` if using `await` inside
export async function redirectOrBlockIfNotLoggedIn(request: NextRequest) {
    console.log("blocking if not logged in");
    try{
        const token = await getToken({req : request});
        console.log("their token is ")
        console.log(token);
        
        
        if (!token){
            if (request.url.startsWith("/api")){
                console.log("non logged in guy is trying to reach api");
                return NextResponse.json({message : "You are not logged in bruh"})
            }
            return NextResponse.redirect(new URL('/auth/login'));
        }
        
        
    } catch {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    
}