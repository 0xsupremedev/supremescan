import { NextRequest, NextResponse } from 'next/server'

export { NextRequest, NextResponse }

/**
 * Create API route handlers with consistent error handling
 */
export function createApiHandler(handlers: {
    GET?: (req: NextRequest) => Promise<NextResponse>
    POST?: (req: NextRequest) => Promise<NextResponse>
    PUT?: (req: NextRequest) => Promise<NextResponse>
    DELETE?: (req: NextRequest) => Promise<NextResponse>
}) {
    return async function handler(req: NextRequest) {
        try {
            const method = req.method as keyof typeof handlers
            const methodHandler = handlers[method]

            if (!methodHandler) {
                return NextResponse.json(
                    { error: `Method ${method} not allowed` },
                    { status: 405 }
                )
            }

            return await methodHandler(req)
        } catch (error: any) {
            console.error('API Error:', error)
            return NextResponse.json(
                { error: error.message || 'Internal server error' },
                { status: 500 }
            )
        }
    }
}

/**
 * Extract JSON body from request
 */
export async function getRequestBody<T>(req: NextRequest): Promise<T> {
    try {
        return await req.json()
    } catch {
        throw new Error('Invalid JSON body')
    }
}

/**
 * Get authorization token from request
 */
export function getAuthToken(req: NextRequest): string | null {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }
    return authHeader.substring(7)
}
