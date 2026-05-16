import {
    Layers3,
    Bell,
    Check,
    CheckCheck,
    ChevronDown,
    Command,
    LayoutGrid,
    LogOut,
    Menu,
    Monitor,
    Moon,
    Search,
    Settings,
    Sparkles,
    Sun,
    User,
    BarChart2,
    ShoppingCart,
    Truck,
    Calendar,
    Shield,
    Type,
    AlignLeft,
    AlertCircle,
    CreditCard,
    CircleDot,
    Layout,
    Table,
    Edit,
    FileText,
    PieChart,
    Users
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../context/useTheme';

const THEMES = [
    { label: 'Light', value: 'light', icon: Sun },
    { label: 'Dark', value: 'dark', icon: Moon },
    { label: 'System', value: 'system', icon: Monitor },
];

// DUMMY SHORTCUTS
const SHORTCUTS = [
    { name: 'Calendar', icon: Calendar, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { name: 'Invoice App', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Users', icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { name: 'Role Mgmt', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Dashboard', icon: PieChart, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { name: 'Settings', icon: Settings, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

// DUMMY NOTIFICATIONS
const NOTIFICATIONS = [
    { id: 1, name: 'Congratulation Flora! 🎉', msg: 'Won the monthly best seller badge', time: '1h ago', dp: 'F', color: 'bg-emerald-500', isNew: true },
    { id: 2, name: 'New message received', msg: 'You have 10 unread messages', time: '12h ago', dp: 'M', color: 'bg-blue-500', isNew: true },
    { id: 3, name: 'PayPal Transaction', msg: 'Payment received successfully', time: '1 day ago', dp: 'P', color: 'bg-sky-500', isNew: false },
    { id: 4, name: 'Order Placed 📦', msg: 'Your order has been placed successfully', time: '2 days ago', dp: 'O', color: 'bg-amber-500', isNew: false },
    { id: 5, name: 'System Alert', msg: 'Server CPU utilization is currently at 90%', time: '3 days ago', dp: 'S', color: 'bg-rose-500', isNew: false },
];

const Navbar = ({ setSidebarOpen, dashboardData = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { theme, resolvedTheme, setTheme } = useTheme();
    const navRef = useRef();

    // =====================================
    // SEARCH & TOGGLE LOGIC
    // =====================================
    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];
        return dashboardData
            .filter((item) => item.topic?.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 5);
    }, [searchTerm, dashboardData]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const toggleDropdown = (name) => {
        setActiveDropdown(prev => (prev === name ? null : name));
    };

    // =====================================
    // STYLES
    // =====================================
    const ThemeIcon = resolvedTheme === 'dark' ? Moon : Sun;
    
    const iconBtnClass = "relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface text-foreground-muted transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-500";
    const dropdownClass = "absolute top-[120%] overflow-hidden rounded-3xl border border-border bg-[var(--surface-strong)] shadow-2xl backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200 z-50";

    return (
        <header ref={navRef} className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-2xl">
            {/* Subtle Glow */}
            <div className="absolute inset-0 bg-linear-to-r from-cyan-500/3 via-transparent to-violet-500/3" />

            <div className="relative flex h-21 items-center justify-between px-4 md:px-7">
                
                {/* LEFT SECTION */}
                <div className="flex items-center gap-4">
                    {/* HAMBURGER MENU */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-white/4 text-foreground-muted backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-500"
                    >
                        <Menu size={22} className="transition-transform duration-300 group-hover:scale-110" />
                    </button>

                    <div className="hidden sm:flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/20 text-white">
                            <Layers3 size={24} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">InsightBoard</h1>
                    </div>
                </div>

                {/* SEARCH SECTION (MEGA MENU) */}
                <div className="relative mx-6 hidden w-full max-w-[700px] lg:flex">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                    <input
                        type="text"
                        placeholder="Search analytics, reports, insights..."
                        value={searchTerm}
                        onFocus={() => setActiveDropdown('search')}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-14 w-full rounded-2xl border border-border bg-[var(--surface-strong)]/40 pl-14 pr-20 text-base text-foreground outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-foreground-muted focus:border-cyan-400/50 focus:bg-[var(--surface)] focus:shadow-xl focus:shadow-cyan-500/10"
                    />
                    <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-lg border border-border bg-[var(--surface-strong)] px-2.5 py-1 text-xs font-bold text-foreground-muted shadow-sm">
                        <Command size={12} /> K
                    </div>

                    {/* SEARCH MEGA DROPDOWN */}
                    {activeDropdown === 'search' && (
                        <div className={`${dropdownClass} left-0 w-full p-8`}>
                            {!searchTerm.trim() ? (
                                <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                                    {/* COLUMN 1 */}
                                    <div>
                                        <h4 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-foreground-muted">Popular Searches</h4>
                                        <div className="flex flex-col gap-3">
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><BarChart2 size={16} className="text-foreground-muted" /> Analytics</button>
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><Users size={16} className="text-foreground-muted" /> CRM</button>
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><ShoppingCart size={16} className="text-foreground-muted" /> eCommerce</button>
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><Truck size={16} className="text-foreground-muted" /> Logistics</button>
                                        </div>
                                    </div>
                                    {/* COLUMN 2 */}
                                    <div>
                                        <h4 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-foreground-muted">Apps & Pages</h4>
                                        <div className="flex flex-col gap-3">
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><Calendar size={16} className="text-foreground-muted" /> Calendar</button>
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><Shield size={16} className="text-foreground-muted" /> Roles & Permissions</button>
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><Settings size={16} className="text-foreground-muted" /> Account Settings</button>
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><Layout size={16} className="text-foreground-muted" /> Dialog Examples</button>
                                        </div>
                                    </div>
                                    {/* COLUMN 3 */}
                                    <div>
                                        <h4 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-foreground-muted">User Interface</h4>
                                        <div className="flex flex-col gap-3">
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><Type size={16} className="text-foreground-muted" /> Typography</button>
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><AlignLeft size={16} className="text-foreground-muted" /> Accordion</button>
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><AlertCircle size={16} className="text-foreground-muted" /> Alert</button>
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><CreditCard size={16} className="text-foreground-muted" /> Cards</button>
                                        </div>
                                    </div>
                                    {/* COLUMN 4 */}
                                    <div>
                                        <h4 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-foreground-muted">Forms & Tables</h4>
                                        <div className="flex flex-col gap-3">
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><CircleDot size={16} className="text-foreground-muted" /> Radio</button>
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><Layout size={16} className="text-foreground-muted" /> Form Layouts</button>
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><Table size={16} className="text-foreground-muted" /> Table</button>
                                            <button className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-cyan-500"><Edit size={16} className="text-foreground-muted" /> Editor</button>
                                        </div>
                                    </div>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div>
                                    <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
                                        <Sparkles size={14} /> Live Search Results
                                    </div>
                                    <div className="space-y-2">
                                        {searchResults.map((item, idx) => (
                                            <button key={idx} className="w-full rounded-2xl border border-transparent bg-[var(--surface)] p-4 text-left transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-500/5 hover:shadow-md">
                                                <div className="text-base font-bold text-foreground">{item.topic}</div>
                                                <div className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground-muted">
                                                    <Globe size={14} /> {item.region || 'Global'}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-16 text-center">
                                    <Search size={40} className="mx-auto mb-4 text-foreground-muted opacity-30" />
                                    <p className="text-lg font-bold text-foreground">No results found</p>
                                    <p className="mt-1 text-sm text-foreground-muted">Try adjusting your search terms.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-3">
                    
                    {/* THEME */}
                    <div className="relative">
                        <button onClick={() => toggleDropdown('theme')} className={iconBtnClass}>
                            <ThemeIcon size={20} />
                        </button>
                        {activeDropdown === 'theme' && (
                            <div className={`${dropdownClass} right-0 w-48 p-2`}>
                                {THEMES.map(({ label, value, icon: Icon }) => (
                                    <button
                                        key={value}
                                        onClick={() => { setTheme(value); setActiveDropdown(null); }}
                                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${theme === value ? 'bg-cyan-500/10 text-cyan-500' : 'text-foreground-muted hover:bg-[var(--surface)] hover:text-foreground'}`}
                                    >
                                        <div className="flex items-center gap-3"><Icon size={16} /> {label}</div>
                                        {theme === value && <Check size={16} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* SHORTCUTS (Replaced Language) */}
                    <div className="relative">
                        <button onClick={() => toggleDropdown('shortcuts')} className={iconBtnClass}>
                            <LayoutGrid size={20} />
                        </button>
                        {activeDropdown === 'shortcuts' && (
                            <div className={`${dropdownClass} right-0 w-[380px]`}>
                                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                                    <h3 className="font-bold text-foreground text-base">Shortcuts</h3>
                                    <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface)] transition-colors" title="Add Shortcut">
                                        <div className="text-xl leading-none mb-1 text-foreground-muted hover:text-foreground">+</div>
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 p-4">
                                    {SHORTCUTS.map((shortcut, idx) => {
                                        const Icon = shortcut.icon;
                                        return (
                                            <button key={idx} className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-transparent bg-[var(--surface)] p-5 transition-all duration-300 hover:border-border hover:shadow-md hover:-translate-y-1">
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${shortcut.bg} ${shortcut.color} transition-transform duration-300 group-hover:scale-110`}>
                                                    <Icon size={24} />
                                                </div>
                                                <span className="text-sm font-semibold text-foreground">{shortcut.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* NOTIFICATIONS */}
                    <div className="relative">
                        <button onClick={() => toggleDropdown('notifications')} className={iconBtnClass}>
                            <Bell size={20} className="animate-wiggle" />
                            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-background bg-rose-500 animate-pulse" />
                        </button>
                        {activeDropdown === 'notifications' && (
                            <div className={`${dropdownClass} right-0 w-[420px]`}>
                                <div className="flex items-center justify-between border-b border-border px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-foreground">Notifications</h3>
                                        <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-bold text-cyan-500">2 New</span>
                                    </div>
                                    {/* Mark all as read icon with Tooltip */}
                                    <button className="group relative text-foreground-muted hover:text-cyan-500 transition-colors">
                                        <CheckCheck size={20} />
                                        <span className="absolute -bottom-8 right-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-[var(--foreground)] text-[var(--surface)] text-[10px] font-bold px-2 py-1 rounded-md pointer-events-none">
                                            Mark all as read
                                        </span>
                                    </button>
                                </div>

                                <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                                    {NOTIFICATIONS.map((notif) => (
                                        <button key={notif.id} className={`flex w-full gap-4 border-b border-border p-5 text-left transition-all duration-300 hover:bg-[var(--surface)] ${notif.isNew ? 'bg-cyan-500/[0.02]' : ''}`}>
                                            <div className="relative shrink-0">
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-md ${notif.color}`}>
                                                    {notif.dp}
                                                </div>
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className={`truncate text-sm font-bold ${notif.isNew ? 'text-foreground' : 'text-foreground/80'}`}>{notif.name}</h4>
                                                    <span className="shrink-0 text-[11px] font-medium text-foreground-muted">{notif.time}</span>
                                                </div>
                                                <p className="mt-1 truncate text-sm text-foreground-muted">{notif.msg}</p>
                                            </div>
                                            {notif.isNew && (
                                                <div className="flex shrink-0 items-center justify-center">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <div className="border-t border-border p-3">
                                    <button className="w-full rounded-xl py-3 text-center text-sm font-bold text-cyan-500 transition-colors hover:bg-cyan-500/10">
                                        View All Notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PROFILE */}
                    <div className="relative ml-2">
                        <button onClick={() => toggleDropdown('profile')} className="flex items-center gap-3 rounded-full border border-border bg-[var(--surface-strong)]/60 p-1.5 pr-4 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:bg-[var(--surface)] hover:shadow-md">
                            <div className="relative">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white shadow-sm">S</div>
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                            </div>
                            <ChevronDown size={16} className="hidden text-foreground-muted md:block" />
                        </button>
                        {activeDropdown === 'profile' && (
                            <div className={`${dropdownClass} right-0 w-72`}>
                                <div className="border-b border-border p-6 flex items-center gap-4 bg-[var(--surface)]/50">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-bold text-white shadow-lg">S</div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Sayan Kundu</h3>
                                        <p className="text-sm font-medium text-foreground-muted">Admin Account</p>
                                    </div>
                                </div>
                                <div className="p-3 border-b border-border space-y-1">
                                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground-muted transition-all hover:bg-[var(--surface)] hover:text-foreground hover:translate-x-1">
                                        <User size={18} /> My Profile
                                    </button>
                                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground-muted transition-all hover:bg-[var(--surface)] hover:text-foreground hover:translate-x-1">
                                        <Settings size={18} /> Account Settings
                                    </button>
                                </div>
                                <div className="p-3">
                                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-rose-500 transition-all hover:bg-rose-500/10 hover:translate-x-1">
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Navbar;