import { NextRequest, NextResponse } from 'next/server'
import { createApiHandler, getRequestBody } from '@/lib/api/route-utils'
import { loginSchema } from '@/lib/validation/schemas'
import { generateToken, comparePassword } from '@/lib/auth/jwt'
import { findUserByEmail } from '@/lib/database/users'

export async function POST(req: NextRequest) {
    try {
        const body = await getRequestBody(req)

        // Validate input
        const validation = loginSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.errors },
                { status: 400 }
            )
        }

        const { email, password } = validation.data

        // Find user in database
        const user = await findUserByEmail(email)
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Verify password
        const isValid = await comparePassword(password, user.password_hash)
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Generate token
        const token = generateToken({
            userId: user.user_id,
            email: user.email,
        })

        return NextResponse.json({
            token,
            user: {
                id: user.user_id,
                email: user.email,
            },
        })
    } catch (error: any) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Login failed', details: error.message },
            { status: 500 }
        )
    }
}
