import { useEffect, useState } from 'react';

import DashboardLayout from '../components/layout/DashboardLayout';

import {
    fetchDashboardData,
    fetchDashboardStats,
    fetchFilterOptions,
} from '../api/dashboardApi';

import FilterBar from '../components/filters/FilterBar';

import StatsSection from '../components/ui/StatsSection';


const Dashboard = () => {

    // Dashboard Data
    const [dashboardData, setDashboardData] = useState([]);

    // Stats
    const [stats, setStats] = useState(null);

    // Filter Options
    const [filters, setFilters] = useState(null);

    // Loading & Error
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    // Selected Filters
    const [selectedFilters, setSelectedFilters] = useState({
        sector: '',
        topic: '',
        region: '',
        country: '',
        pestle: '',
        source: '',
        end_year: '',
    });


    // Handle Filter Changes
    const handleFilterChange = (filterName, value) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [filterName]: value,
        }));
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================
    useEffect(() => {

        const loadDashboard = async () => {

            try {
                setLoading(true);

                setError(null);

                const [
                    statsResponse,
                    filtersResponse,
                ] = await Promise.all([
                    fetchDashboardStats(),
                    fetchFilterOptions(),
                ]);

                setStats(statsResponse.stats);

                setFilters(filtersResponse.filters);

            } catch (err) {

                console.error(err);

                setError('Failed to load dashboard.');

            } finally {

                setLoading(false);
            }
        };

        loadDashboard();

    }, []);


    // ==========================================
    // FILTERED DATA FETCH
    // ==========================================
    useEffect(() => {

        const loadFilteredData = async () => {

            try {

                const dataResponse = await fetchDashboardData(
                    selectedFilters
                );

                setDashboardData(dataResponse.data);

            } catch (err) {

                console.error(err);
            }
        };

        loadFilteredData();

    }, [selectedFilters]);


    // ==========================================
    // LOADING STATE
    // ==========================================
    if (loading) {
        return (
            <DashboardLayout>

                <div className="text-xl">
                    Loading dashboard...
                </div>

            </DashboardLayout>
        );
    }


    // ==========================================
    // ERROR STATE
    // ==========================================
    if (error) {
        return (
            <DashboardLayout>

                <div className="text-red-500 text-xl">
                    {error}
                </div>

            </DashboardLayout>
        );
    }


    // ==========================================
    // MAIN UI
    // ==========================================
    return (
        <DashboardLayout>

            <div>

                {/* Heading */}
                <h2 className="text-3xl font-bold mb-4">
                    Dashboard Overview
                </h2>

                <p className="text-slate-400 mb-8">
                    Interactive analytics and visualization dashboard.
                </p>


                {/* Filters */}
                <FilterBar
                    filters={filters}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                />


                {/* Stats */}
                <StatsSection stats={stats} />


                {/* TEMP DATA COUNT */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                    <h3 className="text-xl font-semibold mb-2">
                        Filtered Results
                    </h3>

                    <p className="text-slate-300">
                        Total Records: {dashboardData.length}
                    </p>

                </div>

            </div>

        </DashboardLayout>
    );
};

export default Dashboard;