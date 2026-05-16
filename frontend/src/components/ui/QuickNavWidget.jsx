import { 
    Compass, 
    BarChart3, 
    TrendingUp, 
    Activity, 
    PieChart, 
    Globe, 
    MapPin, 
    Layers,
    Filter,
    Table,
    ChevronRight
} from 'lucide-react';

// Explicitly defining Tailwind hover classes ensures the JIT compiler bundles them!
const chartLinks = [
    { name: 'Data Filters', target: 'filter-section', icon: Filter, baseColor: 'text-rose-500', hoverBorder: 'hover:border-rose-500/40', hoverBg: 'group-hover:bg-rose-500/10' },
    { name: 'Bubble Map Matrix', target: 'bubble-chart', icon: Compass, baseColor: 'text-sky-500', hoverBorder: 'hover:border-sky-500/40', hoverBg: 'group-hover:bg-sky-500/10' },
    { name: 'Timeline Trends', target: 'year-trend', icon: TrendingUp, baseColor: 'text-violet-500', hoverBorder: 'hover:border-violet-500/40', hoverBg: 'group-hover:bg-violet-500/10' },
    { name: 'Regional Volume', target: 'region-analytics', icon: Globe, baseColor: 'text-emerald-500', hoverBorder: 'hover:border-emerald-500/40', hoverBg: 'group-hover:bg-emerald-500/10' },
    { name: 'Sector Intensity', target: 'sector-intensity', icon: Activity, baseColor: 'text-cyan-500', hoverBorder: 'hover:border-cyan-500/40', hoverBg: 'group-hover:bg-cyan-500/10' },
    { name: 'Topic Segments', target: 'topic-donut', icon: PieChart, baseColor: 'text-pink-500', hoverBorder: 'hover:border-pink-500/40', hoverBg: 'group-hover:bg-pink-500/10' },
    { name: 'Country Distribution', target: 'country-map', icon: BarChart3, baseColor: 'text-blue-500', hoverBorder: 'hover:border-blue-500/40', hoverBg: 'group-hover:bg-blue-500/10' },
    { name: 'Urban Analytics', target: 'city-analytics', icon: MapPin, baseColor: 'text-amber-500', hoverBorder: 'hover:border-amber-500/40', hoverBg: 'group-hover:bg-amber-500/10' },
    { name: 'PESTLE Metrics', target: 'pestle-analysis', icon: Layers, baseColor: 'text-fuchsia-500', hoverBorder: 'hover:border-fuchsia-500/40', hoverBg: 'group-hover:bg-fuchsia-500/10' },
    { name: 'Insights Table', target: 'insights-table', icon: Table, baseColor: 'text-green-500', hoverBorder: 'hover:border-green-500/40', hoverBg: 'group-hover:bg-green-500/10' },
];

const QuickNavWidget = () => {
    
    const handleScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Temporary high-end UX splash highlight animation
            element.classList.add('ring-4', 'ring-cyan-500/30', 'transition-all', 'duration-300');
            setTimeout(() => {
                element.classList.remove('ring-4', 'ring-cyan-500/30');
            }, 1200);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-[var(--surface)] p-5 shadow-xl transition-all duration-300 hover:shadow-2xl flex flex-col h-full justify-between">
            
            {/* Subtle Top-Right Glow to give the container depth */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

            <div className="relative z-10">
                <h3 className="text-base font-bold app-text flex items-center gap-2">
                    <Compass size={16} className="text-cyan-500" />
                    Dashboard Navigator
                </h3>
                <p className="text-[11px] app-text-muted mt-1 max-w-[250px]">
                    Jump directly to specific visualization metrics and filter controls.
                </p>
            </div>

            {/* Quick Navigation Interactive Grid */}
            <div className="grid grid-cols-2 gap-2 mt-4 relative z-10 flex-1 content-start overflow-y-auto pr-1 custom-scrollbar">
                {chartLinks.map((link, idx) => {
                    const Icon = link.icon;
                    return (
                        <button
                            key={idx}
                            onClick={() => handleScroll(link.target)}
                            className={`group relative flex items-center justify-between rounded-xl border border-transparent bg-[var(--surface-strong)]/40 p-2 text-left transition-all duration-300 ${link.hoverBorder} hover:bg-[var(--surface-strong)]/80 hover:translate-x-0.5`}
                        >
                            <div className="flex items-center gap-2.5 z-10">
                                {/* Dynamic Icon Box */}
                                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] border app-border transition-colors duration-300 ${link.hoverBg} ${link.baseColor}`}>
                                    <Icon size={14} className="transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <span className="text-xs font-semibold app-text-muted group-hover:app-text tracking-tight leading-tight truncate max-w-[100px] transition-colors duration-300">
                                    {link.name}
                                </span>
                            </div>

                            {/* Micro-interaction arrow that slides in on hover */}
                            <ChevronRight 
                                size={14} 
                                className={`absolute right-2 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ${link.baseColor}`} 
                            />
                        </button>
                    );
                })}
            </div>

            {/* Scrollbar styling injected locally just for this widget if it gets too tall */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border);
                    border-radius: 4px;
                }
            `}</style>

        </div>
    );
};

export default QuickNavWidget;