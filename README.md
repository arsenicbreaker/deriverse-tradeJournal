# Deriverse Trade Journal

> **On-chain trading analytics dashboard for Solana traders.** Track, analyze, and optimize your trading performance across Solana-based perpetuals, spot, and options markets.

## Overview

Deriverse Trade Journal is a frontend-only trading analytics dashboard built for Solana ecosystem traders. It provides a comprehensive suite of tools to review trade history, visualize performance metrics, discover behavioral patterns, and manage risk — all through a premium dark-mode interface with glassmorphism aesthetics and Solana brand styling.

### Key Features

- **Wallet Onboarding** — Connect via Phantom or Solflare wallet
- **Dashboard** — KPI cards, equity curve, win/loss ratio, volume & fees overview
- **Trade Journal** — Full trade log with search, sort, filter, inline notes & tagging
- **Insights** — Performance heatmap, long/short analysis, symbol breakdown, order type stats, duration distribution
- **Risk Management** — Largest gain/loss outliers, directional bias gauge, win/loss streaks, risk/reward scatter plot
- **Global Filters** — Date range, symbol, and trade type filtering across all pages

## Tech Stack

| Category       | Technology                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**  | [React 19](https://react.dev/) with JSX                                                                                               |
| **Build Tool** | [Vite 7](https://vite.dev/)                                                                                                           |
| **Routing**    | [React Router DOM v7](https://reactrouter.com/)                                                                                       |
| **Charts**     | [Recharts 3](https://recharts.org/) (AreaChart, BarChart, PieChart, ScatterChart, ComposedChart)                                      |
| **Icons**      | [Lucide React](https://lucide.dev/)                                                                                                   |
| **Styling**    | Vanilla CSS with CSS Custom Properties (design tokens)                                                                                |
| **Typography** | [Poppins](https://fonts.google.com/specimen/Poppins) (UI) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (data) |
| **Linting**    | ESLint 9 with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`                                                           |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (included with Node.js)

### Installation

# Clone the repository

git clone https://github.com/your-username/deriverse-tradeJournal.git
cd deriverse-tradeJournal

# Install dependencies

npm install

### Development

# Start the dev server (default: http://localhost:5173)

npm run dev

## Project Structure

deriverse-tradeJournal/
├── public/
│ └── favicon.png # App favicon
├── src/
│ ├── components/
│ │ ├── common/ # Shared UI components
│ │ │ ├── HeaderBar.jsx # Top header with global filters & wallet
│ │ │ ├── HeaderBar.css
│ │ │ ├── Sidebar.jsx # Navigation sidebar + mobile bottom nav
│ │ │ ├── Sidebar.css
│ │ │ ├── StatCard.jsx # Reusable KPI metric card
│ │ │ └── StatCard.css
│ │ └── dashboard/ # Dashboard-specific chart components
│ │ ├── EquityCurve.jsx # Equity line + drawdown bar (ComposedChart)
│ │ ├── EquityCurve.css
│ │ ├── WinLossDonut.jsx # Win/Loss donut chart with center label
│ │ ├── WinLossDonut.css
│ │ ├── VolumeFeesBar.jsx # Daily volume & fees bar chart
│ │ ├── VolumeFeesBar.css
│ │ ├── RecentTrades.jsx # Last 5 trades summary table
│ │ └── RecentTrades.css
│ ├── data/
│ │ └── mockData.js # Mock trade generator + aggregation functions
│ ├── hooks/
│ │ └── useFilters.jsx # Global filter context (date, symbol, type)
│ ├── layouts/
│ │ ├── AppShell.jsx # Main layout wrapper (sidebar + header + outlet)
│ │ └── AppShell.css
│ ├── pages/
│ │ ├── Onboarding.jsx # Wallet connection landing page
│ │ ├── Onboarding.css
│ │ ├── Dashboard.jsx # Overview dashboard with KPIs & charts
│ │ ├── Dashboard.css
│ │ ├── Journal.jsx # Full trade journal table with notes/tags
│ │ ├── Journal.css
│ │ ├── Insights.jsx # Performance analytics & pattern discovery
│ │ ├── Insights.css
│ │ ├── Risk.jsx # Risk management metrics & visualizations
│ │ └── Risk.css
│ ├── utils/
│ │ └── formatters.js # Number, date, and PnL formatting utilities
│ ├── App.jsx # Root component with route definitions
│ ├── index.css # Global design system & base styles
│ └── main.jsx # App entry point (React 19 createRoot)
├── index.html # HTML entry with Poppins font + meta tags
├── package.json # Dependencies & scripts
├── vite.config.js # Vite configuration with React plugin
├── eslint.config.js # ESLint flat config
└── .gitignore
