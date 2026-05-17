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
    GanttChartSquare,
    ShieldAlert,
    Scale,
    Factory,       // Industries & Production
    Coins,         // Economic
    Landmark,      // Political
    Leaf,          // Environmental
    Users,         // Social
    Cpu,           // Technological
    Coffee,        // Lifestyles
    Flame,         // Gas
    Droplet,       // Oil      
    Send,          // Export
    Zap,           // Energy
    HelpCircle,    // Default Fallback
    ShoppingCart,  // For Consumption
    Store,         // For Market
    Banknote,      // For GDP
    Swords,        // For War
    TrendingUp,     // For Growth & Demand
    Briefcase,
    MoreVertical,
    Eye,
    Trash2
} from 'lucide-react';

const getCountryCode = (country) => {
    if (!country) return null;
    const mapping = {
        'united states of america': 'us', 'united states': 'us', 'india': 'in',
        'russia': 'ru', 'china': 'cn', 'iran': 'ir', 'saudi arabia': 'sa',
        'iraq': 'iq', 'libya': 'ly', 'germany': 'de', 'france': 'fr',
        'japan': 'jp', 'canada': 'ca', 'brazil': 'br', 'australia': 'au'
    };
    return mapping[country.toLowerCase().trim()] || null;
};

// =====================================
// DYNAMIC TOPIC ICON MAPPER
// =====================================
const getTopicIcon = (topic) => {
    if (!topic) return <HelpCircle size={16} className="text-[var(--foreground-muted)] opacity-50" />;
    
    const t = topic.toLowerCase();
    
    // Category-Based Icons
    if (t.includes('industries') || t.includes('industry')) return <Factory size={16} className="text-gray-400" />;
    if (t.includes('economic') || t.includes('economy')) return <Coins size={16} className="text-amber-500" />;
    if (t.includes('political') || t.includes('politics')) return <Landmark size={16} className="text-rose-500" />;
    if (t.includes('environmental') || t.includes('environment')) return <Leaf size={16} className="text-emerald-500" />;
    if (t.includes('social') || t.includes('society')) return <Users size={16} className="text-violet-500" />;
    if (t.includes('technological') || t.includes('technology')) return <Cpu size={16} className="text-cyan-500" />;
    if (t.includes('organization') || t.includes('corporate')) return <Briefcase size={16} className="text-blue-500" />;
    if (t.includes('lifestyle') || t.includes('culture')) return <Coffee size={16} className="text-orange-400" />;
    
    // Topic-Based Icons
    if (t.includes('gas')) return <Flame size={16} className="text-orange-500" />;
    if (t.includes('oil')) return <Droplet size={16} className="text-sky-400" />;
    if (t.includes('production')) return <Factory size={16} className="text-gray-400" />;
    if (t.includes('export')) return <Send size={16} className="text-blue-600" />;
    if (t.includes('energy')) return <Zap size={16} className="text-amber-400" />;
    if (t.includes('growth') || t.includes('demand')) return <TrendingUp size={16} className="text-emerald-500" />;
    if (t.includes('consumption')) return <ShoppingCart size={16} className="text-pink-500" />;
    if (t.includes('market')) return <Store size={16} className="text-indigo-800" />;
    if (t.includes('gdp')) return <Banknote size={16} className="text-emerald-600" />;
    if (t.includes('war') || t.includes('conflict')) return <Swords size={16} className="text-red-600" />;
    
    return <HelpCircle size={16} className="text-[var(--foreground-muted)] opacity-50" />;
};

