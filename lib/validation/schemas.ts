import { z } from 'zod'

// User registration schema
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

// User login schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

// Project creation schema
export const createProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(100),
    repoUrl: z.string().url('Invalid repository URL'),
    provider: z.enum(['github', 'gitlab', 'bitbucket']).default('github'),
    chain: z.enum(['ethereum', 'solana', 'polygon', 'bsc', 'avalanche']).default('ethereum'),
    defaultBranch: z.string().default('main'),
})

// Scan creation schema
export const createScanSchema = z.object({
    branch: z.string().optional(),
})

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type CreateScanInput = z.infer<typeof createScanSchema>
