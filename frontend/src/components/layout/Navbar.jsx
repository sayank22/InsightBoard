import {
    Bell,
    Check,
    ChevronDown,
    Command,
    Globe,
    Layers3,
    LogOut,
    Menu,
    Monitor,
    Moon,
    Search,
    Settings,
    Sparkles,
    Sun,
    User,
    Mail,
    CircleHelp,
    BadgeDollarSign,
    CreditCard,
    LayoutGrid,
    FileText,
    Plus, 
    Calendar, 
    Users, 
    BarChart2, 
    Target, 
    ShoppingCart,
    Truck,
    Lock,
    Copy,
    Type,
    AlignLeft,
    AlertTriangle,
    Layout,
    CircleDot,
    TableProperties,
    Edit3,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../context/useTheme';
import { Link } from 'react-router-dom';

// DUMMY SEARCH MENU CATEGORIES
const SEARCH_CATEGORIES = [
    {
        title: 'POPULAR SEARCHES',
        items: [
            { name: 'Analytics', icon: BarChart2, href: '/analytics' },
            { name: 'CRM', icon: Target, href: '/crm' },
            { name: 'eCommerce', icon: ShoppingCart, href: '/ecommerce' },
            { name: 'Logistics', icon: Truck, href: '/logistics' },
        ]
    },
    {
        title: 'APPS & PAGES',
        items: [
            { name: 'Calendar', icon: Calendar, href: '/calendar' },
            { name: 'Roles & Permissions', icon: Lock, href: '/roles' },
            { name: 'Account Settings', icon: Settings, href: '/settings' },
            { name: 'Dialog Examples', icon: Copy, href: '/dialogs' },
        ]
    },
    {
        title: 'USER INTERFACE',
        items: [
            { name: 'Typography', icon: Type, href: '/typography' },
            { name: 'Accordion', icon: AlignLeft, href: '/accordion' },
            { name: 'Alert', icon: AlertTriangle, href: '/alert' },
            { name: 'Cards', icon: Layout, href: '/cards' },
        ]
    },
    {
        title: 'FORMS & TABLES',
        items: [
            { name: 'Radio', icon: CircleDot, href: '/radio' },
            { name: 'Form Layouts', icon: FileText, href: '/forms' },
            { name: 'Table', icon: TableProperties, href: '/table' },
            { name: 'Editor', icon: Edit3, href: '/editor' },
        ]
    }
];

const THEMES = [
    { label: 'Light', value: 'light', icon: Sun },
    { label: 'Dark', value: 'dark', icon: Moon },
    { label: 'System', value: 'system', icon: Monitor },
];

const LANGUAGES = ['English', 'Hindi', 'Bengali'];

// DUMMY SHORTCUTS
const SHORTCUTS = [
    { name: 'Calendar', subtitle: 'Appointments', icon: Calendar, bg: 'bg-[var(--surface)]', color: 'text-foreground', href: '/calendar' },
    { name: 'Invoice App', subtitle: 'Manage Accounts', icon: FileText, bg: 'bg-[var(--surface)]', color: 'text-foreground', href: '/invoices' },
    { name: 'Users', subtitle: 'Manage Users', icon: User, bg: 'bg-[var(--surface)]', color: 'text-foreground', href: '/users' },
    { name: 'Role Management', subtitle: 'Permission', icon: Users, bg: 'bg-[var(--surface)]', color: 'text-foreground', href: '/roles' },
    { name: 'Dashboard', subtitle: 'Dashboard Analytics', icon: Monitor, bg: 'bg-[var(--surface)]', color: 'text-foreground', href: '/dashboard' },
    { name: 'Settings', subtitle: 'Account Settings', icon: Settings, bg: 'bg-[var(--surface)]', color: 'text-foreground', href: '/settings' },
];

// DUMMY NOTIFICATIONS
const NOTIFICATIONS = [
    { id: 1, name: 'Congratulation Flora! 🎉', msg: 'Won the monthly best seller badge', time: 'Today', dp: 'F', color: 'bg-rose-400 text-white', isNew: true },
    { id: 2, name: 'New user registered.', msg: '5 hours ago', time: 'Yesterday', dp: 'TH', color: 'bg-gray-200 text-gray-700', isNew: true },
    { id: 3, name: 'New message received 👋', msg: 'You have 10 unread messages', time: '11 Aug', dp: 'M', color: 'bg-indigo-500 text-white', isNew: false },
    { id: 4, name: 'PayPal', msg: 'Received Payment', time: '25 May', dp: 'P', color: 'bg-red-100 text-red-500', isNew: false },
    { id: 5, name: 'System Alert', msg: 'Server CPU utilization is currently at 90%', time: '20 May', dp: 'S', color: 'bg-orange-100 text-orange-500', isNew: false },
];

const Navbar = ({ setSidebarOpen, dashboardData = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeLanguage, setActiveLanguage] = useState('English');
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
    
    const iconBtnClass = "relative flex h-11 w-11 items-center justify-center rounded-4xl  text-foreground-muted transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300";
    const dropdownClass = "absolute top-[120%] overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 z-50";

    return (
        <header ref={navRef} className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-2xl">
            {/* Subtle Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.03] via-transparent to-violet-500/[0.03]" />

            <div className="relative flex h-[78px] items-center justify-between px-4 md:px-7">
                
                {/* LEFT SECTION */}
                <div className="flex items-center gap-4">
    
    {/* HAMBURGER MENU (Now visible on desktop too!) */}
    <button
        onClick={() => setSidebarOpen(true)}
        className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-white/[0.04] text-foreground-muted backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
    >
        <Menu size={22} className="transition-transform duration-300 group-hover:scale-110" />
    </button>

    <div className="hidden sm:flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/20 text-white">
            <Layers3 size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">InsightBoard</h1>
    </div>
</div>

                {/* SEARCH SECTION */}
                <div className="relative mx-6 hidden w-full max-w-2xl lg:flex">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                    <input
                        type="text"
                        placeholder="Search analytics, reports, insights..."
                        value={searchTerm}
                        onFocus={() => setActiveDropdown('search')}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-14 w-full rounded-2xl border border-border bg-white/[0.04] pl-12 pr-20 text-sm text-foreground outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-foreground-muted focus:border-cyan-400/30 focus:bg-white/[0.06] focus:shadow-lg focus:shadow-cyan-500/10"
                    />
                    <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-lg border border-border bg-black/20 px-2 py-1 text-[10px] font-semibold text-foreground-muted">
                        <Command size={10} /> K
                    </div>
                    {/* SEARCH DROPDOWN */}
{activeDropdown === 'search' && (
    <div className={`${dropdownClass} left-0 w-full max-w-[560px]`}>
        {!searchTerm.trim() ? (
            
            /* --- DEFAULT STATE --- */
            /* 2. Reduced padding from p-6 to p-5 */
            <div className="p-5">
                {/* 3. Reduced gap between columns and rows */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    {SEARCH_CATEGORIES.map((category, catIdx) => (
                        <div key={catIdx} className="flex flex-col">
                            
                            {/* Category Title - Changed to text-gray-400 */}
                            <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                {category.title}
                            </h4>
                            
                            {/* Category Links */}
                            <div className="flex flex-col gap-0.5">
                                {category.items.map((item, itemIdx) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={itemIdx}
                                            to={item.href}
                                            onClick={() => setActiveDropdown(null)}
                                            /* 4. Reduced text size to 14px, icon to 16px, and made vertical padding tighter (py-2) */
                                            className="group flex items-center gap-2.5 rounded-lg px-2 py-2 text-[14px] font-medium text-foreground-muted transition-all hover:bg-[var(--surface)] hover:text-indigo-500"
                                        >
                                            <Icon size={16} className="transition-colors group-hover:text-indigo-500" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        ) : searchResults.length > 0 ? (
            
            /* --- ACTIVE SEARCH RESULTS STATE --- */
            <div className="p-5">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    <Sparkles size={12} /> Search Results
                </div>
                <div className="space-y-1.5">
                    {searchResults.map((item, idx) => (
                        <Link 
                            key={idx} 
                            to={`/search?q=${item.topic}`} 
                            onClick={() => setActiveDropdown(null)}
                            className="block w-full rounded-xl border border-transparent bg-surface-strong/40 p-3.5 text-left transition-all duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/5"
                        >
                            <div className="text-[14px] font-semibold text-foreground">{item.topic}</div>
                            <div className="mt-0.5 text-xs text-gray-400">{item.region || 'Global'}</div>
                        </Link>
                    ))}
                </div>
            </div>

        ) : (
            
            /* --- NO RESULTS STATE --- */
            <div className="py-8 text-center">
                <Search size={24} className="mx-auto mb-3 text-gray-400 opacity-50" />
                <p className="text-[14px] font-medium text-foreground">No results found</p>
            </div>
            
        )}
    </div>
)}
                    </div>

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-2">

                    {/* LANGUAGE */}
                    <div className="relative">
                        <button onClick={() => toggleDropdown('language')} className={iconBtnClass}>
                            <Globe size={18} />
                        </button>
                        {activeDropdown === 'language' && (
                            <div className={`${dropdownClass} right-0 w-52`}>
                                <div className="border-b border-border p-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                                    Select Language
                                </div>
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => { setActiveLanguage(lang); setActiveDropdown(null); }}
                                        className="flex w-full items-center justify-between px-5 py-4 text-sm text-foreground-muted transition-all hover:bg-white/[0.05] hover:text-foreground"
                                    >
                                        {lang} {activeLanguage === lang && <Check size={16} className="text-cyan-400" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* THEME */}
                    <div className="relative">
                        <button onClick={() => toggleDropdown('theme')} className={iconBtnClass}>
                            <ThemeIcon size={18} />
                        </button>
                        {activeDropdown === 'theme' && (
                            <div className={`${dropdownClass} right-0 w-52`}>
                                {THEMES.map(({ label, value, icon: Icon }) => (
                                    <button
                                        key={value}
                                        onClick={() => { setTheme(value); setActiveDropdown(null); }}
                                        className="flex w-full items-center justify-between px-5 py-4 text-sm text-foreground-muted transition-all hover:bg-white/[0.05] hover:text-foreground"
                                    >
                                        <div className="flex items-center gap-3"><Icon size={16} /> {label}</div>
                                        {theme === value && <Check size={16} className="text-cyan-400" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* SHORTCUTS */}
                    <div className="relative">
            {/* Shortcuts Trigger */}
            <button type="button" onClick={() => toggleDropdown('shortcuts')} className={iconBtnClass}>
        <LayoutGrid size={20} />
    </button>
            {/* Dropdown Panel */}
            {activeDropdown === 'shortcuts' && (
                <div className={`${dropdownClass} right-0 w-[350px] p-0 overflow-hidden`}>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-background">
                        <h3 className="text-base font-medium text-foreground">Shortcut</h3>
                        <div className="flex items-center gap-2 hover:bg-cyan-800 rounded-full p-1 transition-colors">
                        <button className="text-foreground-muted hover:text-foreground transition-colors p-1" title="Add Shortcut">
                            <Plus size={20} />
                        </button>
                        </div>
                    </div>
                    {/* Grid List */}
                    <div className="grid grid-cols-2 gap-[1px] bg-border">
                        {SHORTCUTS.map((shortcut, idx) => {
                            const Icon = shortcut.icon;
                            return (
                                <Link 
                            key={idx} 
                            to={shortcut.href} 
                            className="group flex flex-col items-center justify-center py-6 px-2 text-center bg-background hover:bg-[var(--surface)] transition-colors w-full h-full"
                        >
                                    {/* Icon Circle */}
                                    <div className={`flex h-[16px] w-[16px] items-center justify-center rounded-full ${shortcut.bg} ${shortcut.color} mb-4 transition-transform duration-300 group-hover:-translate-y-1`}>
                                        <Icon size={22} className="opacity-80" />
                                    </div>
                                    
                                    {/* Text */}
                                    <span className="text-[15px] font-medium text-foreground">{shortcut.name}</span>
                                    {shortcut.subtitle && (
                                        <span className="mt-1 text-[13px] text-foreground-muted">{shortcut.subtitle}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>


                    {/* NOTIFICATIONS */}
                    <div className="relative">
            {/* Bell Trigger */}
            <button onClick={() => toggleDropdown('notifications')} className="relative p-2 rounded-full hover:bg-[var(--surface)] transition-colors">
                <Bell size={22} className="text-foreground animate-wiggle" />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse border-2 border-background" />
            </button>

            {/* Dropdown Panel */}
            {activeDropdown === 'notifications' && (
                <div className="absolute right-0 mt-2 w-[380px] bg-background rounded-xl shadow-[0_5px_25px_-5px_rgba(0,0,0,0.1)] border border-border flex flex-col overflow-hidden z-50">
                    
                    {/* 1. FIXED HEADER */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0 bg-background">
                        <div className="flex items-center gap-3">
                            <h3 className="text-base font-bold text-foreground">Notifications</h3>
                        </div>
                        {/* Right Side: Badge & Mail Icon */}
    <div className="flex items-center gap-3">
        {/* Moved Badge */}
        <span className="rounded-md bg-cyan-500/10 px-2 py-1 text-[11px] font-bold text-cyan-500">
            2 New
        </span>

        {/* Mail Icon with Tooltip */}
        <button className="group relative text-foreground-muted hover:text-cyan-500 transition-colors p-1.5 rounded-full">
            <Mail size={18} />
            
            {/* Hover Tooltip */}
            <span className="absolute -bottom-8 right-0 z-50 w-max opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-[var(--foreground)] text-[var(--surface)] text-[10px] font-bold px-2 py-1 rounded-md pointer-events-none">
                Mark all as read
            </span>
        </button>
    </div>
                    </div>

                    {/* 2. SCROLLABLE LIST (Smaller Height) */}
                    <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar bg-background">
                        {NOTIFICATIONS.map((notif) => (
                            <button 
                                key={notif.id} 
                                className={`group flex w-full gap-4 border-b border-border p-4 text-left transition-colors hover:bg-[var(--surface)] ${notif.isNew ? 'bg-cyan-500/[0.02]' : 'bg-transparent'}`}
                            >
                                {/* Avatar */}
                                <div className="relative shrink-0 pt-0.5">
                                    <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm ${notif.color}`}>
                                        {notif.dp}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-hidden flex flex-col">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className={`text-[14px] font-bold truncate ${notif.isNew ? 'text-foreground' : 'text-foreground/80'}`}>{notif.name}</h4>
                                        
                                        {/* Status Dot / Close Icon Area */}
                                        <div className="flex shrink-0 items-center justify-end w-6 pt-1">
                                            {notif.isNew ? (
                                                <div className="h-2 w-2 rounded-full bg-cyan-500" />
                                            ) : (
                                                // Invisible by default, grey (muted) on hover
                                                <div className="h-2 w-2 rounded-full bg-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                            )}
                                        </div>
                                    </div>
                                    
                                    <p className="mt-0.5 truncate text-[13px] text-foreground-muted">{notif.msg}</p>
                                    <span className="mt-1.5 text-[11px] font-medium text-foreground-muted">{notif.time}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* 3. FIXED FOOTER */}
                    <div className="p-3 border-t border-border bg-background shrink-0">
                        <button className="w-full rounded-2xl py-2 text-center text-sm font-bold bg-cyan-600 transition-colors hover:bg-cyan-800">
                            View All Notifications
                        </button>
                    </div>
                    
                </div>
            )}
        </div>

                    {/* PROFILE */}
<div className="relative ml-2">
    <button onClick={() => toggleDropdown('profile')} className="flex items-center gap-3 rounded-full border border-border bg-surface-strong/40 p-1.5 pr-4 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.06]">
        <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-bold text-white">S</div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-400" />
        </div>
        <ChevronDown size={16} className="hidden text-foreground-muted md:block" />
    </button>
    
    {activeDropdown === 'profile' && (
        <div className={`${dropdownClass} right-0 w-64`}>
            <div className="border-b border-border p-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-bold text-white">S</div>
                <div>
                    <h3 className="font-semibold text-foreground">Sayan</h3>
                    <p className="text-sm text-foreground-muted">Senior Developer</p>
                </div>
            </div>
            
            <div className="p-2 border-b border-border">
                <Link 
                    to="/profile" 
                    onClick={() => setActiveDropdown(null)}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-foreground-muted transition-all hover:bg-white/[0.05] hover:text-foreground"
                >
                    <User size={16} /> My Profile
                </Link>
                
                <Link 
                    to="/settings" 
                    onClick={() => setActiveDropdown(null)}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-foreground-muted transition-all hover:bg-white/[0.05] hover:text-foreground"
                >
                    <Settings size={16} /> Settings
                </Link>
                
                <Link 
                    to="/billing" 
                    onClick={() => setActiveDropdown(null)}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-foreground-muted transition-all hover:bg-white/[0.05] hover:text-foreground"
                >
                    <CreditCard size={16} /> Billing Plan
                    {/* Notification Badge with Number 4 Beside the Billing Plan */}
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">4</span>
                </Link>
            </div>
            
            <div className="p-2">
                <Link 
                    to="/pricing" 
                    onClick={() => setActiveDropdown(null)}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-foreground-muted transition-all hover:bg-white/[0.05] hover:text-foreground"
                >
                    <BadgeDollarSign size={16} /> Pricing
                </Link>
                
                <Link 
                    to="/faq" 
                    onClick={() => setActiveDropdown(null)}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-foreground-muted transition-all hover:bg-white/[0.05] hover:text-foreground"
                >
                    <CircleHelp size={16} /> FAQ
                </Link>
                
                <button 
                    onClick={() => {
                        setActiveDropdown(null);
                        // Add your logout logic here
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white transition-all bg-red-600 hover:bg-red-800"
                >
                    <LogOut size={16} /> Sign Out
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