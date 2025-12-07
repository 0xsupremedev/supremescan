<div align="center">

# 🔐 SupremeScan

### **AI-Powered Smart Contract Security Scanner**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Solidity](https://img.shields.io/badge/Solidity-Scanner-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)

<p align="center">
  <strong>Detect vulnerabilities in your Solidity smart contracts before they become exploits.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-vulnerability-detection">Detection</a> •
  <a href="#-documentation">Docs</a>
</p>

---

</div>

## ✨ Features

🔍 **Real-Time Vulnerability Detection**
- Scan Solidity contracts for critical, high, medium, and low severity issues
- Pattern-based analysis with custom vulnerability rules
- Line-by-line code inspection with precise location reporting

🔗 **GitHub Integration**
- Connect directly to your GitHub repositories
- Automated scanning of all `.sol` files in your codebase
- OAuth authentication for secure access

📊 **Interactive Dashboard**
- Visual vulnerability trends with Chart.js
- Attack surface graphs and metrics
- Live triage feed for real-time updates
- Comprehensive scan reports with remediation suggestions

🛡️ **Security-First Architecture**
- JWT-based authentication system
- Bcrypt password hashing
- Zod validation schemas
- Secure API routes with middleware protection

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
      <br>Next.js 14
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
      <br>React 18
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="TailwindCSS" />
      <br>TailwindCSS
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=nodejs" width="48" height="48" alt="Node.js" />
      <br>Node.js
    </td>
  </tr>
</table>

### Core Dependencies

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 14, React 18 |
| **Language** | TypeScript 5.2 |
| **Styling** | TailwindCSS 3.3, Framer Motion |
| **Authentication** | JWT, Bcrypt.js |
| **Visualization** | Chart.js, React-Chartjs-2 |
| **GitHub API** | Octokit |
| **Validation** | Zod |
| **UI Components** | Headless UI, Lucide React |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- GitHub account (for repository scanning)

### Installation

```bash
# Clone the repository
git clone https://github.com/0xsupremedev/supremescan.git

# Navigate to project directory
cd supremescan

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to access the application.

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Generate secure secrets:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Configure your `.env` file:
   ```env
   JWT_SECRET=<your-jwt-secret>
   SESSION_SECRET=<your-session-secret>
   SUPREMESCAN_DB_URL=postgresql://user:pass@localhost:5432/supremescan
   GITHUB_CLIENT_ID=<your-github-oauth-client-id>
   GITHUB_CLIENT_SECRET=<your-github-oauth-client-secret>
   ```

## 🔍 Vulnerability Detection

SupremeScan detects the following vulnerability patterns:

### Critical Severity 🔴
| ID | Name | Description |
|----|------|-------------|
| SS-CRIT-001 | Reentrancy | External call followed by state change without reentrancy guard |

### High Severity 🟠
| ID | Name | Description |
|----|------|-------------|
| SS-HIGH-001 | Unchecked External Call | External call return value not checked |
| SS-HIGH-002 | Access Control Missing | Critical function missing access control modifiers |

### Medium Severity 🟡
| ID | Name | Description |
|----|------|-------------|
| SS-MED-001 | Timestamp Dependence | Using block.timestamp for critical logic |
| SS-MED-002 | Integer Overflow Risk | Arithmetic without SafeMath (Solidity < 0.8.0) |
| SS-MED-003 | Gas Limit DoS | Unbounded loop that could hit gas limit |

### Low Severity 🟢
| ID | Name | Description |
|----|------|-------------|
| SS-LOW-001 | Missing Event Emission | State-changing function without event emission |
| SS-LOW-002 | Floating Pragma | Using floating pragma (^) instead of fixed version |

## 📁 Project Structure

```
supremescan/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── projects/       # Project management
│   │   └── scan/           # Scanning endpoints
│   ├── dashboard/          # Dashboard pages
│   ├── login/              # Login page
│   ├── signup/             # Registration page
│   └── scan/               # Scan interface
├── components/             # React Components
│   ├── dashboard/          # Dashboard components
│   │   ├── ScanProgress.tsx
│   │   ├── ScanReport.tsx
│   │   ├── MetricCard.tsx
│   │   └── ...
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   └── ...
├── lib/                    # Core Libraries
│   ├── auth/               # Authentication utilities
│   ├── database/           # Database connections
│   ├── github/             # GitHub API integration
│   ├── scanner/            # Vulnerability scanner engine
│   └── validation/         # Zod schemas
├── migrations/             # Database migrations
└── rules/                  # Scanning rules
```

## 🔐 Authentication

SupremeScan implements a secure authentication system:

### Password Requirements
- ✅ Minimum 8 characters
- ✅ At least 1 uppercase letter
- ✅ At least 1 lowercase letter
- ✅ At least 1 number
- ✅ At least 1 special character

**Valid examples:** `SecurePass123!`, `MyP@ssw0rd`

### User Flow
1. **Sign Up** → `/signup`
2. **Login** → `/login`
3. **Dashboard** → `/dashboard`

## 📊 Dashboard Features

- **GitHub Connect** - Link your GitHub account via OAuth
- **Repository Selector** - Choose repos to scan
- **Scan Progress** - Real-time scanning status
- **Vulnerability Trends** - Historical vulnerability charts
- **Attack Surface** - Visual representation of attack vectors
- **Scan Reports** - Detailed findings with remediation tips

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](./QUICKSTART.md) | Quick start guide |
| [AUTHENTICATION.md](./AUTHENTICATION.md) | Auth system details |
| [DATABASE_SETUP.md](./DATABASE_SETUP.md) | Database configuration |
| [SECURITY_FIXES.md](./SECURITY_FIXES.md) | Security improvements |
| [GITHUB_SETUP.md](./GITHUB_SETUP.md) | GitHub OAuth setup |

## 🏃 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [0xsupremedev](https://github.com/0xsupremedev)**

⭐ **Star this repo if you find it useful!** ⭐

</div>
