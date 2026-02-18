# Deriverse Trade Journal

> **On-chain trading analytics dashboard for Solana traders.** Track, analyze, and optimize your trading performance across Solana-based perpetuals, spot, and options markets.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Pages](#pages)
  - [Onboarding](#onboarding)
  - [Dashboard](#dashboard)
  - [Journal](#journal)
  - [Insights](#insights)
  - [Risk Management](#risk-management)
- [Components](#components)
  - [Common Components](#common-components)
  - [Dashboard Components](#dashboard-components)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Data Layer](#data-layer)
- [Design System](#design-system)
- [Scripts](#scripts)
- [License](#license)

---

## Overview

Deriverse Trade Journal is a frontend-only trading analytics dashboard built for Solana ecosystem traders. It provides a comprehensive suite of tools to review trade history, visualize performance metrics, discover behavioral patterns, and manage risk — all through a premium dark-mode interface with glassmorphism aesthetics and Solana brand styling.

### Key Features

- **Wallet Onboarding** — Connect via Phantom or Solflare wallet
- **Dashboard** — KPI cards, equity curve, win/loss ratio, volume & fees overview
- **Trade Journal** — Full trade log with search, sort, filter, inline notes & tagging
- **Insights** — Performance heatmap, long/short analysis, symbol breakdown, order type stats, duration distribution
- **Risk Management** — Largest gain/loss outliers, directional bias gauge, win/loss streaks, risk/reward scatter plot
- **Global Filters** — Date range, symbol, and trade type filtering across all pages

---

## Tech Stack

| Category       | Technology                                                                 |
|----------------|---------------------------------------------------------------------------|
| **Framework**  | [React 19](https://react.dev/) with JSX                                   |
| **Build Tool** | [Vite 7](https://vite.dev/)                                               |
| **Routing**    | [React Router DOM v7](https://reactrouter.com/)                           |
| **Charts**     | [Recharts 3](https://recharts.org/) (AreaChart, BarChart, PieChart, ScatterChart, ComposedChart) |
| **Icons**      | [Lucide React](https://lucide.dev/)                                       |
| **Styling**    | Vanilla CSS with CSS Custom Properties (design tokens)                    |
| **Typography** | [Poppins](https://fonts.google.com/specimen/Poppins) (UI) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (data) |
| **Linting**    | ESLint 9 with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (included with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/deriverse-tradeJournal.git
cd deriverse-tradeJournal

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server (default: http://localhost:5173)
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## Project Structure

```
deriverse-tradeJournal/
├── public/
│   └── favicon.png              # App favicon
├── src/
│   ├── components/
│   │   ├── common/              # Shared UI components
│   │   │   ├── HeaderBar.jsx    # Top header with global filters & wallet
│   │   │   ├── HeaderBar.css
│   │   │   ├── Sidebar.jsx      # Navigation sidebar + mobile bottom nav
│   │   │   ├── Sidebar.css
│   │   │   ├── StatCard.jsx     # Reusable KPI metric card
│   │   │   └── StatCard.css
│   │   └── dashboard/           # Dashboard-specific chart components
│   │       ├── EquityCurve.jsx  # Equity line + drawdown bar (ComposedChart)
│   │       ├── EquityCurve.css
│   │       ├── WinLossDonut.jsx # Win/Loss donut chart with center label
│   │       ├── WinLossDonut.css
│   │       ├── VolumeFeesBar.jsx # Daily volume & fees bar chart
│   │       ├── VolumeFeesBar.css
│   │       ├── RecentTrades.jsx # Last 5 trades summary table
│   │       └── RecentTrades.css
│   ├── data/
│   │   └── mockData.js          # Mock trade generator + aggregation functions
│   ├── hooks/
│   │   └── useFilters.jsx       # Global filter context (date, symbol, type)
│   ├── layouts/
│   │   ├── AppShell.jsx         # Main layout wrapper (sidebar + header + outlet)
│   │   └── AppShell.css
│   ├── pages/
│   │   ├── Onboarding.jsx       # Wallet connection landing page
│   │   ├── Onboarding.css
│   │   ├── Dashboard.jsx        # Overview dashboard with KPIs & charts
│   │   ├── Dashboard.css
│   │   ├── Journal.jsx          # Full trade journal table with notes/tags
│   │   ├── Journal.css
│   │   ├── Insights.jsx         # Performance analytics & pattern discovery
│   │   ├── Insights.css
│   │   ├── Risk.jsx             # Risk management metrics & visualizations
│   │   └── Risk.css
│   ├── utils/
│   │   └── formatters.js        # Number, date, and PnL formatting utilities
│   ├── App.jsx                  # Root component with route definitions
│   ├── index.css                # Global design system & base styles
│   └── main.jsx                 # App entry point (React 19 createRoot)
├── index.html                   # HTML entry with Poppins font + meta tags
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite configuration with React plugin
├── eslint.config.js             # ESLint flat config
└── .gitignore
```

---

## Architecture

### Routing

The app uses **React Router DOM v7** with the following route structure:

```
/                → Onboarding (wallet connection, standalone — no shell)
├── /dashboard   → Dashboard (inside AppShell)
├── /journal     → Journal (inside AppShell)
├── /insights    → Insights (inside AppShell)
├── /risk        → Risk Management (inside AppShell)
└── /*           → Redirect to /
```

- The **Onboarding** page is rendered standalone (no sidebar/header).
- All other pages are wrapped in the **AppShell** layout which provides the `Sidebar`, `HeaderBar`, and `FilterProvider` context.

### State Management

The app uses **React Context API** for global state:

- **`FilterProvider`** (in `useFilters.jsx`) wraps all authenticated pages via `AppShell`.
- Provides global filtering state (date range, selected symbols, selected trade types) that all pages consume.
- Page-level state (search, sort, pagination, expanded rows) is managed with local `useState`.

### Data Flow

```
mockData.js (generates 230 trades)
  ↓
FilterProvider (applies global filters)
  ↓
useFilters() hook (consumed by pages)
  ↓
Pages compute derived data via useMemo()
  ↓
Chart/Table components receive data as props
```

---

## Pages

### Onboarding

**Route:** `/` · **File:** `src/pages/Onboarding.jsx`

The wallet connection landing page with:
- Animated floating particle background (30 particles with randomized positions and animations)
- Deriverse logo loaded from `deriverse.io`
- "Trading Analytics" subtitle with gradient text branding
- Two wallet connection buttons: **Phantom** and **Solflare**
- Currently navigates directly to `/dashboard` on click (wallet integration placeholder)
- "Powered by Solana" footer with gradient text

### Dashboard

**Route:** `/dashboard` · **File:** `src/pages/Dashboard.jsx`

The main overview page featuring:
- **4 KPI StatCards** with staggered entrance animations:
  - Total Equity (USD)
  - Total PnL (USD + % return)
  - Win Rate (% + W/L count)
  - Max Drawdown (% from peak)
- **Equity Curve** — `ComposedChart` with equity area line (teal gradient) and drawdown bars (red)
- **Win/Loss Donut** — `PieChart` with center-label win rate percentage, avg win/loss comparison
- **Volume & Fees Bar Chart** — Daily stacked bar chart showing volume (purple) and fees (teal)
- **Recent Trades Table** — Last 5 trades with symbol, side, PnL, duration, and time. "View All" links to Journal.

### Journal

**Route:** `/journal` · **File:** `src/pages/Journal.jsx`

A full-featured trade log with:
- **Search** — Filter by symbol name or trade ID
- **Side Filter** — Toggle All / Long / Short via pill buttons
- **Tag Filter** — Dropdown select from 8 preset tags (Planned, FOMO, Revenge Trade, Breakout, Trend Follow, Scalp, Swing, News Play)
- **Sortable Columns** — Click headers to sort by symbol, side, entry, exit, PnL, PnL%, duration, or time
- **Expandable Rows** — Click any trade to reveal:
  - Editable notes textarea
  - Tag toggle buttons (add/remove preset tags)
- **Pagination** — 15 trades per page with smart page number display (max 7 visible pages)

### Insights

**Route:** `/insights` · **File:** `src/pages/Insights.jsx`

Advanced analytics and pattern discovery:
- **Performance Heatmap** — 7×24 grid (day × hour) color-coded by PnL. Green = profitable, Red = losing, with intensity showing magnitude. Highlights best trading hour.
- **Long vs Short Comparison** — Side-by-side bars showing win rate and average PnL for long vs short trades.
- **Symbol Performance** — Horizontal `BarChart` ranking each traded symbol by total PnL.
- **Order Type Analysis** — `PieChart` comparing Market vs Limit orders with win rate and PnL breakdown. Auto-detects which order type is more profitable.
- **Trade Duration Distribution** — `BarChart` bucketing trades by duration (< 5m to 7d+), colored by profitability. Classifies the user as Scalper / Day Trader / Swing Trader / Position Trader based on average duration.

### Risk Management

**Route:** `/risk` · **File:** `src/pages/Risk.jsx`

Risk metrics and outlier analysis:
- **Outlier Cards** — Largest single gain and largest single loss with symbol, side, date, PnL%, and duration.
- **Directional Bias Gauge** — Visual gauge (Bearish ↔ Bullish) showing percentage of long trades. Labels as Long-biased, Short-biased, or Balanced.
- **Win/Loss Streaks** — Best consecutive win streak and worst consecutive loss streak, visualized as animated block strips.
- **Risk/Reward Scatter Plot** — `ScatterChart` plotting each trade's position size (x) vs PnL (y). Dots colored green (win) / red (loss) to reveal risk patterns.

---

## Components

### Common Components

#### `Sidebar` (`src/components/common/Sidebar.jsx`)

- Desktop: Fixed left sidebar (240px) with logo, navigation links (Dashboard, Journal, Insights, Risk), and Settings.
- Uses `NavLink` for active-state highlighting with a left indicator bar.
- Mobile: Renders a fixed bottom navigation bar (`mobile-nav`) with icon + label for each route.
- Responsive: Collapses to 72px on tablets (≤1279px), hidden on mobile (≤767px, replaced by bottom nav).

#### `HeaderBar` (`src/components/common/HeaderBar.jsx`)

- Displays the current page title.
- **Global Filters:**
  - Date range picker (start/end date inputs)
  - Symbol filter pills (toggle individual trading pairs)
  - Trade type filter pills (Spot / Perpetual / Options)
  - Clear all filters button (appears when any filter is active)
- Wallet address display button (currently shows truncated mock address `Gx7k...m3Qp`).

#### `StatCard` (`src/components/common/StatCard.jsx`)

Reusable KPI card supporting:
- `label` — Metric name
- `value` — Numeric value
- `format` — `"usd"`, `"percent"`, or raw display
- `icon` — Lucide icon component
- `subtitle` — Additional context text
- `delay` — Staggered animation delay (in ms)
- Auto-colors values based on positive (green) / negative (red) / zero (muted).

### Dashboard Components

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `EquityCurve` | `components/dashboard/EquityCurve.jsx` | `data` (array of `{date, equity, drawdown}`) | Composed chart with equity area line + drawdown bars |
| `WinLossDonut` | `components/dashboard/WinLossDonut.jsx` | `stats` (object with `wins`, `losses`, `winRate`, `avgWin`, `avgLoss`) | Donut chart with center win rate + avg win/loss comparison |
| `VolumeFeesBar` | `components/dashboard/VolumeFeesBar.jsx` | `data` (array of `{date, volume, fees}`) | Dual bar chart for daily volume and fees |
| `RecentTrades` | `components/dashboard/RecentTrades.jsx` | `trades` (array of trade objects) | Summary table of the 5 most recent trades |

All chart components include custom `Tooltip` components styled with the `.chart-tooltip` class.

---

## Hooks

### `useFilters` (`src/hooks/useFilters.jsx`)

A React Context-based hook providing global filter state and filtered data across all pages.

**Provider:** `FilterProvider` — wraps `AppShell` so all authenticated pages share filter state.

**Exposed values:**

| Property | Type | Description |
|----------|------|-------------|
| `dateRange` | `{ start: string, end: string }` | ISO date range filter |
| `setDateRange` | `function` | Setter for date range |
| `selectedSymbols` | `string[]` | Currently selected symbol filters |
| `setSelectedSymbols` | `function` | Setter for symbol filters |
| `selectedTypes` | `string[]` | Currently selected type filters (Spot/Perpetual/Options) |
| `setSelectedTypes` | `function` | Setter for type filters |
| `filteredTrades` | `Trade[]` | Trades filtered by all active filters (memoized) |
| `allSymbols` | `string[]` | List of all unique symbols in the dataset |
| `allTypes` | `string[]` | List of all unique trade types in the dataset |

---

## Utilities

### `formatters.js` (`src/utils/formatters.js`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `formatUsd` | `(value: number) → string` | Formats USD with +/- prefix, `k` and `M` suffixes (e.g., `+$1.2k`) |
| `formatPercent` | `(value: number) → string` | Formats percentage with sign (e.g., `+12.34%`) |
| `formatPrice` | `(value: number, decimals?: number) → string` | Smart decimal formatting for asset prices (2-8 decimals based on magnitude) |
| `formatDuration` | `(minutes: number) → string` | Converts minutes to human-readable duration (`15m`, `2.5h`, `3.2d`) |
| `formatDate` | `(isoString: string) → string` | Short date format (e.g., `Feb 17, '26`) |
| `formatDateTime` | `(isoString: string) → string` | Date + time format (e.g., `Feb 17, 02:30 PM`) |
| `pnlColor` | `(value: number) → string` | Returns CSS variable for PnL coloring (`--color-win`, `--color-loss`, or `--text-muted`) |
| `pnlClass` | `(value: number) → string` | Returns CSS class name for PnL coloring (`text-win`, `text-loss`, or `text-muted`) |

---

## Data Layer

### `mockData.js` (`src/data/mockData.js`)

Generates **230 realistic mock trades** with randomized data spanning 90 days of trading activity.

#### Trade Object Schema

```javascript
{
  id: string,              // e.g., "TRD-0042"
  symbol: string,          // e.g., "SOL/USDC", "BONK/USDC", "JUP/USDC", "WIF/USDC", "RNDR/USDC", "PYTH/USDC"
  type: string,            // "Spot" | "Perpetual" | "Options"
  side: string,            // "Long" | "Short"
  orderType: string,       // "Market" | "Limit"
  entryPrice: number,      // Asset-appropriate price
  exitPrice: number,       // Calculated from PnL%
  size: number,            // Position size in USD ($50 — $5,000)
  pnlUsd: number,          // Profit/loss in USD
  pnlPercent: number,      // Profit/loss percentage (-15% to +20%)
  isWin: boolean,          // true if pnlPercent > 0
  fee: number,             // Trading fee (0.05% — 0.3% of size)
  openTime: string,        // ISO 8601 timestamp
  closeTime: string,       // ISO 8601 timestamp
  durationMinutes: number, // Trade duration (2 min — 7 days)
  tags: string[],          // e.g., ["Planned", "Scalp"]
  notes: string,           // Optional trade notes
}
```

#### Aggregation Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getEquityCurve(trades)` | `[{date, equity, drawdown}]` | Running equity from $10,000 starting capital with drawdown tracking |
| `getStats(trades)` | `object` | KPIs: total trades, wins/losses, win rate, total PnL, avg win/loss, fees, volume, equity, max drawdown |
| `getVolumeByDay(trades)` | `[{date, volume, fees}]` | Daily aggregated volume and fees (last 30 days) |
| `getPerformanceByHour(trades)` | `[{day, hour, pnl, count}]` | 7×24 grid of PnL and trade count by day of week × hour |
| `getLongShortStats(trades)` | `[{side, winRate, avgPnl, count}]` | Win rate and average PnL for longs vs shorts |
| `getSymbolPerformance(trades)` | `[{symbol, pnl, wins, losses, count, winRate}]` | Per-symbol performance breakdown |
| `getOrderTypeStats(trades)` | `[{type, count, winRate, pnl}]` | Market vs Limit order performance |
| `getDurationDistribution(trades)` | `[{label, count, avgPnl}]` | Trades bucketed by duration (8 buckets from <5m to 7d+) |
| `getStreaks(trades)` | `{maxWinStreak, maxLossStreak}` | Longest consecutive win and loss streaks |
| `getDirectionalBias(trades)` | `number` | Percentage of trades that are long |
| `getLargestTrades(trades)` | `{largestGain, largestLoss}` | Single best and worst trades |

---

## Design System

The global design system is defined in `src/index.css` and includes:

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#0a0b1e` | Page background |
| `--bg-surface` | `#12132b` | Card/panel backgrounds |
| `--bg-surface-hover` | `#1a1c3a` | Hover state for surfaces |
| `--bg-elevated` | `#1e2042` | Tooltips, elevated surfaces |
| `--sol-purple` | `#9945FF` | Solana brand purple |
| `--sol-teal` | `#14F195` | Solana brand teal/green |
| `--color-win` | `#00E676` | Profit / positive values |
| `--color-loss` | `#FF5252` | Loss / negative values |
| `--color-neutral` | `#FFB74D` | Neutral / warning values |
| `--color-info` | `#42A5F5` | Informational elements |

### Typography

- **UI Font:** Poppins (100–900 weights)
- **Mono Font:** JetBrains Mono (for numerical/data values)
- Scale: 12px (caption) → 32px (hero)

### Key CSS Classes

| Class | Purpose |
|-------|---------|
| `.card` | Glassmorphism card with `backdrop-filter: blur(12px)`, purple border glow on hover |
| `.mono` | JetBrains Mono font for data display |
| `.text-win` / `.text-loss` | PnL coloring |
| `.gradient-text` | Solana gradient text effect |
| `.badge` | Pill-shaped tag/label with variants: `badge-win`, `badge-loss`, `badge-neutral`, `badge-info` |
| `.btn-primary` | Solana gradient button |
| `.btn-ghost` | Transparent button with hover fill |
| `.page-enter` | Page transition animation (fade-in-up) |
| `.stagger-children` | Cascading entrance animation for child elements |

### Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| `≤ 1279px` | Sidebar collapses to icon-only (72px) |
| `≤ 767px` | Sidebar hidden, mobile bottom nav appears, header height reduced |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on the project |

---

## License

This project is private. All rights reserved.
