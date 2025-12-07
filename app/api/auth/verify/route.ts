import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/api/route-utils'
import { verifyToken } from '@/lib/auth/jwt'

export async function GET(req: NextRequest) {
    try {
        const token = getAuthToken(req)

        if (!token) {
            return NextResponse.json(
                { valid: false, error: 'No token provided' },
                { status: 401 }
            )
        }

        const payload = verifyToken(token)

        if (!payload) {
            return NextResponse.json(
                { valid: false, error: 'Invalid token' },
                { status: 401 }
            )
        }

        return NextResponse.json({
            valid: true,
            user: {
                id: payload.userId,
                email: payload.email,
            },
        })
    } catch (error) {
        return NextResponse.json(
            { valid: false, error: 'Token verification failed' },
            { status: 500 }
        )
    }
}
