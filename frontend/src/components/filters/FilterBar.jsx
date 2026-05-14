import FilterSelect from './FilterSelect';

const FilterBar = ({
    filters,
    selectedFilters = {},
    onFilterChange,
}) => {
    return (
        <div className="bg-slate-900 p-4 rounded-2xl mb-8 border border-slate-800">
            
            <h3 className="text-xl font-semibold mb-6">
                Filters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                <FilterSelect
                    label="End Year"
                    options={filters?.endYears || []}
                    value={selectedFilters?.end_year || ''}
                    onChange={(e) =>
                        onFilterChange('end_year', e.target.value)
                    }
                />

                <FilterSelect
                    label="Start Year"
                    options={filters?.startYears || []}
                    value={selectedFilters?.start_year || ''}
                    onChange={(e) =>
                        onFilterChange('start_year', e.target.value)
                    }
                />
                
                <FilterSelect
                    label="Topic"
                    options={filters?.topics || []}
                    value={selectedFilters?.topic || ''}
                    onChange={(e) =>
                        onFilterChange('topic', e.target.value)
                    }
                />
                
                <FilterSelect
                    label="Sector"
                    options={filters?.sectors || []}
                    value={selectedFilters?.sector || ''}
                    onChange={(e) =>
                        onFilterChange('sector', e.target.value)
                    }
                />

                <FilterSelect
                    label="Region"
                    options={filters?.regions || []}
                    value={selectedFilters?.region || ''}
                    onChange={(e) =>
                        onFilterChange('region', e.target.value)
                    }
                />

                <FilterSelect
                    label="PESTLE"
                    options={filters?.pestles || []}
                    value={selectedFilters?.pestle || ''}
                    onChange={(e) =>
                        onFilterChange('pestle', e.target.value)
                    }
                />

                <FilterSelect
                    label="Source"
                    options={filters?.sources || []}
                    value={selectedFilters?.source || ''}
                    onChange={(e) =>
                        onFilterChange('source', e.target.value)
                    }
                />

                <FilterSelect
                    label="Country"
                    options={filters?.countries || []}
                    value={selectedFilters?.country || ''}
                    onChange={(e) =>
                        onFilterChange('country', e.target.value)
                    }
                />   

                <FilterSelect
                label="City"
                options={filters?.cities || []}
                value={selectedFilters?.city || ''}
                onChange={(e) =>
                    onFilterChange('city', e.target.value)
                }
            />
            
            <FilterSelect
                label="Intensity"
                options={filters?.intensityRanges || []}
                value={selectedFilters?.intensity || ''}
                onChange={(e) =>
                    onFilterChange('intensity_range', e.target.value)
                }
            />

            </div>
        </div>
    );
};

export default FilterBar;