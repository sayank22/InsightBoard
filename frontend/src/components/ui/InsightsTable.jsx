import { useState, useEffect, useMemo } from 'react';
import { 
    ChevronLeft, 
    ChevronRight, 
    Database, 
    FileText,
    SearchX
} from 'lucide-react';

const InsightsTable = ({ data = [] }) => {
    // =====================================
    // PAGINATION STATE
    // =====================================
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Reset to page 1 whenever the data changes (e.g., when a filter is applied)
    useEffect(() => {
        setCurrentPage(1);
    }, [data]);

    // =====================================
    // MEMOIZED DATA CALCULATIONS
    // =====================================
    const totalPages = Math.ceil(data.length / rowsPerPage) || 1;

    const currentTableData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage]);

    // =====================================
    // HANDLERS
    // =====================================
    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // =====================================
    // UI HELPERS
    // =====================================
    const getIntensityBadge = (intensity) => {
        if (!intensity) return <span className="text-[var(--foreground-muted)]">-</span>;
        if (intensity > 20) return <span className="inline-flex items-center px-2 py-1 rounded-md bg-rose-500/10 text-rose-500 text-xs font-bold border border-rose-500/20">{intensity}</span>;
        if (intensity > 10) return <span className="inline-flex items-center px-2 py-1 rounded-md bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">{intensity}</span>;
        return <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">{intensity}</span>;
    };

    const getRelevanceBadge = (relevance) => {
        if (!relevance) return <span className="text-[var(--foreground-muted)]">-</span>;
        if (relevance > 4) return <span className="text-cyan-500 font-bold">{relevance}</span>;
        if (relevance > 2) return <span className="text-violet-500 font-bold">{relevance}</span>;
        return <span className="text-[var(--foreground-muted)] font-medium">{relevance}</span>;
    };

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-[var(--surface)] p-6 shadow-xl transition-all duration-300">
            
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-500 dark:text-blue-400">
                        <Database size={14} />
                        Data Directory
                    </div>
                    <h3 className="text-2xl font-bold app-text">
                        Recent Insights
                    </h3>
                    <p className="mt-1 text-sm app-text-muted">
                        Detailed breakdown of all filtered dataset records.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border app-border bg-[var(--surface-strong)]/40 px-4 py-2">
                    <FileText size={16} className="text-[var(--foreground-muted)]" />
                    <span className="text-sm font-semibold app-text">{data.length}</span>
                    <span className="text-sm app-text-muted">Total Records</span>
                </div>
            </div>

            {/* TABLE OR EMPTY STATE */}
            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed app-border bg-[var(--surface-strong)]/20 py-16 text-center">
                    <SearchX size={40} className="mb-3 text-[var(--foreground-muted)] opacity-50" />
                    <h4 className="text-lg font-bold app-text">No Data Available</h4>
                    <p className="mt-1 text-sm app-text-muted max-w-sm">
                        There are no records matching your current filter criteria.
                    </p>
                </div>
            ) : (
                <>
                    <div className="w-full overflow-x-auto rounded-2xl border app-border">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead className="bg-[var(--surface-strong)]/50">
                                <tr className="border-b app-border">
                                    <th className="whitespace-nowrap px-6 py-4 font-semibold uppercase tracking-wider text-[var(--foreground-muted)] text-xs">Topic</th>
                                    <th className="whitespace-nowrap px-6 py-4 font-semibold uppercase tracking-wider text-[var(--foreground-muted)] text-xs">Region</th>
                                    <th className="whitespace-nowrap px-6 py-4 font-semibold uppercase tracking-wider text-[var(--foreground-muted)] text-xs">Country</th>
                                    <th className="whitespace-nowrap px-6 py-4 font-semibold uppercase tracking-wider text-[var(--foreground-muted)] text-xs">Intensity</th>
                                    <th className="whitespace-nowrap px-6 py-4 font-semibold uppercase tracking-wider text-[var(--foreground-muted)] text-xs">Relevance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTableData.map((item, index) => (
                                    <tr 
                                        key={index} 
                                        className="border-b app-border transition-colors hover:bg-[var(--hover)] last:border-0"
                                    >
                                        <td className="px-6 py-4 font-medium app-text capitalize whitespace-nowrap">
                                            {item.topic || <span className="text-[var(--foreground-muted)] italic">Uncategorized</span>}
                                        </td>
                                        <td className="px-6 py-4 text-[var(--foreground-muted)] whitespace-nowrap">
                                            {item.region || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-[var(--foreground-muted)] whitespace-nowrap">
                                            {item.country || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getIntensityBadge(item.intensity)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getRelevanceBadge(item.relevance)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION CONTROLS */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm app-text-muted">
                                Showing <span className="font-semibold app-text">{(currentPage - 1) * rowsPerPage + 1}</span> to <span className="font-semibold app-text">{Math.min(currentPage * rowsPerPage, data.length)}</span> of <span className="font-semibold app-text">{data.length}</span> results
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border app-border bg-[var(--surface-strong)]/40 text-[var(--foreground)] transition-all hover:bg-[var(--hover)] disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                
                                <div className="flex h-9 min-w-[4rem] items-center justify-center rounded-xl bg-[var(--surface-strong)]/20 px-3 text-sm font-semibold app-text border app-border">
                                    {currentPage} / {totalPages}
                                </div>

                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border app-border bg-[var(--surface-strong)]/40 text-[var(--foreground)] transition-all hover:bg-[var(--hover)] disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default InsightsTable;