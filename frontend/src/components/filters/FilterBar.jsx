import { Filter, RotateCcw } from 'lucide-react';
import FilterSelect from './FilterSelect';

const FilterBar = ({
    filters,
    selectedFilters = {},
    onFilterChange,
    onClearFilters // <-- Pass this from Dashboard.jsx!
}) => {
    
    // Check if any filter actually has a value selected
    const hasActiveFilters = Object.values(selectedFilters).some(val => val !== '');

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-[var(--surface-strong)]/40 p-6 shadow-xl backdrop-blur-xl">
            
            {/* HEADER */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
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
                            className="flex items-center gap-2 rounded-xl bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-500 transition-all hover:bg-rose-500/20 animate-in fade-in zoom-in duration-300"
                        >
                            <RotateCcw size={14} />
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
                />

                <FilterSelect
                    label="Start Year"
                    options={filters?.startYears || []}
                    value={selectedFilters?.start_year || ''}
                    onChange={(e) => onFilterChange('start_year', e.target.value)}
                />
                
                <FilterSelect
                    label="Topic"
                    options={filters?.topics || []}
                    value={selectedFilters?.topic || ''}
                    onChange={(e) => onFilterChange('topic', e.target.value)}
                />
                
                <FilterSelect
                    label="Sector"
                    options={filters?.sectors || []}
                    value={selectedFilters?.sector || ''}
                    onChange={(e) => onFilterChange('sector', e.target.value)}
                />

                <FilterSelect
                    label="Region"
                    options={filters?.regions || []}
                    value={selectedFilters?.region || ''}
                    onChange={(e) => onFilterChange('region', e.target.value)}
                />

                <FilterSelect
                    label="PESTLE"
                    options={filters?.pestles || []}
                    value={selectedFilters?.pestle || ''}
                    onChange={(e) => onFilterChange('pestle', e.target.value)}
                />

                <FilterSelect
                    label="Source"
                    options={filters?.sources || []}
                    value={selectedFilters?.source || ''}
                    onChange={(e) => onFilterChange('source', e.target.value)}
                />

                <FilterSelect
                    label="Country"
                    options={filters?.countries || []}
                    value={selectedFilters?.country || ''}
                    onChange={(e) => onFilterChange('country', e.target.value)}
                />   

                <FilterSelect
                    label="City"
                    options={filters?.cities || []}
                    value={selectedFilters?.city || ''}
                    onChange={(e) => onFilterChange('city', e.target.value)}
                />
            
                <FilterSelect
                    label="Intensity"
                    options={filters?.intensityRanges || []}
                    value={selectedFilters?.intensity || ''}
                    // Fixed: was 'intensity_range' instead of 'intensity'
                    onChange={(e) => onFilterChange('intensity', e.target.value)} 
                />
            </div>
        </div>
    );
};

export default FilterBar;