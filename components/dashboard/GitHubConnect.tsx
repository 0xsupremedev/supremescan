'use client'

import { useState, useEffect } from 'react'
import { Github, Check, Loader2 } from 'lucide-react'

interface GitHubUser {
    id: number
    login: string
    name: string
    avatar_url: string
}

export default function GitHubConnect() {
    const [isConnected, setIsConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [githubUser, setGithubUser] = useState<GitHubUser | null>(null)

    useEffect(() => {
        // Check if GitHub is already connected
        const checkConnection = () => {
            const userCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('github_user='))

            if (userCookie) {
                try {
                    const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
                    setGithubUser(userData)
                    setIsConnected(true)
                } catch (error) {
                    console.error('Failed to parse GitHub user data:', error)
                }
            }
        }

        checkConnection()

        // Check for OAuth callback success
        const params = new URLSearchParams(window.location.search)
        if (params.get('github_connected') === 'true') {
            checkConnection()
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname)
        }
    }, [])

    const handleConnect = async () => {
        setIsLoading(true)
        // Redirect to GitHub OAuth
        window.location.href = '/api/auth/github'
    }

    const handleDisconnect = () => {
        // Clear cookies
        document.cookie = 'github_token=; Max-Age=0; path=/'
        document.cookie = 'github_user=; Max-Age=0; path=/'
        setIsConnected(false)
        setGithubUser(null)
    }

    if (isConnected && githubUser) {
        return (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                        <img
                            src={githubUser.avatar_url}
                            alt={githubUser.login}
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                            <Check className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                            {githubUser.name || githubUser.login}
                        </p>
                        <p className="text-xs text-gray-400">@{githubUser.login}</p>
                    </div>
                </div>
                <button
                    onClick={handleDisconnect}
                    className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                >
                    Disconnect
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={handleConnect}
            disabled={isLoading}
            className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Github className="w-5 h-5" />
            )}
            <span>{isLoading ? 'Connecting...' : 'Connect GitHub'}</span>
        </button>
    )
}