// =====================================
// CONTEXTUAL MAP HELPERS
// =====================================
const getCategoryIcon = (pestle) => {
    if (!pestle) return <GanttChartSquare size={16} className="opacity-40" />;
    switch (pestle.toLowerCase()) {
        case 'industries': return <Factory size={16} className="text-violet-600" />;
        case 'economic': return <Coins size={16} className="text-amber-500" />;
        case 'political': return <ShieldAlert size={16} className="text-rose-500" />;
        case 'environmental': return <Leaf size={16} className="text-emerald-500" />;
        case 'technological': return <Cpu size={16} className="text-cyan-500" />;
        case 'social': return <Users size={16} className="text-indigo-500" />;
        case 'legal': return <Scale size={16} className="text-blue-500" />;
        case 'organization': return <Briefcase size={16} className="text-slate-500" />;
        case 'lifestyle': return <Coffee size={16} className="text-orange-500" />;
        default: return <GanttChartSquare size={16} className="opacity-40" />;
    }
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


const InsightsTable = ({ data = [] }) => {
    // =====================================
    // STATES
    // =====================================
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [openDropdown, setOpenDropdown] = useState(null); // Tracks open action menu
    const rowsPerPage = 10;

    // Reset page and selections when data source changes
    useEffect(() => {
        const id = setTimeout(() => {
            setCurrentPage(1);
            setSelectedRows(new Set());
        }, 0);
        return () => clearTimeout(id);
    }, [data]);

    // Reset page when search term filters the array
    useEffect(() => {
        const id = setTimeout(() => {
            setCurrentPage(1);
        }, 0);
        return () => clearTimeout(id);
    }, [searchTerm]);

    // Close dropdowns if user clicks anywhere outside the menu
    useEffect(() => {
        const closeMenu = () => setOpenDropdown(null);
        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener('click', closeMenu);
    }, []);

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
                    <div className="w-full overflow-x-visible rounded-2xl border app-border relative z-0">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead className="bg-[var(--surface-strong)]/50 select-none">
                                <tr className="border-b app-border">
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
                                    <th className="w-10 px-6 py-4 text-center"></th> 
                                </tr>
                            </thead>
                            <tbody>
                                {currentTableData.map((item, index) => {
                                    const globalIndex = index + (currentPage - 1) * rowsPerPage;
                                    const isRowSelected = selectedRows.has(globalIndex);
                                    const countryCode = getCountryCode(item.country);

                                    return (
                                        <tr 
                                            key={index} 
                                            onClick={() => handleSelectRow(globalIndex)}
                                            className={`border-b app-border transition-colors cursor-pointer last:border-0 relative ${
                                                isRowSelected ? 'bg-cyan-500/5 dark:bg-cyan-500/10 hover:bg-cyan-500/10' : 'hover:bg-[var(--hover)]'
                                            }`}
                                        >
                                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={isRowSelected}
                                                    onChange={() => handleSelectRow(globalIndex)}
                                                    className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 accent-cyan-500 cursor-pointer"
                                                />
                                            </td>

                                            {/* TOPIC COLUMN (WITH ICONS) */}
                                            <td className="px-6 py-4 font-bold app-text capitalize whitespace-nowrap">
                                                <div className="flex items-center gap-2.5">
                                                    {getTopicIcon(item.topic)}
                                                    {item.topic || <span className="text-[var(--foreground-muted)] italic text-xs font-normal">Unspecified</span>}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 app-text whitespace-nowrap">
                                                <div className="flex items-center gap-2.5">
                                                    {getCategoryIcon(item.pestle)}
                                                    <span className="capitalize font-medium text-sm">
                                                        {item.pestle || <span className="text-[var(--foreground-muted)] italic text-xs font-normal">General</span>}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-[var(--foreground-muted)] whitespace-nowrap font-medium">
                                                {item.region || '-'}
                                            </td>

                                            {/* COUNTRY COLUMN (WITH FLAG CSS) */}
                                            <td className="px-6 py-4 app-text whitespace-nowrap font-medium">
                                                {item.country ? (
                                                    <div className="flex items-center gap-2.5">
                                                        {countryCode ? (
                                                            <span className={`fi fi-${countryCode} rounded-sm text-sm shadow-sm`}></span>
                                                        ) : (
                                                            <span className="text-sm">🌐</span>
                                                        )}
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

                                            {/* ACTION DROPDOWN COLUMN */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenDropdown(openDropdown === globalIndex ? null : globalIndex);
                                                        }}
                                                        className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:bg-[var(--surface-strong)] hover:text-cyan-500 transition-colors focus:outline-none"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>

                                                    {/* DROPDOWN MENU */}
                                                    {openDropdown === globalIndex && (
                                                        <div className="absolute right-8 top-8 z-[100] w-36 rounded-xl border app-border bg-[var(--surface)] p-1.5 shadow-xl backdrop-blur-xl">
                                                            <button 
                                                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-cyan-500/10 hover:text-cyan-500"
                                                                onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); }}
                                                            >
                                                                <Eye size={14} /> View
                                                            </button>
                                                            <button 
                                                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-cyan-500/10 hover:text-cyan-500"
                                                                onClick={(e) => { e.stopPropagation(); exportToCSV(); setOpenDropdown(null); }}
                                                            >
                                                                <Download size={14} /> Download
                                                            </button>
                                                            <div className="my-1 h-px w-full bg-[var(--border)] opacity-50" />
                                                            <button 
                                                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-500/10"
                                                                onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); }}
                                                            >
                                                                <Trash2 size={14} /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
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
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border app-border bg-[var(--surface-strong)]/40 text-[var(--foreground)] transition hover:bg-[var(--hover)] disabled:opacity-30 disabled:cursor-not-allowed"
                                title="First Page"
                            >
                                <PaperIconWrapper Icon={ChevronsLeft} />
                            </button>

                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border app-border bg-[var(--surface-strong)]/40 text-[var(--foreground)] transition hover:bg-[var(--hover)] disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Previous Page"
                            >
                                <PaperIconWrapper Icon={ChevronLeft} />
                            </button>

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

                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border app-border bg-[var(--surface-strong)]/40 text-[var(--foreground)] transition hover:bg-[var(--hover)] disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Next Page"
                            >
                                <PaperIconWrapper Icon={ChevronRight} />
                            </button>

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