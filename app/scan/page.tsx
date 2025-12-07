'use client'

import { useState } from 'react'
import GitHubConnect from '@/components/dashboard/GitHubConnect'
import RepositorySelector from '@/components/dashboard/RepositorySelector'
import ScanProgress from '@/components/dashboard/ScanProgress'
import ScanReport from '@/components/dashboard/ScanReport'
import { Github, Scan, FileCode, BarChart3 } from 'lucide-react'

export default function GitHubScanPage() {
    const [step, setStep] = useState<'connect' | 'select' | 'scanning' | 'results'>('connect')
    const [selectedRepo, setSelectedRepo] = useState<any>(null)
    const [scanId, setScanId] = useState<string | null>(null)
    const [isLinking, setIsLinking] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleRepoSelect = async (repo: any) => {
        setSelectedRepo(repo)
    }

    const handleStartScan = async () => {
        if (!selectedRepo) return

        try {
            setIsLinking(true)
            setError(null)

            // Link repository
            const linkResponse = await fetch('/api/projects/link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    repoUrl: selectedRepo.html_url,
                    provider: 'github',
                    chain: 'ethereum', // Default, can be made selectable
                }),
            })

            if (!linkResponse.ok) {
                const data = await linkResponse.json()
                throw new Error(data.error || 'Failed to link repository')
            }

            const linkData = await linkResponse.json()

            // Start scan
            const scanResponse = await fetch('/api/scans/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: linkData.project.project_id,
                    repoUrl: selectedRepo.html_url,
                }),
            })

            if (!scanResponse.ok) {
                const data = await scanResponse.json()
                throw new Error(data.error || 'Failed to start scan')
            }

            const scanData = await scanResponse.json()
            setScanId(scanData.scanId)
            setStep('scanning')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLinking(false)
        }
    }

    const handleScanComplete = () => {
        setStep('results')
    }

    const handleReset = () => {
        setStep('connect')
        setSelectedRepo(null)
        setScanId(null)
        setError(null)
    }

    const getStepIcon = (currentStep: string) => {
        switch (currentStep) {
            case 'connect':
                return <Github className="w-6 h-6" />
            case 'select':
                return <FileCode className="w-6 h-6" />
            case 'scanning':
                return <Scan className="w-6 h-6" />
            case 'results':
                return <BarChart3 className="w-6 h-6" />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-deep-navy via-purple-900 to-deep-navy p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">GitHub Repository Scanner</h1>
                    <p className="text-gray-400">Scan your smart contract repositories for vulnerabilities</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-4 mb-8">
                    {['connect', 'select', 'scanning', 'results'].map((s, index) => (
                        <div key={s} className="flex items-center gap-4">
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${step === s
                                        ? 'bg-purple-500/20 border-purple-500/50 text-white'
                                        : index < ['connect', 'select', 'scanning', 'results'].indexOf(step)
                                            ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                            : 'bg-white/5 border-white/10 text-gray-400'
                                    }`}
                            >
                                {getStepIcon(s)}
                                <span className="text-sm font-medium capitalize">{s}</span>
                            </div>
                            {index < 3 && (
                                <div className={`w-8 h-0.5 ${index < ['connect', 'select', 'scanning', 'results'].indexOf(step)
                                        ? 'bg-green-500'
                                        : 'bg-white/10'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                {/* Main Content */}
                <div className="glass rounded-2xl p-8">
                    {step === 'connect' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Connect Your GitHub Account</h2>
                                <p className="text-gray-400 mb-6">
                                    Authorize SupremeScan to access your repositories and scan for vulnerabilities
                                </p>
                            </div>
                            <GitHubConnect />
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setStep('select')}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/50"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'select' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Select Repository</h2>
                                <p className="text-gray-400 mb-6">
                                    Choose a repository to scan for smart contract vulnerabilities
                                </p>
                            </div>
                            <RepositorySelector onSelect={handleRepoSelect} />
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep('connect')}
                                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg font-medium text-white hover:bg-white/10 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleStartScan}
                                    disabled={!selectedRepo || isLinking}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLinking ? 'Starting Scan...' : 'Start Scan'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'scanning' && scanId && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Scanning Repository</h2>
                                <p className="text-gray-400 mb-6">
                                    Analyzing {selectedRepo?.name} for security vulnerabilities
                                </p>
                            </div>
                            <ScanProgress scanId={scanId} onComplete={handleScanComplete} />
                        </div>
                    )}

                    {step === 'results' && scanId && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Scan Results</h2>
                                    <p className="text-gray-400">
                                        Vulnerability report for {selectedRepo?.name}
                                    </p>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-medium text-white hover:bg-white/10 transition-colors"
                                >
                                    Scan Another Repo
                                </button>
                            </div>
                            <ScanReport scanId={scanId} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
