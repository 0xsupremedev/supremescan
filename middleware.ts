import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth/jwt'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/scan', '/settings']

// Routes that should redirect to dashboard if already authenticated  
const authRoutes = ['/login', '/signup']

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Get auth token from cookies
    const token = request.cookies.get('supremescan_token')?.value

    // Check if the current route is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // Verify token if it exists
    let isAuthenticated = false
    if (token) {
        try {
            await verifyToken(token)
            isAuthenticated = true
        } catch (error) {
            // Token is invalid, clear it
            const response = NextResponse.next()
            response.cookies.delete('supremescan_token')
            isAuthenticated = false
        }
    }

    // Redirect to login if accessing protected route without auth
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Redirect to dashboard if accessing auth routes while authenticated
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|logos|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
    ],
}
