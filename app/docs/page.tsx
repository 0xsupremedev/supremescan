'use client'

import { useMemo, useState, KeyboardEvent } from 'react'
import Link from 'next/link'
import BrandMark from '@/components/BrandMark'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const sections = [
  'Introduction',
  'Getting Started',
  'Core Concepts',
  'Vulnerability Scanning',
  'AI Insights',
  'Attack Surface Mapping',
  'API Reference',
  'Integrations (Ethereum, EVM, Solana)',
  'FAQ',
  'Support',
] as const

type SectionId = (typeof sections)[number]

const featureStrip = [
  { label: 'Code/Contract', icon: '</>' },
  { label: 'AI Engine Analysis', icon: 'AI' },
  { label: 'Vulnerability Detection', icon: '!' },
  { label: 'Attack Surface Mapping', icon: '⛓' },
  { label: 'Actionable Report', icon: '▤' },
]

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('Introduction')
  const [searchQuery, setSearchQuery] = useState('')

  const breadcrumbLabel = useMemo(() => activeSection, [activeSection])

  const searchMatches = useMemo(
    () =>
      sections.filter((label) =>
        searchQuery.trim()
          ? label.toLowerCase().includes(searchQuery.trim().toLowerCase())
          : false
      ),
    [searchQuery]
  )

  const handleSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    const query = searchQuery.trim().toLowerCase()
    if (!query) return

    const match = sections.find((label) => label.toLowerCase().includes(query))
    if (match) {
      setActiveSection(match)
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'Getting Started':
        return (
          <>
            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-50">
              Getting Started
            </h1>
            <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-200">
              This guide walks you through installing SupremeScan, configuring your environment, and
              running your first smart‑contract scan.
            </p>
            <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm text-slate-200">
              <li>
                <span className="font-semibold">Prerequisites.</span> Make sure you have Node.js 14+ and
                npm installed.
              </li>
              <li>
                <span className="font-semibold">Install the CLI.</span> Install SupremeScan globally using
                npm:
              </li>
            </ol>
            <div className="mb-4 overflow-hidden rounded-lg border border-emerald-500/40 bg-black/80 font-mono text-xs text-emerald-100">
              <div className="border-b border-emerald-500/20 bg-emerald-900/40 px-3 py-2 text-[10px] text-emerald-100/80">
                Install CLI
              </div>
              <div className="px-3 py-3">
                <span className="text-emerald-400">$</span>{' '}
                <span className="text-emerald-100">npm install -g supremescan-cli</span>
              </div>
            </div>
            <p className="mb-2 text-sm text-slate-200">
              Then initialize a new project and run a scan:
            </p>
            <div className="mb-4 overflow-hidden rounded-lg border border-emerald-500/40 bg-black/80 font-mono text-xs text-emerald-100">
              <div className="border-b border-emerald-500/20 bg-emerald-900/40 px-3 py-2 text-[10px] text-emerald-100/80">
                First scan
              </div>
              <div className="px-3 py-3 space-y-1">
                <div>
                  <span className="text-emerald-400">$</span>{' '}
                  <span className="text-emerald-100">supremescan init</span>
                </div>
                <div>
                  <span className="text-emerald-400">$</span>{' '}
                  <span className="text-emerald-100">
                    supremescan scan --contract {'<YOUR_CONTRACT_ADDRESS>'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-sky-400/40 bg-sky-900/40 px-4 py-3 text-xs text-sky-50">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide">Tip</div>
              <p>
                For a full list of CLI options, run{' '}
                <code className="rounded bg-sky-950/60 px-1 py-0.5">supremescan --help</code>.
              </p>
            </div>
          </>
        )
      case 'Core Concepts':
        return (
          <>
            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-50">
              Core Concepts
            </h1>
            <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-200">
              This section explains how SupremeScan thinks about smart‑contract security: the vulnerability
              classes we focus on, how the AI analysis pipeline works, and how attack‑surface mapping fits
              into your overall security posture.
            </p>

            <h2 className="mb-2 text-sm font-semibold text-slate-100">
              1. Smart‑contract vulnerabilities
            </h2>
            <p className="mb-3 text-sm text-slate-200">
              SupremeScan detects a wide range of issues including classic reentrancy, integer
              overflow/underflow, unchecked external calls, broken access control, denial‑of‑service
              conditions and gas griefing, front‑running risks, and logic flaws that can lead to fund loss
              or stuck assets.
            </p>

            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
              Example: reentrancy
            </h3>
            <div className="mb-4 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/80 font-mono text-[11px] text-slate-100">
              <div className="border-b border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-[10px] text-slate-300">
                Vulnerable withdraw()
              </div>
              <pre className="px-3 py-3 whitespace-pre">
{`function withdraw(uint256 amount) external {
  require(balances[msg.sender] >= amount, "Insufficient balance");
  (bool ok, ) = msg.sender.call{value: amount}("");
  require(ok, "Transfer failed");
  balances[msg.sender] -= amount; // state updated after external call
}`}
              </pre>
            </div>
            <p className="mb-4 text-sm text-slate-200">
              SupremeScan highlights patterns like these and explains why they are exploitable, how they
              have been abused historically, and which mitigations (for example, checks‑effects‑interactions
              or using OpenZeppelin&apos;s <code>ReentrancyGuard</code>) are recommended.
            </p>

            <h2 className="mb-2 text-sm font-semibold text-slate-100">
              2. AI‑powered analysis pipeline
            </h2>
            <p className="mb-3 text-sm text-slate-200">
              Under the hood, SupremeScan combines multiple signal sources: traditional static analyzers,
              custom detectors, and deep‑learning models trained on historical exploits and audit reports.
              Each stage enriches the findings with additional context and confidence scores.
            </p>
            <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-200">
              <li>Source code and bytecode are parsed into an intermediate representation.</li>
              <li>
                Static analyzers flag raw patterns (for example, external calls, ownership checks, math
                operations).
              </li>
              <li>
                AI models rank and cluster findings, reducing noise and surfacing the most critical issues.
              </li>
              <li>
                Threat‑modeling logic groups issues into attack paths and produces human‑readable summaries.
              </li>
            </ul>

            <h2 className="mb-2 text-sm font-semibold text-slate-100">
              3. Attack‑surface mapping
            </h2>
            <p className="mb-3 text-sm text-slate-200">
              Beyond individual findings, SupremeScan builds a directed graph of contracts, external
              dependencies, and privileged functions. This lets you reason about how value and control flow
              through your protocol, and where a single failure could cascade into larger losses.
            </p>
          </>
        )
      case 'Vulnerability Scanning':
        return (
          <>
            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-50">
              Vulnerability Scanning
            </h1>
            <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-200">
              SupremeScan combines static analysis and AI insights to surface critical vulnerabilities in
              your contracts.
            </p>

            <h2 className="mb-2 text-sm font-semibold text-slate-100">
              1. Supported vulnerability types
            </h2>
            <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-200">
              <li>Reentrancy</li>
              <li>Integer overflow / underflow</li>
              <li>Unchecked external calls and return values</li>
              <li>Access‑control and authorization flaws</li>
              <li>Denial‑of‑Service (DoS) and gas‑related griefing</li>
              <li>Front‑running and price‑manipulation vectors</li>
              <li>Logic errors and broken invariants</li>
            </ul>

            <h2 className="mb-2 text-sm font-semibold text-slate-100">2. Scan configuration</h2>
            <p className="mb-3 text-sm text-slate-200">
              You can tailor scans per project: select target networks, choose which analyzers to run, and
              set a minimum severity threshold. A typical configuration might look like:
            </p>
            <div className="mb-4 overflow-hidden rounded-lg border border-emerald-500/40 bg-black/80 font-mono text-[11px] text-emerald-100">
              <div className="border-b border-emerald-500/20 bg-emerald-900/40 px-3 py-2 text-[10px] text-emerald-100/80">
                supremescan.config.js
              </div>
              <pre className="px-3 py-3 whitespace-pre">
{`module.exports = {
  networks: ['ethereum', 'solana'],
  analyzers: ['static', 'ai'],
  severityThreshold: 'medium',
  exclude: ['contracts/test/'],
};`}
              </pre>
            </div>
            <p className="mb-3 text-sm text-slate-200">
              Scan results are available in the dashboard and via API, including severity breakdowns,
              recent scans, and a detailed table of findings with status and remediation guidance.
            </p>
          </>
        )
      case 'AI Insights':
        return (
          <>
            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-50">AI Insights</h1>
            <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-200">
              The AI Insights engine turns raw findings into narratives, attack paths, and prioritized
              recommendations for your security team.
            </p>
          </>
        )
      case 'Attack Surface Mapping':
        return (
          <>
            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-50">
              Attack Surface Mapping
            </h1>
            <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-200">
              Visualize external dependencies, function calls, and potential entry points into your
              protocol.
            </p>
          </>
        )
      case 'API Reference':
        return (
          <>
            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-50">
              API Reference
            </h1>
            <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-200">
              Use the REST API to manage projects, trigger scans, and pull findings into your CI/CD
              pipelines.
            </p>

            <h2 className="mb-2 text-sm font-semibold text-slate-100">1. Authentication</h2>
            <p className="mb-2 text-sm text-slate-200">
              Obtain an API key from your dashboard, then exchange it for a short‑lived bearer token:
            </p>
            <div className="mb-4 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/90 font-mono text-[11px] text-slate-100">
              <pre className="px-3 py-3 whitespace-pre">
{`curl -X POST https://api.supremescan.io/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"apiKey": "YOUR_API_KEY"}'

{
  "token": "eyJhbGciOi...",
  "expiresIn": 3600
}`}
              </pre>
            </div>

            <h2 className="mb-2 text-sm font-semibold text-slate-100">2. Projects API</h2>
            <p className="mb-2 text-sm text-slate-200">
              List and manage projects that group contracts, networks, and scan settings:
            </p>
            <div className="mb-4 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/90 font-mono text-[11px] text-slate-100">
              <pre className="px-3 py-3 whitespace-pre">
{`curl -X GET https://api.supremescan.io/v1/projects \\
  -H "Authorization: Bearer YOUR_TOKEN"`}
              </pre>
            </div>

            <h2 className="mb-2 text-sm font-semibold text-slate-100">3. Scans API</h2>
            <p className="mb-2 text-sm text-slate-200">
              Trigger a new scan for a given project and contract address:
            </p>
            <div className="mb-4 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/90 font-mono text-[11px] text-slate-100">
              <pre className="px-3 py-3 whitespace-pre">
{`curl -X POST https://api.supremescan.io/v1/scans \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"projectId": "proj_123", "contractAddress": "0x..."}'`}
              </pre>
            </div>
          </>
        )
      case 'Integrations (Ethereum, EVM, Solana)':
        return (
          <>
            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-50">
              Integrations
            </h1>
            <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-200">
              SupremeScan integrates with Ethereum, major EVM L2s, and Solana, as well as popular
              frameworks like Hardhat and Anchor.
            </p>

            <h2 className="mb-2 text-sm font-semibold text-slate-100">
              1. Ethereum &amp; EVM chains
            </h2>
            <p className="mb-2 text-sm text-slate-200">
              Use the Hardhat plugin to run scans as part of your test suite or CI pipeline:
            </p>
            <div className="mb-4 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/90 font-mono text-[11px] text-slate-100">
              <pre className="px-3 py-3 whitespace-pre">
{`// hardhat.config.js
require('@supremescan/hardhat-plugin');

module.exports = {
  solidity: '0.8.19',
  supremescan: {
    apiKey: process.env.SUPREMESCAN_API_KEY,
    network: 'ethereum', // or 'polygon', 'arbitrum', 'optimism', etc.
  },
};`}
              </pre>
            </div>

            <h2 className="mb-2 text-sm font-semibold text-slate-100">2. Solana</h2>
            <p className="mb-2 text-sm text-slate-200">
              For Anchor‑based Solana programs, SupremeScan provides a small SDK to upload program traces
              and get AI‑assisted findings back:
            </p>
            <div className="mb-4 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/90 font-mono text-[11px] text-slate-100">
              <pre className="px-3 py-3 whitespace-pre">
{`// tests/my_project.ts
import * as anchor from '@coral-xyz/anchor';
import { SupremeScan } from '@supremescan/solana';

it('scans the program', async () => {
  const scanner = new SupremeScan(process.env.SUPREMESCAN_API_KEY!);
  const report = await scanner.scanProgram('target/deploy/my_program.so');
  console.log(report);
});`}
              </pre>
            </div>
          </>
        )
      case 'FAQ':
        return (
          <>
            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-50">FAQ</h1>
            <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-200">
              Quick answers to the most common questions about SupremeScan&apos;s features, pricing, and
              support.
            </p>
            <div className="space-y-3 text-sm text-slate-200">
              <div>
                <p className="font-semibold">What is SupremeScan?</p>
                <p>
                  SupremeScan is an AI‑powered smart‑contract security platform providing real‑time
                  vulnerability detection, attack‑surface mapping, and automated audit reports for
                  Ethereum, EVM‑compatible chains, and Solana.
                </p>
              </div>
              <div>
                <p className="font-semibold">Is there a free trial?</p>
                <p>
                  Yes. We offer a time‑limited trial that lets you scan a limited number of contracts and
                  explore advanced features before upgrading.
                </p>
              </div>
              <div>
                <p className="font-semibold">Which blockchains are supported?</p>
                <p>
                  Ethereum, Solana, and major EVM chains including Polygon, Arbitrum, Optimism, and
                  Binance Smart Chain (BSC).
                </p>
              </div>
            </div>
          </>
        )
      case 'Support':
        return (
          <>
            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-50">Support</h1>
            <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-200">
              Need help? Reach us via Discord, email support, or our enterprise support portal.
            </p>
            <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm text-slate-200">
              <li>
                <span className="font-semibold">Community &amp; Discord.</span> Join our community server
                to ask questions, share findings, and learn from other builders.
              </li>
              <li>
                <span className="font-semibold">Email support.</span> For account and technical issues,
                reach us at <code className="rounded bg-slate-950/60 px-1 py-0.5">support@supremescan.io</code>.
              </li>
              <li>
                <span className="font-semibold">Enterprise portal.</span> Enterprise customers get a
                dedicated portal with SLAs, incident workflows, and priority triage.
              </li>
            </ol>
            <div className="mt-2 rounded-lg border border-sky-400/40 bg-sky-900/40 px-4 py-3 text-xs text-sky-50">
              <p>
                Before opening a ticket, skim the FAQ and search the docs—many common questions are already
                covered.
              </p>
            </div>
          </>
        )
      case 'Introduction':
      default:
        return (
          <>
            <h1 className="mb-3 text-3xl font-semibold tracking-tight text-slate-50">
              SupremeScan Documentation
            </h1>
            <p className="mb-6 max-w-3xl text-sm leading-relaxed text-slate-200">
              Welcome to the official documentation for SupremeScan, the leading AI‑powered smart contract
              security platform. Our docs are designed to help you integrate, scan, and secure your
              decentralized applications across Ethereum, EVM‑compatible chains, and Solana. Explore our
              features to understand how our real‑time vulnerability detection and automated reporting can
              enhance your security posture.
            </p>
            <div className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 p-4 shadow-inner shadow-black/20">
              <div className="grid gap-4 md:grid-cols-5">
                {featureStrip.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-3 py-3 text-center text-xs text-slate-100"
                  >
                    <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-[11px] font-semibold">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-6 overflow-hidden rounded-xl border border-emerald-500/40 bg-black/80 font-mono text-xs text-emerald-100 shadow-inner shadow-emerald-900/60">
              <div className="flex items-center justify-between border-b border-emerald-500/20 bg-emerald-900/40 px-3 py-2 text-[10px] text-emerald-100/80">
                <span>Terminal</span>
                <span className="text-emerald-300/80">supremescan</span>
              </div>
              <div className="px-3 py-3">
                <span className="text-emerald-400">$</span>{' '}
                <span className="text-emerald-100">
                  supremescan scan --contract 0xYourContract... --chain ethereum
                </span>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-sky-400/40 bg-sky-900/40 px-4 py-3 text-xs text-sky-50 shadow-inner shadow-sky-900/50">
              <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide">
                <span className="h-4 w-4 rounded-full bg-sky-300/80 text-[10px] text-sky-950 flex items-center justify-center">
                  ☼
                </span>
                <span>Note</span>
              </div>
              <p className="text-[11px] leading-relaxed text-sky-100">
                SupremeScan is a sample command‑line interface that showcases real‑time vulnerability
                detection and contract analysis across Ethereum, EVM‑compatible chains, and Solana. Use
                this documentation as a guide to connect your projects and interpret scan results.
              </p>
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1023] via-[#141b3b] to-[#080a16] text-slate-50">
      {/* Top bar */}
      <header className="border-b border-white/10 bg-[#0b1023cc] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <BrandMark className="cursor-pointer" />
            </Link>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">
              Docs
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-xs font-semibold">
            AS
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 rounded-2xl bg-white/5 p-3 text-sm text-slate-200 shadow-lg shadow-black/30 backdrop-blur-2xl md:block">
          <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Documentation
          </div>
          <nav className="space-y-0.5">
            {sections.map((item) => {
              const active = item === activeSection
              return (
                <button
                  key={item}
                  onClick={() => setActiveSection(item)}
                  className={cn(
                    'w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors',
                    active
                      ? 'bg-gradient-to-r from-purple-600/80 to-blue-500/80 text-white shadow-md shadow-purple-500/40'
                      : 'text-slate-300 hover:bg-white/5'
                  )}
                >
                  {item}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <section className="flex-1 rounded-2xl bg-white/5 p-6 text-sm shadow-xl shadow-black/40 backdrop-blur-2xl">
          {/* Breadcrumbs + search */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[11px] text-slate-400">
              <span>Home</span>
              <span className="mx-1.5 text-slate-600">›</span>
              <span>Documentation</span>
              <span className="mx-1.5 text-slate-600">›</span>
              <span className="text-slate-200">{breadcrumbLabel}</span>
            </div>
            <div className="relative w-full text-sm text-slate-300 sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKey}
                placeholder="Search sections (e.g. getting started)…"
                className="w-full rounded-full border border-white/10 bg-white/5 px-9 py-1.5 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/70"
              />
              {searchQuery.trim() && (
                <div className="absolute right-0 top-[110%] z-20 mt-1 w-full rounded-xl border border-white/10 bg-[#060818]/95 text-xs shadow-xl shadow-black/40">
                  {searchMatches.length === 0 ? (
                    <div className="px-3 py-2 text-[11px] text-slate-400">
                      No matching sections. Try terms like &quot;getting started&quot; or &quot;api&quot;.
                    </div>
                  ) : (
                    searchMatches.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          setActiveSection(label)
                          setSearchQuery('')
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] text-slate-200 hover:bg-white/5"
                      >
                        {label}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {renderContent()}
        </section>
      </main>
    </div>
  )
}

