import { useMemo } from 'react';
import { useFilters } from '../hooks/useFilters';
import { getStats, getEquityCurve, getVolumeByDay } from '../data/mockData';
import StatCard from '../components/common/StatCard';
import EquityCurve from '../components/dashboard/EquityCurve';
import WinLossDonut from '../components/dashboard/WinLossDonut';
import VolumeFeesBar from '../components/dashboard/VolumeFeesBar';
import RecentTrades from '../components/dashboard/RecentTrades';
import { DollarSign, TrendingUp, Target, TrendingDown } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
    const { filteredTrades } = useFilters();

    const stats = useMemo(() => getStats(filteredTrades), [filteredTrades]);
    const equityCurve = useMemo(() => getEquityCurve(filteredTrades), [filteredTrades]);
    const volumeData = useMemo(() => getVolumeByDay(filteredTrades), [filteredTrades]);

    return (
        <div className="dashboard page-enter">
            {/* KPI Cards */}
            <div className="dashboard__kpis stagger-children">
                <StatCard
                    label="Total Equity"
                    value={stats.equity}
                    format="usd"
                    icon={DollarSign}
                    subtitle={`Starting: $10,000`}
                    delay={0}
                />
                <StatCard
                    label="Total PnL"
                    value={stats.totalPnl}
                    format="usd"
                    icon={TrendingUp}
                    subtitle={`${stats.totalPnlPercent.toFixed(2)}% return`}
                    delay={80}
                />
                <StatCard
                    label="Win Rate"
                    value={stats.winRate}
                    format="percent"
                    icon={Target}
                    subtitle={`${stats.wins}W / ${stats.losses}L of ${stats.totalTrades}`}
                    delay={160}
                />
                <StatCard
                    label="Max Drawdown"
                    value={stats.maxDrawdown}
                    format="percent"
                    icon={TrendingDown}
                    subtitle="From peak equity"
                    delay={240}
                />
            </div>

            {/* Equity Curve */}
            <EquityCurve data={equityCurve} />

            {/* Bottom Row */}
            <div className="dashboard__bottom-row">
                <WinLossDonut stats={stats} />
                <VolumeFeesBar data={volumeData} />
            </div>

            {/* Recent Trades */}
            <RecentTrades trades={filteredTrades} />
        </div>
    );
}
