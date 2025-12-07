import Cookies from 'js-cookie'

const TOKEN_KEY = 'supremescan_token'
const USER_KEY = 'supremescan_user'

export interface User {
    id: string
    email: string
}

/**
 * Save authentication token
 */
export function saveToken(token: string): void {
    Cookies.set(TOKEN_KEY, token, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    })
}

/**
 * Get authentication token
 */
export function getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY)
}

/**
 * Remove authentication token
 */
export function removeToken(): void {
    Cookies.remove(TOKEN_KEY)
}

/**
 * Save user data to localStorage
 */
export function saveUser(user: User): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
}

/**
 * Get user data from localStorage
 */
export function getUser(): User | null {
    if (typeof window !== 'undefined') {
        const userData = localStorage.getItem(USER_KEY)
        if (userData) {
            try {
                return JSON.parse(userData)
            } catch {
                return null
            }
        }
    }
    return null
}

/**
 * Remove user data
 */
export function removeUser(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(USER_KEY)
    }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!getToken()
}

/**
 * Logout user (clear all auth data)
 */
export function logout(): void {
    removeToken()
    removeUser()
}
