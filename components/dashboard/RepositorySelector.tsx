'use client'

import { useState, useEffect } from 'react'
import { Search, GitBranch, Clock, FileCode, Loader2, ExternalLink, AlertCircle } from 'lucide-react'

interface Repository {
    id: number
    name: string
    full_name: string
    html_url: string
    description: string | null
    default_branch: string
    language: string | null
    updated_at: string
    stargazers_count: number
    private: boolean
}

interface RepositorySelectorProps {
    onSelect: (repo: Repository) => void
}

export default function RepositorySelector({ onSelect }: RepositorySelectorProps) {
    const [repositories, setRepositories] = useState<Repository[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)

    useEffect(() => {
        fetchRepositories()
    }, [])

    const fetchRepositories = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await fetch('/api/github/repos')

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to fetch repositories')
            }

            const data = await response.json()
            setRepositories(data.repositories)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredRepos = repositories.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSelectRepo = (repo: Repository) => {
        setSelectedRepo(repo)
        onSelect(repo)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div className="flex-1">
                    <p className="text-sm font-medium text-red-400">Failed to load repositories</p>
                    <p className="text-xs text-gray-400 mt-1">{error}</p>
                </div>
                <button
                    onClick={fetchRepositories}
                    className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search repositories..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/60"
                />
            </div>

            {/* Repository List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredRepos.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">No repositories found</p>
                ) : (
                    filteredRepos.map((repo) => (
                        <div
                            key={repo.id}
                            onClick={() => handleSelectRepo(repo)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedRepo?.id === repo.id
                                    ? 'bg-purple-500/20 border-purple-500/50'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-white truncate">{repo.name}</h3>
                                        {repo.private && (
                                            <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/30">
                                                Private
                                            </span>
                                        )}
                                    </div>
                                    {repo.description && (
                                        <p className="text-sm text-gray-400 line-clamp-2 mb-2">{repo.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        {repo.language && (
                                            <span className="flex items-center gap-1">
                                                <FileCode className="w-3 h-3" />
                                                {repo.language}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <GitBranch className="w-3 h-3" />
                                            {repo.default_branch}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(repo.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
