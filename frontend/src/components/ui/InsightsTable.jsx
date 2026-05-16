import { useState, useEffect, useMemo } from 'react';
import { 
    ChevronLeft, 
    ChevronRight, 
    ChevronsLeft,
    ChevronsRight,
    Database, 
    FileText,
    SearchX,
    Download,
    Search,
    Coins,
    GanttChartSquare,
    ShieldAlert,
    Leaf,
    Cpu,
    Users,
    Scale
} from 'lucide-react';

const InsightsTable = ({ data = [] }) => {
    // =====================================
    // STATES
    // =====================================
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState(new Set());
    const rowsPerPage = 10;

    // Reset page and selections when data source changes
    useEffect(() => {
        setCurrentPage(1);
        setSelectedRows(new Set());
    }, [data]);

    // Reset page when search term filters the array
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // =====================================
    // REAL-TIME CLIENT FILTERING
    // =====================================
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return data;
        const target = searchTerm.toLowerCase().trim();
        return data.filter((item) => 
            (item.topic && item.topic.toLowerCase().includes(target)) ||
            (item.region && item.region.toLowerCase().includes(target)) ||
            (item.country && item.country.toLowerCase().includes(target)) ||
            (item.pestle && item.pestle.toLowerCase().includes(target))
        );
    }, [data, searchTerm]);

    // =====================================
    // MEMOIZED PAGINATION SLICE
    // =====================================
    const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;

    const currentTableData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage]);

    // =====================================
    // CHECKBOX ROW SELECTION HANDLERS
    // =====================================
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const currentIds = currentTableData.map((_, index) => index + (currentPage - 1) * rowsPerPage);
            setSelectedRows(new Set([...selectedRows, ...currentIds]));
        } else {
            const currentIds = currentTableData.map((_, index) => index + (currentPage - 1) * rowsPerPage);
            const updatedSelections = new Set(selectedRows);
            currentIds.forEach(id => updatedSelections.delete(id));
            setSelectedRows(updatedSelections);
        }
    };

    const handleSelectRow = (globalIndex) => {
        const updatedSelections = new Set(selectedRows);
        if (updatedSelections.has(globalIndex)) {
            updatedSelections.delete(globalIndex);
        } else {
            updatedSelections.add(globalIndex);
        }
        setSelectedRows(updatedSelections);
    };

    const isCurrentPageAllSelected = () => {
        if (currentTableData.length === 0) return false;
        return currentTableData.every((_, index) => 
            selectedRows.has(index + (currentPage - 1) * rowsPerPage)
        );
    };

    // =====================================
    // EXPORT TO CSV PIPELINE
    // =====================================
    const exportToCSV = () => {
        const targetData = selectedRows.size > 0 
            ? filteredData.filter((_, index) => selectedRows.has(index))
            : filteredData;

        if (!targetData.length) return;

        const headers = ['Topic', 'Category (PESTLE)', 'Region', 'Country', 'Intensity', 'Relevance'];
        const csvRows = [
            headers.join(','),
            ...targetData.map(item => [
                `"${item.topic || ''}"`,
                `"${item.pestle || ''}"`,
                `"${item.region || ''}"`,
                `"${item.country || ''}"`,
                item.intensity || 0,
                item.relevance || 0
            ].join(','))
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `InsightBoard_DataExport_${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
    };

    // =====================================
    // CONTEXTUAL MAP HELPERS
    // =====================================
    const getCategoryIcon = (pestle) => {
        if (!pestle) return <GanttChartSquare size={16} className="opacity-40" />;
        switch (pestle.toLowerCase()) {
            case 'economic': return <Coins size={16} className="text-amber-500" />;
            case 'political': return <ShieldAlert size={16} className="text-rose-500" />;
            case 'environmental': return <Leaf size={16} className="text-emerald-500" />;
            case 'technological': return <Cpu size={16} className="text-cyan-500" />;
            case 'social': return <Users size={16} className="text-violet-500" />;
            case 'legal': return <Scale size={16} className="text-blue-500" />;
            default: return <GanttChartSquare size={16} className="opacity-40" />;
        }
    };

    const getCountryFlag = (country) => {
        if (!country) return '';
        const norm = country.toLowerCase().trim();
        if (norm.includes('united states')) return '🇺🇸';
        if (norm === 'india') return '🇮🇳';
        if (norm.includes('united kingdom')) return '🇬🇧';
        if (norm === 'china') return '🇨🇳';
        if (norm === 'russia') return '🇷🇺';
        if (norm === 'germany') return '🇩🇪';
        if (norm === 'france') return '🇫🇷';
        if (norm === 'japan') return '🇯🇵';
        if (norm === 'saudi arabia') return '🇸🇦';
        if (norm === 'canada') return '🇨🇦';
        if (norm === 'brazil') return '🇧🇷';
        if (norm === 'australia') return '🇦🇺';
        return '🌐';
    };

    const getIntensityBadge = (intensity) => {
        if (!intensity) return <span className="text-[var(--foreground-muted)]">-</span>;
        if (intensity > 20) return <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 text-xs font-bold border border-rose-500/20">{intensity}</span>;
        if (intensity > 10) return <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">{intensity}</span>;
        return <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">{intensity}</span>;
    };

    const getRelevanceBadge = (relevance) => {
        if (!relevance) return <span className="text-[var(--foreground-muted)]">-</span>;
        if (relevance > 4) return <span className="text-cyan-500 font-bold">{relevance}</span>;
        if (relevance > 2) return <span className="text-violet-500 font-bold">{relevance}</span>;
        return <span className="text-[var(--foreground-muted)] font-medium">{relevance}</span>;
    };

    // =====================================
    // EXTENDED MATRIX PAGINATION BUILDER
    // =====================================
    const paginationRange = useMemo(() => {
        const delta = 1;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l > 2) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
        return rangeWithDots;
    }, [currentPage, totalPages]);

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-[var(--surface)] p-6 shadow-xl transition-all duration-300">
            
            {/* CONTAINER TOP LAYOUT PANEL */}
            <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-500 dark:text-blue-400">
                        <Database size={14} />
                        Data Directory
                    </div>
                    <h3 className="text-2xl font-bold app-text">Recent Insights</h3>
                    <p className="mt-1 text-sm app-text-muted">Detailed breakdown of filtered dataset variables.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* ENTERPRISE REAL-TIME FILTER INPUT BAR */}
                    <div className="relative min-w-[260px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" size={16} />
                        <input
                            type="text"
                            placeholder="Quick search records..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border app-border bg-[var(--surface-strong)]/20 app-text outline-none focus:border-cyan-500/50 transition-all"
                        />
                    </div>

                    {/* PIPELINE DATA EXPORT CONTROL BUTTON */}
                    <button 
                        onClick={exportToCSV}
                        disabled={filteredData.length === 0}
                        className="flex items-center justify-center gap-2 rounded-xl border app-border bg-[var(--surface-strong)]/40 px-4 py-2 text-sm font-semibold app-text transition hover:bg-[var(--hover)] hover:border-[var(--foreground-muted)] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        <Download size={16} />
                        {selectedRows.size > 0 ? `Export Selected (${selectedRows.size})` : 'Export CSV'}
                    </button>

                    <div className="flex items-center gap-2 rounded-xl border app-border bg-[var(--surface-strong)]/40 px-4 py-2 self-start sm:self-auto">
                        <FileText size={16} className="text-[var(--foreground-muted)]" />
                        <span className="text-sm font-semibold app-text">{filteredData.length}</span>
                        <span className="text-sm app-text-muted">Filtered</span>
                    </div>
                </div>
            </div>

            {/* INTERACTIVE COMPONENT WORKSPACE ENGINE CONTAINER */}
            {filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed app-border bg-[var(--surface-strong)]/20 py-16 text-center">
                    <SearchX size={40} className="mb-3 text-[var(--foreground-muted)] opacity-50" />
                    <h4 className="text-lg font-bold app-text">No Results Found</h4>
                    <p className="mt-1 text-sm app-text-muted max-w-sm">Adjust search criteria parameters to discover entries.</p>
                </div>
            ) : (
                <>
                    <div className="w-full overflow-x-auto rounded-2xl border app-border">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead className="bg-[var(--surface-strong)]/50 select-none">
                                <tr className="border-b app-border">
                                    {/* Action Toggle Selection Columns Element Header */}
                                    <th className="w-12 px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={isCurrentPageAllSelected()}
                                            onChange={handleSelectAll}
                                            className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 accent-cyan-500 cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[var(--foreground-muted)] text-xs">Topic</th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[var(--foreground-muted)] text-xs">Category (PESTLE)</th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[var(--foreground-muted)] text-xs">Region</th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[var(--foreground-muted)] text-xs">Country</th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[var(--foreground-muted)] text-xs">Intensity</th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[var(--foreground-muted)] text-xs">Relevance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTableData.map((item, index) => {
                                    const globalIndex = index + (currentPage - 1) * rowsPerPage;
                                    const isRowSelected = selectedRows.has(globalIndex);

                                    return (
                                        <tr 
                                            key={index} 
                                            onClick={() => handleSelectRow(globalIndex)}
                                            className={`border-b app-border transition-colors cursor-pointer last:border-0 ${
                                                isRowSelected ? 'bg-cyan-500/5 dark:bg-cyan-500/10 hover:bg-cyan-500/10' : 'hover:bg-[var(--hover)]'
                                            }`}
                                        >
                                            {/* Action Toggle Element Body Checkbox Container */}
                                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={isRowSelected}
                                                    onChange={() => handleSelectRow(globalIndex)}
                                                    className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 accent-cyan-500 cursor-pointer"
                                                />
                                            </td>

                                            <td className="px-6 py-4 font-bold app-text capitalize whitespace-nowrap">
                                                {item.topic || <span className="text-[var(--foreground-muted)] italic text-xs">Unspecified</span>}
                                            </td>

                                            <td className="px-6 py-4 app-text whitespace-nowrap">
                                                <div className="flex items-center gap-2.5">
                                                    {getCategoryIcon(item.pestle)}
                                                    <span className="capitalize font-medium text-sm">
                                                        {item.pestle || <span className="text-[var(--foreground-muted)] italic text-xs">General</span>}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-[var(--foreground-muted)] whitespace-nowrap font-medium">
                                                {item.region || '-'}
                                            </td>

                                            <td className="px-6 py-4 app-text whitespace-nowrap font-medium">
                                                {item.country ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base leading-none select-none">
                                                            {getCountryFlag(item.country)}
                                                        </span>
                                                        <span className="capitalize">{item.country}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[var(--foreground-muted)]">-</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getIntensityBadge(item.intensity)}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getRelevanceBadge(item.relevance)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* MATRIX PAGINATION STRUCTURAL FOOTER PANEL */}
                    <div className="mt-6 flex flex-col lg:flex-row items-center justify-between gap-4 select-none">
                        <div className="text-sm app-text-muted">
                            Showing <span className="font-semibold app-text">{(currentPage - 1) * rowsPerPage + 1}</span> to <span className="font-semibold app-text">{Math.min(currentPage * rowsPerPage, filteredData.length)}</span> of <span className="font-semibold app-text">{filteredData.length}</span> results
                        </div>

                        {/* ENTERPRISE SCALE PAGINATION BUTTON MATRIX LIST ARRAY ELEMENTS */}
                        <div className="flex items-center gap-1.5 flex-wrap justify-center">
                            {/* FIRST PAGE BOUNCER NAVIGATION CONTROL BUTTON ELEMENT */}
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border app-border bg-[var(--surface-strong)]/40 text-[var(--foreground)] transition hover:bg-[var(--hover)] disabled:opacity-30 disabled:cursor-not-allowed"
                                title="First Page"
                            >
                                <PaperIconWrapper Icon={ChevronsLeft} />
                            </button>

                            {/* PREVIOUS STEP PAGE NAVIGATION BACKWARD BUTTON */}
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border app-border bg-[var(--surface-strong)]/40 text-[var(--foreground)] transition hover:bg-[var(--hover)] disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Previous Page"
                            >
                                <PaperIconWrapper Icon={ChevronLeft} />
                            </button>

                            {/* NUMERIC MATRIX ENGINE BLOCK LOOP HOOK PANEL */}
                            {paginationRange.map((pageNumber, pageIndex) => {
                                if (pageNumber === '...') {
                                    return (
                                        <div key={pageIndex} className="flex h-9 w-9 items-center justify-center text-sm app-text-muted font-medium">
                                            ...
                                        </div>
                                    );
                                }

                                const isActive = pageNumber === currentPage;

                                return (
                                    <button
                                        key={pageIndex}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`flex h-9 w-9 items-center justify-center text-sm font-bold rounded-xl border transition-all duration-200 ${
                                            isActive 
                                                ? 'bg-cyan-500 border-cyan-500 text-white shadow-md shadow-cyan-500/20' 
                                                : 'app-border bg-[var(--surface-strong)]/20 app-text hover:bg-[var(--hover)]'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}

                            {/* NEXT STEP PAGE NAVIGATION FORWARD ACTION ROW ELEMENT BUTTON */}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border app-border bg-[var(--surface-strong)]/40 text-[var(--foreground)] transition hover:bg-[var(--hover)] disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Next Page"
                            >
                                <PaperIconWrapper Icon={ChevronRight} />
                            </button>

                            {/* LAST PAGE ROW END STEP BOUNDARY TERMINAL CONTROL TRIGGER PANEL */}
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border app-border bg-[var(--surface-strong)]/40 text-[var(--foreground)] transition hover:bg-[var(--hover)] disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Last Page"
                            >
                                <PaperIconWrapper Icon={ChevronsRight} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// Internal optimization component to bypass unnecessary wrapper micro-lifts re-evaluation cycles
const PaperIconWrapper = ({ Icon }) => <Icon size={16} className="shrink-0" />;

export default InsightsTable;