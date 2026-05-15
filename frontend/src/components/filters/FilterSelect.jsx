import { ChevronDown } from 'lucide-react';

const FilterSelect = ({ label, options = [], value, onChange }) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="pl-1 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                {label}
            </label>

            <div className="relative group">
                <select
                    value={value}
                    onChange={onChange}
                    className="
                        w-full appearance-none 
                        rounded-xl border app-border bg-[var(--surface)]
                        px-4 py-3 pr-10
                        text-sm font-medium app-text
                        outline-none transition-all duration-200
                        hover:border-[var(--foreground-muted)]
                        focus:border-cyan-500/50 focus:bg-[var(--surface-strong)] focus:ring-4 focus:ring-cyan-500/10
                        cursor-pointer
                    "
                >
                    <option value="">All {label}s</option>

                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                
                {/* Custom premium dropdown arrow */}
                <ChevronDown 
                    size={16} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none transition-transform group-hover:text-[var(--foreground)]" 
                />
            </div>
        </div>
    );
};

export default FilterSelect;