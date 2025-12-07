import { getToken } from './client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export interface ApiError {
    error: string
    details?: any
}

export interface LoginResponse {
    token: string
    user: {
        id: string
        email: string
    }
}

export interface RegisterResponse {
    token: string
    user: {
        id: string
        email: string
    }
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken()

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
            error: 'An error occurred',
        }))
        throw new Error(error.error)
    }

    return response.json()
}

/**
 * Login user
 */
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    })
}

/**
 * Register new user
 */
export async function registerUser(
    email: string,
    password: string
): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    })
}

/**
 * Verify current token
 */
export async function verifyAuth(): Promise<{ valid: boolean; user?: any }> {
    try {
        return await apiRequest('/api/auth/verify')
    } catch {
        return { valid: false }
    }
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<any> {
    return apiRequest('/api/auth/me')
}
