import { NextRequest, NextResponse } from 'next/server'
import { getRequestBody } from '@/lib/api/route-utils'
import { registerSchema } from '@/lib/validation/schemas'
import { generateToken, hashPassword } from '@/lib/auth/jwt'
import { findUserByEmail, createUser } from '@/lib/database/users'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
    try {
        const body = await getRequestBody(req)

        // Validate input
        const validation = registerSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.errors },
                { status: 400 }
            )
        }

        const { email, password } = validation.data

        // Check if user already exists
        const existingUser = await findUserByEmail(email)
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            )
        }

        // Hash password
        const passwordHash = await hashPassword(password)

        // Create user in database
        const userId = `user_${randomUUID().slice(0, 8)}`
        const user = await createUser(userId, email, passwordHash)

        // Generate token
        const token = generateToken({
            userId: user.user_id,
            email: user.email,
        })

        return NextResponse.json(
            {
                token,
                user: {
                    id: user.user_id,
                    email: user.email,
                },
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Registration failed', details: error.message },
            { status: 500 }
        )
    }
}
