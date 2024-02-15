import type { NextRequest } from "next/server";
import { redirectOrBlockIfNotLoggedIn } from "./lib/middleware/checkIfLoggedIn";
import { middlewareForFrontendAuthPages } from "./lib/middleware/mwForFrontendAuthPages";

// TODO: block by default and whitelist login page/change password (if no password set yet)

export async function middleware(request: NextRequest) {
    let pathname = request.nextUrl.pathname;
    if (pathname.startsWith("/auth")) {
        return await middlewareForFrontendAuthPages(request);
    }
    if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
        return await redirectOrBlockIfNotLoggedIn(request);
    }
    if (
        pathname.startsWith("/experiments") ||
        pathname.startsWith("/agenda") ||
        pathname.startsWith("/experiment-list")
    ) {
        return await redirectOrBlockIfNotLoggedIn(request);
    }
}

export const config = {
    matcher: ["/:path*"],
};
