const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    colorClass = "text-cyan-500", 
    bgClass = "bg-cyan-500/10",
    borderHover = "hover:border-cyan-500/30"
}) => {
    return (
        <div 
            className={`
                relative overflow-hidden rounded-3xl border app-border 
                bg-[var(--surface-strong)]/40 p-6 shadow-sm backdrop-blur-xl
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:bg-[var(--surface-strong)]/60 hover:shadow-lg
                ${borderHover}
            `}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                        {title}
                    </p>
                    <h3 className="text-3xl font-bold app-text">
                        {value}
                    </h3>
                </div>

                {Icon && (
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${bgClass} ${colorClass}`}>
                        <Icon size={24} />
                    </div>
                )}
            </div>
            
            {/* Subtle bottom glow effect */}
            <div className={`absolute -bottom-2 -right-2 h-16 w-16 rounded-full blur-2xl ${bgClass} opacity-50`} />
        </div>
    );
};

export default StatCard;