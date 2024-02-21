import type { NextRequest } from 'next/server'
import { redirectOrBlockIfNotLoggedIn } from './checkIfLoggedIn';
// This function can be marked `async` if using `await` inside
export async function middlewareForFrontendAuthPages(request: NextRequest) {   
    //unfortunately we cannot run prisma in the middleware, so we check in getServerSideProps if a password has been set yet 
    if (request.nextUrl.pathname.startsWith("/auth/updatePassword")){
        return await redirectOrBlockIfNotLoggedIn(request);
    }
    
    
}