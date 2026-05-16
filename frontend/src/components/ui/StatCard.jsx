// =====================================
// DYNAMIC THEMATIC STYLE ENGINE
// =====================================
const getColorStyles = (color) => {
    const styles = {
        blue: {
            text: 'text-blue-500',
            bgBox: 'bg-blue-500/10',
            glow: 'bg-blue-500',
            wash: 'from-blue-500/[0.05]',
            border: 'hover:border-blue-500/40 focus:border-blue-500/40'
        },
        cyan: {
            text: 'text-cyan-500',
            bgBox: 'bg-cyan-500/10',
            glow: 'bg-cyan-500',
            wash: 'from-cyan-500/[0.05]',
            border: 'hover:border-cyan-500/40 focus:border-cyan-500/40'
        },
        violet: {
            text: 'text-violet-500',
            bgBox: 'bg-violet-500/10',
            glow: 'bg-violet-500',
            wash: 'from-violet-500/[0.05]',
            border: 'hover:border-violet-500/40 focus:border-violet-500/40'
        },
        emerald: {
            text: 'text-emerald-500',
            bgBox: 'bg-emerald-500/10',
            glow: 'bg-emerald-500',
            wash: 'from-emerald-500/[0.05]',
            border: 'hover:border-emerald-500/40 focus:border-emerald-500/40'
        },
        amber: {
            text: 'text-amber-500',
            bgBox: 'bg-amber-500/10',
            glow: 'bg-amber-500',
            wash: 'from-amber-500/[0.05]',
            border: 'hover:border-amber-500/40 focus:border-amber-500/40'
        }
    };
    return styles[color] || styles.cyan; // Fallback to cyan
};

const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    themeColor = "cyan" 
}) => {
    const styles = getColorStyles(themeColor);

    return (
        <div 
            className={`
                group relative overflow-hidden rounded-3xl border app-border 
                bg-[var(--surface-strong)]/40 p-6 shadow-sm backdrop-blur-xl
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:bg-[var(--surface-strong)]/60 hover:shadow-lg
                ${styles.border}
            `}
        >
            {/* VIBRANT BACKGROUND LAYER COATED COATING (Appears on Hover) */}
            <div className={`absolute inset-0 pointer-events-none mix-blend-normal bg-gradient-to-br ${styles.wash} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

            {/* CARD CONTENT */}
            <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] transition-colors duration-300 group-hover:text-[var(--foreground)]">
                        {title}
                    </p>
                    <h3 className="text-3xl font-bold app-text">
                        {value}
                    </h3>
                </div>

                {Icon && (
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${styles.bgBox} ${styles.text} transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md`}>
                        <Icon size={24} />
                    </div>
                )}
            </div>
            
            {/* DYNAMIC AMBIENT BOTTOM GLOW EFFECT */}
            <div className={`absolute -bottom-6 -right-6 h-28 w-28 rounded-full blur-3xl ${styles.glow} opacity-10 transition-all duration-500 group-hover:opacity-20 group-hover:scale-125`} />
        </div>
    );
};

export default StatCard;