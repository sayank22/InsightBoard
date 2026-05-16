import { useEffect, useState, useCallback } from 'react';

import {
    Loader2,
    AlertCircle,
    RefreshCw,
    Database,
    FilterX,
} from 'lucide-react';

import DashboardLayout from '../components/layout/DashboardLayout';

import {
    fetchDashboardData,
    fetchDashboardStats,
    fetchFilterOptions,
} from '../api/dashboardApi';

import FilterBar from '../components/filters/FilterBar';
import StatsSection from '../components/ui/StatsSection';

import IntensityBarChart from '../components/charts/IntensityBarChart';
import TopicDonutChart from '../components/charts/TopicDonutChart';
import RegionChart from '../components/charts/RegionChart';
import YearTrendChart from '../components/charts/YearTrendChart';
import PestleChart from '../components/charts/PestleChart';
import BubbleChart from '../components/charts/BubbleChart';
import CountryChart from '../components/charts/CountryChart';
import CityChart from '../components/charts/CityChart';

import InsightsTable from '../components/ui/InsightsTable';
import AutoInsightSlider from '../components/ui/AutoInsightSlider';
import QuickNavWidget from '../components/ui/QuickNavWidget';

const initialFilterState = {
    end_year: '',
    start_year: '',
    sector: '',
    region: '',
    pestle: '',
    source: '',
    country: '',
    city: '',
    topic: '',
    intensity: '',
    likelihood: '',
    relevance: '',
    swot: '',
};

const Dashboard = () => {
    // =====================================
    // STATES
    // =====================================
    const [dashboardData, setDashboardData] = useState([]);
    const [stats, setStats] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState(initialFilterState);

    // =====================================
    // FILTER HANDLERS
    // =====================================
    const handleFilterChange = (filterName, value) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [filterName]: value,
        }));
    };

    const handleClearFilters = () => {
        setSelectedFilters(initialFilterState);
    };

    // =====================================
    // INITIAL LOAD
    // =====================================
    const loadDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [statsResponse, filtersResponse] = await Promise.all([
                fetchDashboardStats(),
                fetchFilterOptions(),
            ]);

            setStats(statsResponse.stats);
            setFilters(filtersResponse.filters);
        } catch (err) {
            console.error(err);
            setError('Failed to establish connection with the analytics server.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    // =====================================
    // FILTERED DATA & SWOT ANALYSIS
    // =====================================
    useEffect(() => {
        // Helper function to map data to a virtual SWOT matrix on the frontend
        const matchesSwot = (item, swotFilter) => {
            if (!swotFilter) return true;
            
            const intensity = item.intensity || 0;
            const likelihood = item.likelihood || 0;
            const relevance = item.relevance || 0;

            switch (swotFilter.toUpperCase()) {
                case 'STRENGTH':
                    return intensity >= 12 && likelihood >= 3;
                case 'WEAKNESS':
                    return intensity < 6 && relevance < 3;
                case 'OPPORTUNITY':
                    return intensity < 8 && relevance >= 4;
                case 'THREAT':
                    return intensity >= 16 && likelihood >= 4;
                default:
                    return true;
            }
        };

        const loadFilteredData = async () => {
            try {
                // Separate swot from the rest of the filters
                const { swot, ...backendFilters } = selectedFilters;

                // Fetch data from backend using only supported backend filters
                const dataResponse = await fetchDashboardData(backendFilters);
                const rawData = dataResponse.data || [];

                // Apply the custom virtual SWOT filter on the client side
                const filteredBySwot = rawData.filter((item) => 
                    matchesSwot(item, swot)
                );

                // Update state with the locally filtered data array
                setDashboardData(filteredBySwot);

            } catch (err) {
                console.error(err);
            }
        };

        loadFilteredData();
    }, [selectedFilters]);

    // =====================================
    // LOADING STATE
    // =====================================
    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5">
                    <div className="relative">
                        <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
                        <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground-muted">
                            Initializing Analytics Workspace
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // =====================================
    // ERROR STATE
    // =====================================
    if (error) {
        return (
            <DashboardLayout>
                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-2xl">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                            <AlertCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">Connection Error</h3>
                        <p className="mt-3 text-sm leading-6 text-foreground-muted">{error}</p>
                        <button
                            onClick={loadDashboard}
                            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-cyan-600 shadow-lg shadow-cyan-500/20"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Retry Connection
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // =====================================
    // MAIN UI
    // =====================================
    return (
        <DashboardLayout>
            <div className="pb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* 1. HEADER (Hero + Live Records) */}
                <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                            Live Intelligence Dashboard
                        </div>
                        <h1 className="bg-linear-to-r from-cyan-500 via-blue-500 to-violet-500 bg-clip-text text-4xl font-black tracking-tight text-transparent">
                            Analytics Overview
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground-muted">
                            Interactive intelligence analytics platform for exploring macro trends,
                            global distribution, sector activity, and multidimensional relationships.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-4 shadow-xl">
                        <div className="relative flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-wider text-foreground-muted">
                                Live Records
                            </div>
                            <div className="text-xl font-bold text-foreground">
                                {dashboardData.length.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. KPI CARDS */}
                <div className="mb-8">
                    <StatsSection stats={stats} />
                </div>

                {/* ROW PANEL BLOCK CONTROLS */}
<div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6 mb-8">

    {/* Left Column: Automated Highlights Carousel */}
    <AutoInsightSlider data={dashboardData} />

    {/* Right Column: Your New Jump Anchor Navigator */}
    <QuickNavWidget />

</div>

                {/* 3. FILTERS */}
                <div id="filter-section" className="mb-10 relative z-30">
                    <FilterBar
                        filters={filters}
                        selectedFilters={selectedFilters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                        dashboardData={dashboardData}
                    />
                </div>

                {/* EMPTY STATE OR CHARTS */}
                {dashboardData.length === 0 ? (
                    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-border bg-surface p-10 text-center shadow-sm">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-500/10">
                            <Database className="h-10 w-10 text-foreground-muted opacity-60" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">No Results Found</h3>
                        <p className="mt-3 max-w-md text-sm leading-6 text-foreground-muted">
                            Your selected filters returned no matching analytics records. Try adjusting your parameters.
                        </p>
                        <button
                            onClick={handleClearFilters}
                            className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-border bg-surface-strong/50 px-5 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-border"
                        >
                            <FilterX className="h-4 w-4" />
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        
                        {/* 4. FULL WIDTH: BubbleChart */}
                        <div id="bubble-chart" className="w-full">
                            <BubbleChart data={dashboardData} />
                        </div>

                        {/* 5. 2-COLUMN GRID CHARTS */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div id="year-trend"><YearTrendChart data={dashboardData} /></div>
<div id="region-analytics"><RegionChart data={dashboardData} /></div>
<div id="sector-intensity"><IntensityBarChart data={dashboardData} /></div>
<div id="topic-donut"><TopicDonutChart data={dashboardData} /></div>
<div id="country-map"><CountryChart data={dashboardData} /></div>
<div id="city-analytics"><CityChart data={dashboardData} /></div>
                        </div>

                        {/* 6. FULL WIDTH: PestleChart */}
                        <div id="pestle-analysis" className="w-full">
                            <PestleChart data={dashboardData} />
                        </div>

                        {/* FULL WIDTH: InsightsTable */}
                        <div id="insights-table" className="w-full">
                            <InsightsTable data={dashboardData} />
                        </div>

                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;