import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    BarChart3,
    ShoppingCart,
    Target,
    FolderKanban,
    Users,
    WalletCards,
    FileText,
    Sparkles,
    Globe2,
    Settings,
    LifeBuoy,
    ChevronDown,
    X,
    Layers3,
    Cpu,
} from 'lucide-react';

// ==========================================
// ENTERPRISE SIDEBAR DATA STRUCTURE
// ==========================================
const SIDEBAR_CATEGORIES = [
    {
        title: 'DASHBOARDS',
        items: [
            {
                id: 'analytics',
                title: 'Analytics',
                icon: BarChart3,
                active: true,
                badge: 'New',
                subItems: [
                    { name: 'Overview', href: '/analytics/overview' },
                    { name: 'Real-time', href: '/analytics/real-time' },
                    { name: 'Demographics', href: '/analytics/demographics' },
                    { name: 'Web Traffic', href: '/analytics/traffic' },
                ]
            },
            {
                id: 'ecommerce',
                title: 'eCommerce',
                icon: ShoppingCart,
                subItems: [
                    { name: 'Sales Dashboard', href: '/ecommerce/sales' },
                    { name: 'Product Catalog', href: '/ecommerce/products' },
                    { name: 'Customer Base', href: '/ecommerce/customers' },
                    { name: 'Order Management', href: '/ecommerce/orders' },
                ]
            },
            {
                id: 'crm',
                title: 'CRM',
                icon: Target,
                subItems: [
                    { name: 'Lead Pipeline', href: '/crm/leads' },
                    { name: 'Contact Directory', href: '/crm/contacts' },
                    { name: 'Deal Tracking', href: '/crm/deals' },
                    { name: 'Task Manager', href: '/crm/tasks' },
                ]
            },
        ],
    },
    {
        title: 'APPS & WORKFLOW',
        items: [
            {
                id: 'projects',
                title: 'Projects',
                icon: FolderKanban,
                subItems: [
                    { name: 'Kanban Board', href: '/projects/kanban' },
                    { name: 'Project List', href: '/projects/list' },
                    { name: 'Timeline View', href: '/projects/timeline' },
                    { name: 'Gantt Chart', href: '/projects/gantt' },
                ]
            },
            {
                id: 'users',
                title: 'Users & Roles',
                icon: Users,
                subItems: [
                    { name: 'Directory', href: '/users/directory' },
                    { name: 'Access Control', href: '/users/roles' },
                    { name: 'User Profiles', href: '/users/profiles' },
                    { name: 'Activity Logs', href: '/users/activity' },
                ]
            },
            {
                id: 'finance',
                title: 'Finance',
                icon: WalletCards,
                badge: '3',
                subItems: [
                    { name: 'Billing Overview', href: '/finance/billing' },
                    { name: 'Invoices', href: '/finance/invoices' },
                    { name: 'Expenses', href: '/finance/expenses' },
                    { name: 'Subscriptions', href: '/finance/subscriptions' },
                ]
            },
        ],
    },
    {
        title: 'DATA & INTELLIGENCE',
        items: [
            {
                id: 'reports',
                title: 'Reports',
                icon: FileText,
                subItems: [
                    { name: 'Financial Reports', href: '/reports/financial' },
                    { name: 'Marketing ROI', href: '/reports/marketing' },
                    { name: 'Operations', href: '/reports/operations' },
                    { name: 'Custom Builder', href: '/reports/builder' },
                ]
            },
            {
                id: 'machine-learning',
                title: 'Predictive AI',
                icon: Sparkles,
                badge: 'Beta',
                subItems: [
                    { name: 'Forecast Models', href: '/ai/forecast' },
                    { name: 'Anomaly Detection', href: '/ai/anomalies' },
                    { name: 'Dataset Manager', href: '/ai/datasets' },
                    { name: 'Model Training', href: '/ai/training' },
                ]
            },
            {
                id: 'geographic',
                title: 'Region Insights',
                icon: Globe2,
                subItems: [
                    { name: 'Global Map', href: '/regions/map' },
                    { name: 'City Heatmaps', href: '/regions/heatmaps' },
                    { name: 'Routing Analytics', href: '/regions/routing' },
                ]
            },
        ],
    },
    {
        title: 'SYSTEM ADMINISTRATION',
        items: [
            {
                id: 'infrastructure',
                title: 'Infrastructure',
                icon: Cpu,
                subItems: [
                    { name: 'Server Health', href: '/system/servers' },
                    { name: 'Database Clusters', href: '/system/database' },
                    { name: 'API Usage', href: '/system/api' },
                ]
            },
            {
                id: 'settings',
                title: 'Settings',
                icon: Settings,
                subItems: [
                    { name: 'General Preferences', href: '/settings/general' },
                    { name: 'Security & Auth', href: '/settings/security' },
                    { name: 'Notifications', href: '/settings/notifications' },
                    { name: 'Integrations', href: '/settings/integrations' },
                ]
            },
            {
                id: 'support',
                title: 'Support',
                icon: LifeBuoy,
                subItems: [
                    { name: 'Help Center', href: '/support/help' },
                    { name: 'Submit Ticket', href: '/support/tickets' },
                    { name: 'Documentation', href: '/support/docs' },
                    { name: 'System Status', href: '/support/status' },
                ]
            },
        ],
    },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation(); // Used to highlight active links
    
    // Tracks which main menu item dropdown is currently open
    const [expandedMenu, setExpandedMenu] = useState('analytics');

    const toggleMenu = (menuId) => {
        setExpandedMenu(prev => prev === menuId ? null : menuId);
    };

    return (
        <>
            {/* =====================================
                OVERLAY (Mobile / Hidden state)
            ===================================== */}
            <div
                className={`
                    fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm
                    transition-all duration-300 lg:hidden
                    ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
                `}
                onClick={() => setSidebarOpen(false)}
            />

            {/* =====================================
                MAIN SIDEBAR CONTAINER
            ===================================== */}
            <aside
                className={`
                    fixed top-0 left-0 z-50
                    h-screen w-[320px]
                    overflow-hidden flex flex-col
                    border-r app-border
                    bg-[var(--surface-strong)]
                    shadow-2xl
                    transition-transform duration-500 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Glow Effects */}
                <div className="absolute top-[-120px] right-[-80px] h-[260px] w-[260px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-120px] left-[-80px] h-[260px] w-[260px] rounded-full bg-violet-500/10 dark:bg-violet-500/20 blur-3xl pointer-events-none" />

                {/* =====================================
                    HEADER (Logo & Close Button)
                ===================================== */}
                <div className="relative z-10 flex items-center justify-between border-b app-border px-6 py-5 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 shadow-lg shadow-cyan-500/20 text-white">
                            <Layers3 size={22} />
                        </div>
                        <div>
                            <h2 className="text-[17px] font-bold app-text">InsightBoard</h2>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-500">Enterprise</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-xl border app-border bg-[var(--background)] p-2 text-[var(--foreground-muted)] transition-all duration-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-500"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* =====================================
                    NAVIGATION BODY
                ===================================== */}
                <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
                    {SIDEBAR_CATEGORIES.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-8">
                            
                            {/* Section Title */}
                            <div className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                                {section.title}
                            </div>

                            {/* Menu Items */}
                            <div className="space-y-1.5">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const isExpanded = expandedMenu === item.id;
                                    
                                    // Check if any sub-item is the current active route
                                    const hasActiveChild = item.subItems.some(sub => location.pathname === sub.href);
                                    
                                    // The main button acts as a dropdown toggle or a link depending on your preference.
                                    // Here, it acts as an accordion toggle.
                                    return (
                                        <div key={item.id} className="flex flex-col">
                                            
                                            {/* PARENT TOGGLE BUTTON */}
                                            <button
                                                onClick={() => toggleMenu(item.id)}
                                                className={`
                                                    group relative w-full flex items-center justify-between
                                                    rounded-2xl border px-3 py-3
                                                    transition-all duration-300
                                                    ${isExpanded || hasActiveChild
                                                        ? 'border-cyan-500/20 bg-cyan-500/5 shadow-sm'
                                                        : 'border-transparent bg-transparent hover:bg-[var(--surface)] hover:border-border'
                                                    }
                                                `}
                                            >
                                                {/* Left Side: Icon & Title */}
                                                <div className="flex items-center gap-3">
                                                    <div className={`
                                                        flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300
                                                        ${isExpanded || hasActiveChild
                                                            ? 'bg-gradient-to-br from-cyan-500 to-violet-500 text-white shadow-md'
                                                            : 'bg-[var(--background)] border app-border text-[var(--foreground-muted)] group-hover:text-cyan-500'
                                                        }
                                                    `}>
                                                        <Icon size={18} />
                                                    </div>
                                                    <span className={`
                                                        text-[14px] font-semibold transition-colors duration-300
                                                        ${isExpanded || hasActiveChild ? 'app-text' : 'text-[var(--foreground-muted)] group-hover:app-text'}
                                                    `}>
                                                        {item.title}
                                                    </span>
                                                </div>

                                                {/* Right Side: Badge & Chevron */}
                                                <div className="flex items-center gap-2.5">
                                                    {item.badge && (
                                                        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                    <ChevronDown 
                                                        size={16} 
                                                        className={`
                                                            text-[var(--foreground-muted)] transition-transform duration-300
                                                            ${isExpanded ? 'rotate-180 text-cyan-500' : 'group-hover:text-cyan-500'}
                                                        `} 
                                                    />
                                                </div>
                                            </button>

                                            {/* =====================================
                                                SUB-MENU (Animated Accordion Dropdown)
                                            ===================================== */}
                                            <div 
                                                className={`
                                                    grid transition-all duration-300 ease-in-out
                                                    ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}
                                                `}
                                            >
                                                <div className="overflow-hidden">
                                                    <div className="flex flex-col gap-1 ml-7 pl-4 border-l-2 app-border py-1">
                                                        {item.subItems.map((sub, subIdx) => {
                                                            const isSubActive = location.pathname === sub.href;
                                                            
                                                            return (
                                                                <Link
                                                                    key={subIdx}
                                                                    to={sub.href}
                                                                    className={`
                                                                        relative flex items-center px-3 py-2 
                                                                        text-[13px] font-medium rounded-xl
                                                                        transition-all duration-200
                                                                        ${isSubActive 
                                                                            ? 'bg-[var(--surface)] text-cyan-500 font-bold' 
                                                                            : 'text-[var(--foreground-muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]'
                                                                        }
                                                                    `}
                                                                >
                                                                    {/* Active Indicator Dot */}
                                                                    {isSubActive && (
                                                                        <span className="absolute -left-[21px] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                                                    )}
                                                                    {sub.name}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* =====================================
                    FOOTER
                ===================================== */}
                <div className="relative z-10 shrink-0 border-t app-border bg-[var(--surface-strong)]/80 px-5 py-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold app-text">InsightBoard Pro</p>
                            <p className="text-[11px] font-medium app-text-muted">Version 3.0.0</p>
                        </div>
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            LIVE
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;