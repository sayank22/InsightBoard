import { ChevronDown, Check } from 'lucide-react';

const FilterSelect = ({ label, options = [], value, onChange, accentColor = "text-cyan-500" }) => {
    const isDisabled = options.length === 0;
    const isSelected = value !== '';

    // Extract the tailwind color name (e.g., 'cyan') from the accentColor string (e.g., 'text-cyan-500')
    const colorBase = accentColor.split('-')[1] || 'cyan';

    return (
        <div className="flex flex-col gap-1.5 group/wrapper">
            <div className="flex items-center justify-between">
                <label className={`pl-1 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isSelected ? accentColor : 'text-[var(--foreground-muted)] group-hover/wrapper:text-[var(--foreground)]'}`}>
                    {label}
                </label>
                {isSelected && (
                    <Check size={12} className={accentColor} strokeWidth={3} />
                )}
            </div>

            <div className="relative group">
                <select
                    value={value}
                    onChange={onChange}
                    disabled={isDisabled}
                    className={`
                        w-full appearance-none 
                        rounded-xl border bg-[var(--surface)]
                        px-4 py-3 pr-10
                        text-sm font-semibold app-text
                        outline-none transition-all duration-300
                        cursor-pointer shadow-sm
                        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--border)]
                        ${isSelected 
                            ? `border-${colorBase}-500/40 bg-${colorBase}-500/5 ring-4 ring-${colorBase}-500/10` 
                            : 'app-border hover:border-[var(--foreground-muted)] focus:border-cyan-500/50 focus:bg-[var(--surface-strong)] focus:ring-4 focus:ring-cyan-500/10'
                        }
                    `}
                >
                    {isDisabled ? (
                        <option value="">No Data Available</option>
                    ) : (
                        <option value="">All {label}s</option>
                    )}

                    {options.map((option, index) => (
                        <option key={index} value={option} className="font-medium">
                            {option}
                        </option>
                    ))}
                </select>
                
                {/* Custom premium dropdown arrow */}
                <ChevronDown 
                    size={16} 
                    className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 ${
                        isSelected 
                            ? accentColor 
                            : 'text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]'
                    }`} 
                />
            </div>
        </div>
    );
};

export default FilterSelect;