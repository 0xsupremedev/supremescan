/**
 * Solidity vulnerability detection patterns
 */

export interface VulnerabilityPattern {
    id: string
    name: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    description: string
    pattern: RegExp
    checkFunction?: (code: string) => boolean
}

/**
 * Common Solidity vulnerability patterns
 */
export const VULNERABILITY_PATTERNS: VulnerabilityPattern[] = [
    {
        id: 'SS-CRIT-001',
        name: 'Reentrancy - No Guard',
        severity: 'critical',
        description: 'External call followed by state change without reentrancy guard',
        pattern: /\.call\{value:/,
        checkFunction: (code: string) => {
            // Check if there's a call followed by state change
            const hasExternalCall = /\.call\{value:/.test(code) || /\.transfer\(/.test(code)
            const hasNoGuard = !/nonReentrant/.test(code) && !/ReentrancyGuard/.test(code)
            return hasExternalCall && hasNoGuard
        },
    },
    {
        id: 'SS-HIGH-001',
        name: 'Unchecked External Call',
        severity: 'high',
        description: 'External call return value not checked',
        pattern: /\.call\(/,
        checkFunction: (code: string) => {
            const lines = code.split('\n')
            for (const line of lines) {
                if (line.includes('.call(') && !line.includes('require(') && !line.includes('if (')) {
                    return true
                }
            }
            return false
        },
    },
    {
        id: 'SS-HIGH-002',
        name: 'Access Control Missing',
        severity: 'high',
        description: 'Critical function missing access control modifiers',
        pattern: /function\s+\w+\s*\([^)]*\)\s*(public|external)/,
        checkFunction: (code: string) => {
            const criticalFunctions = /(withdraw|transfer|mint|burn|pause|unpause|setOwner)/i
            const hasModifier = /(onlyOwner|onlyAdmin|onlyRole|require\(msg\.sender)/

            const lines = code.split('\n')
            for (const line of lines) {
                if (criticalFunctions.test(line) &&
                    (line.includes('public') || line.includes('external')) &&
                    !hasModifier.test(line)) {
                    return true
                }
            }
            return false
        },
    },
    {
        id: 'SS-MED-001',
        name: 'Timestamp Dependence',
        severity: 'medium',
        description: 'Using block.timestamp for critical logic',
        pattern: /block\.timestamp/,
    },
    {
        id: 'SS-MED-002',
        name: 'Integer Overflow Risk',
        severity: 'medium',
        description: 'Arithmetic operations without SafeMath (for Solidity < 0.8.0)',
        pattern: /pragma solidity \^0\.[1-7]\./,
        checkFunction: (code: string) => {
            const isOldVersion = /pragma solidity \^0\.[1-7]\./.test(code)
            const hasArithmetic = /[\+\-\*\/]/.test(code)
            const hasSafeMath = /using SafeMath/.test(code)
            return isOldVersion && hasArithmetic && !hasSafeMath
        },
    },
    {
        id: 'SS-MED-003',
        name: 'Gas Limit DoS',
        severity: 'medium',
        description: 'Unbounded loop that could hit gas limit',
        pattern: /for\s*\([^)]*\.length[^)]*\)/,
    },
    {
        id: 'SS-LOW-001',
        name: 'Missing Event Emission',
        severity: 'low',
        description: 'State-changing function without event emission',
        pattern: /function.*\{[\s\S]*?=[\s\S]*?\}/,
        checkFunction: (code: string) => {
            const functions = code.match(/function\s+\w+[^{]*\{[^}]*\}/g) || []
            for (const func of functions) {
                const hasStateChange = /=/.test(func) && !/==/.test(func)
                const hasEvent = /emit\s+\w+/.test(func)
                if (hasStateChange && !hasEvent && !func.includes('view') && !func.includes('pure')) {
                    return true
                }
            }
            return false
        },
    },
    {
        id: 'SS-LOW-002',
        name: 'Floating Pragma',
        severity: 'low',
        description: 'Using floating pragma (^) instead of fixed version',
        pattern: /pragma solidity \^/,
    },
]

export interface VulnerabilityFinding {
    id: string
    ruleId: string
    name: string
    severity: string
    description: string
    file: string
    lineNumber: number
    code: string
    recommendation: string
}

/**
 * Analyze Solidity code for vulnerabilities
 */
export function analyzeSolidityCode(
    code: string,
    fileName: string
): VulnerabilityFinding[] {
    const findings: VulnerabilityFinding[] = []
    const lines = code.split('\n')

    for (const pattern of VULNERABILITY_PATTERNS) {
        // Check if pattern matches
        let matched = false

        if (pattern.checkFunction) {
            matched = pattern.checkFunction(code)
        } else {
            matched = pattern.pattern.test(code)
        }

        if (matched) {
            // Find the line number where the issue occurs
            let lineNumber = 1
            for (let i = 0; i < lines.length; i++) {
                if (pattern.pattern.test(lines[i])) {
                    lineNumber = i + 1
                    break
                }
            }

            findings.push({
                id: `finding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                ruleId: pattern.id,
                name: pattern.name,
                severity: pattern.severity,
                description: pattern.description,
                file: fileName,
                lineNumber,
                code: lines[lineNumber - 1]?.trim() || '',
                recommendation: getRecommendation(pattern.id),
            })
        }
    }

    return findings
}

/**
 * Get remediation recommendation for vulnerability
 */
function getRecommendation(ruleId: string): string {
    const recommendations: Record<string, string> = {
        'SS-CRIT-001': 'Use the Checks-Effects-Interactions pattern and implement ReentrancyGuard. Move external calls to the end of the function.',
        'SS-HIGH-001': 'Always check the return value of external calls using require() or if statements.',
        'SS-HIGH-002': 'Add access control modifiers like onlyOwner or require checks to restrict function access.',
        'SS-MED-001': 'Avoid using block.timestamp for critical logic. Consider using block.number or external oracles.',
        'SS-MED-002': 'Use Solidity 0.8.0+ with built-in overflow checks or implement SafeMath library.',
        'SS-MED-003': 'Avoid unbounded loops. Use pagination or limit array sizes.',
        'SS-LOW-001': 'Emit events for all state-changing operations for better transparency and off-chain tracking.',
        'SS-LOW-002': 'Use fixed pragma version (e.g., pragma solidity 0.8.20) instead of floating (^) to ensure consistent compilation.',
    }

    return recommendations[ruleId] || 'Review and fix the vulnerability according to best practices.'
}
