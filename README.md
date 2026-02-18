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
