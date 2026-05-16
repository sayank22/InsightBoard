import { Filter, RotateCcw } from 'lucide-react';
import FilterSelect from './FilterSelect';

const FilterBar = ({
    filters,
    selectedFilters = {},
    onFilterChange,
    onClearFilters,
    dashboardData = []
}) => {
    
    // Check if any filter actually has a value selected
    const hasActiveFilters = Object.values(selectedFilters).some(val => val !== '');

    return (
        <div id="filter-section" className="relative overflow-hidden rounded-3xl border app-border bg-[var(--surface-strong)]/40 p-6 shadow-xl backdrop-blur-xl transition-all duration-300">
            
            {/* HEADER */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 shadow-sm border border-cyan-500/20">
                        <Filter size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold app-text">Data Filters</h3>
                        <p className="text-xs text-[var(--foreground-muted)]">Refine your analytics parameters</p>
                    </div>
                </div>

                {/* SMART RESET BUTTON (Only shows if filters are active) */}
                <div className="h-10 flex items-center">
                    {hasActiveFilters && (
                        <button 
                            onClick={onClearFilters}
                            className="group flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-500 transition-all hover:bg-rose-500 hover:text-white shadow-sm animate-in fade-in zoom-in duration-300"
                        >
                            <RotateCcw size={14} className="transition-transform duration-500 group-hover:-rotate-180" />
                            Reset Filters
                        </button>
                    )}
                </div>
            </div>

            {/* FILTER GRID */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <FilterSelect
                    label="End Year"
                    options={filters?.endYears || []}
                    value={selectedFilters?.end_year || ''}
                    onChange={(e) => onFilterChange('end_year', e.target.value)}
                    accentColor="text-violet-500"
                />

                <FilterSelect
                    label="Start Year"
                    options={filters?.startYears || []}
                    value={selectedFilters?.start_year || ''}
                    onChange={(e) => onFilterChange('start_year', e.target.value)}
                    accentColor="text-violet-500"
                />
                
                <FilterSelect
                    label="Topic"
                    options={filters?.topics || []}
                    value={selectedFilters?.topic || ''}
                    onChange={(e) => onFilterChange('topic', e.target.value)}
                    accentColor="text-pink-500"
                />
                
                <FilterSelect
                    label="Sector"
                    options={filters?.sectors || []}
                    value={selectedFilters?.sector || ''}
                    onChange={(e) => onFilterChange('sector', e.target.value)}
                    accentColor="text-cyan-500"
                />

                <FilterSelect
                    label="Region"
                    options={filters?.regions || []}
                    value={selectedFilters?.region || ''}
                    onChange={(e) => onFilterChange('region', e.target.value)}
                    accentColor="text-emerald-500"
                />

                <FilterSelect
                    label="PESTLE"
                    options={filters?.pestles || []}
                    value={selectedFilters?.pestle || ''}
                    onChange={(e) => onFilterChange('pestle', e.target.value)}
                    accentColor="text-amber-500"
                />

                <FilterSelect
                    label="Source"
                    options={filters?.sources || []}
                    value={selectedFilters?.source || ''}
                    onChange={(e) => onFilterChange('source', e.target.value)}
                    accentColor="text-blue-500"
                />

                <FilterSelect
                    label="Country"
                    options={filters?.countries || []}
                    value={selectedFilters?.country || ''}
                    onChange={(e) => onFilterChange('country', e.target.value)}
                    accentColor="text-blue-500"
                />   

                <FilterSelect
                    label="City"
                    options={filters?.cities || []}
                    value={selectedFilters?.city || ''}
                    onChange={(e) => onFilterChange('city', e.target.value)}
                    accentColor="text-rose-500"
                />
            
                <FilterSelect
                    label="Intensity"
                    options={filters?.intensityRanges || []}
                    value={selectedFilters?.intensity || ''}
                    onChange={(e) => onFilterChange('intensity', e.target.value)} 
                    accentColor="text-orange-500"
                />

                <FilterSelect
                    label="SWOT Category"
                    options={['Strength', 'Weakness', 'Opportunity', 'Threat']}
                    value={selectedFilters?.swot || ''}
                    onChange={(e) => onFilterChange('swot', e.target.value)}
                    accentColor="text-fuchsia-500"
                />

                {/* LIVE RECORDS METRIC BOX */}
                <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 shadow-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-md">
                    <div className="relative flex h-3 w-3 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
                            Live Records
                        </div>
                        <div className="text-xl font-extrabold app-text leading-tight">
                            {dashboardData.length.toLocaleString()}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FilterBar;