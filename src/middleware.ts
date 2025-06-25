import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"


export const middleware = async(request: NextRequest) => {
    const token = await getToken({req: request})
    const url = request.nextUrl;

    if(token && (
        url.pathname.startsWith('/sign-in') || 
        url.pathname.startsWith('/sign-up') || 
        url.pathname.startsWith('/verify')
    )) {
        // if user is authenticated and trying to access sign-in or sign-up page, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))

    }

    // if user is not logged in but accessing dashboard
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}

// see matching paths for provided paths
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}