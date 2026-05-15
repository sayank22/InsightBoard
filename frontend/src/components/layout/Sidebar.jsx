import {
    LayoutDashboard,
    BarChart3,
    FileText,
    Settings,
    ShieldCheck,
    TrendingUp,
    PieChart,
    Activity,
    Globe2,
    Bell,
    Users,
    Database,
    ChevronRight,
    X,
    Sparkles,
    WalletCards,
    FolderKanban,
    Layers3,
    Cpu,
} from 'lucide-react';

const menuSections = [
    {
        title: 'MAIN',
        items: [
            {
                title: 'Dashboard',
                icon: LayoutDashboard,
                active: true,
                badge: null,
            },
            {
                title: 'Analytics',
                icon: BarChart3,
                badge: 'New',
            },
            {
                title: 'Reports',
                icon: FileText,
            },
            {
                title: 'Activity',
                icon: Activity,
            },
        ],
    },
    {
        title: 'INSIGHTS',
        items: [
            {
                title: 'Trend Analysis',
                icon: TrendingUp,
            },
            {
                title: 'Topic Distribution',
                icon: PieChart,
            },
            {
                title: 'Region Insights',
                icon: Globe2,
            },
            {
                title: 'Predictive AI',
                icon: Sparkles,
                badge: 'AI',
            },
        ],
    },
    {
        title: 'MANAGEMENT',
        items: [
            {
                title: 'Users',
                icon: Users,
            },
            {
                title: 'Projects',
                icon: FolderKanban,
            },
            {
                title: 'Data Sources',
                icon: Database,
            },
            {
                title: 'Infrastructure',
                icon: Cpu,
            },
        ],
    },
    {
        title: 'SYSTEM',
        items: [
            {
                title: 'Notifications',
                icon: Bell,
                badge: '8',
            },
            {
                title: 'Billing',
                icon: WalletCards,
            },
            {
                title: 'Security',
                icon: ShieldCheck,
            },
            {
                title: 'Settings',
                icon: Settings,
            },
        ],
    },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    return (
        <>
            {/* Overlay */}
            <div
                className={`
                    fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm
                    transition-all duration-300
                    ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
                `}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50
                    h-screen w-[320px]
                    overflow-hidden
                    border-r app-border
                    bg-[var(--surface-strong)]
                    shadow-2xl
                    transition-transform duration-500 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Glow Effects (Subtle light mode adjustments) */}
                <div
                    className="
                        absolute top-[-120px] right-[-80px]
                        h-[260px] w-[260px]
                        rounded-full
                        bg-cyan-500/10 dark:bg-cyan-500/20
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute bottom-[-120px] left-[-80px]
                        h-[260px] w-[260px]
                        rounded-full
                        bg-violet-500/10 dark:bg-violet-500/20
                        blur-3xl
                    "
                />

                {/* Header */}
                <div
                    className="
                        relative z-10
                        flex items-center justify-between
                        border-b app-border
                        px-6 py-5
                    "
                >
                    <div className="flex items-center gap-4">
                        {/* Logo */}
                        <div
                            className="
                                flex h-12 w-12 items-center justify-center
                                rounded-2xl
                                bg-gradient-to-br
                                from-cyan-500
                                to-violet-500
                                shadow-lg shadow-cyan-500/20
                                text-white
                            "
                        >
                            <Layers3 size={24} />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold app-text">
                                InsightBoard
                            </h2>
                            <p className="text-xs app-text-muted">
                                Enterprise Analytics
                            </p>
                        </div>
                    </div>

                    {/* Close */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="
                            rounded-xl
                            border app-border
                            bg-[var(--background)]
                            p-2
                            text-[var(--foreground-muted)]
                            transition-all duration-300
                            hover:border-cyan-500/40
                            hover:bg-cyan-500/10
                            hover:text-cyan-500
                        "
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation */}
                <div
                    className="
                        relative z-10
                        mt-6 h-[calc(100vh-220px)]
                        overflow-y-auto
                        px-4 pb-10
                        custom-scrollbar
                    "
                >
                    {menuSections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-7">
                            {/* Section Title */}
                            <div
                                className="
                                    mb-3 px-3
                                    text-xs font-semibold
                                    uppercase tracking-[0.2em]
                                    text-[var(--foreground-muted)]
                                "
                            >
                                {section.title}
                            </div>

                            {/* Menu Items */}
                            <div className="space-y-2">
                                {section.items.map((item, index) => {
                                    const Icon = item.icon;

                                    return (
                                        <button
                                            key={index}
                                            className={`
                                                group relative w-full
                                                overflow-hidden
                                                rounded-2xl
                                                border
                                                px-4 py-3.5
                                                transition-all duration-300
                                                ${item.active
                                                    ? `
                                                        border-cyan-500/30
                                                        bg-cyan-500/10
                                                        shadow-lg shadow-cyan-500/10
                                                    `
                                                    : `
                                                        border-transparent
                                                        bg-transparent
                                                        hover:border-[var(--border)]
                                                        hover:bg-[var(--hover)]
                                                    `
                                                }
                                            `}
                                        >
                                            {/* Hover Glow */}
                                            <div
                                                className="
                                                    absolute inset-0
                                                    opacity-0
                                                    transition-opacity duration-300
                                                    group-hover:opacity-100
                                                    bg-gradient-to-r
                                                    from-cyan-500/5
                                                    to-violet-500/5
                                                "
                                            />

                                            <div className="relative flex items-center justify-between">
                                                {/* Left */}
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={`
                                                            flex h-11 w-11 items-center justify-center
                                                            rounded-xl
                                                            transition-all duration-300
                                                            ${item.active
                                                                ? `
                                                                    bg-gradient-to-br
                                                                    from-cyan-500
                                                                    to-violet-500
                                                                    text-white
                                                                `
                                                                : `
                                                                    bg-[var(--background)]
                                                                    text-[var(--foreground-muted)]
                                                                    group-hover:text-cyan-500
                                                                `
                                                            }
                                                        `}
                                                    >
                                                        <Icon size={20} />
                                                    </div>

                                                    <div className="text-left">
                                                        <p
                                                            className={`
                                                                text-sm font-semibold
                                                                transition-colors duration-300
                                                                ${item.active ? 'app-text' : 'text-[var(--foreground-muted)] group-hover:app-text'}
                                                            `}
                                                        >
                                                            {item.title}
                                                        </p>

                                                        <p className="text-xs text-[var(--foreground-muted)]">
                                                            Open section
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Right */}
                                                <div className="flex items-center gap-3">
                                                    {/* Badge */}
                                                    {item.badge && (
                                                        <div
                                                            className="
                                                                rounded-full
                                                                border border-cyan-500/20
                                                                bg-cyan-500/10
                                                                px-2 py-1
                                                                text-[10px]
                                                                font-bold
                                                                uppercase
                                                                tracking-wide
                                                                text-cyan-600 dark:text-cyan-400
                                                            "
                                                        >
                                                            {item.badge}
                                                        </div>
                                                    )}

                                                    <ChevronRight
                                                        size={18}
                                                        className="
                                                            text-[var(--foreground-muted)]
                                                            transition-all duration-300
                                                            group-hover:translate-x-1
                                                            group-hover:text-cyan-500
                                                        "
                                                    />
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div
                    className="
                        absolute bottom-0 left-0 right-0
                        border-t app-border
                        bg-[var(--surface-strong)]/80
                        px-5 py-4
                        backdrop-blur-xl
                    "
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium app-text">
                                InsightBoard Pro
                            </p>
                            <p className="text-xs app-text-muted">
                                Version 2.5.0
                            </p>
                        </div>

                        <div
                            className="
                                rounded-xl
                                border border-emerald-500/20
                                bg-emerald-500/10
                                px-3 py-1.5
                                text-xs font-semibold
                                text-emerald-600 dark:text-emerald-400
                            "
                        >
                            LIVE
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;