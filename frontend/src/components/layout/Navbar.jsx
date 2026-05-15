import {
    Activity,
    Bell,
    Check,
    ChevronDown,
    Clock,
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
    Zap,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../context/useTheme';

const THEMES = [
    { label: 'Light', value: 'light', icon: Sun },
    { label: 'Dark', value: 'dark', icon: Moon },
    { label: 'System', value: 'system', icon: Monitor },
];

const LANGUAGES = ['English', 'Hindi', 'Bengali'];

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
    
    const iconBtnClass = "relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface text-foreground-muted transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300";
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
                        <div className={`${dropdownClass} left-0 w-full`}>
                            {!searchTerm.trim() ? (
                                <div className="p-5">
                                    <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                                        <Clock size={12} /> Recent Searches
                                    </div>
                                    <div className="space-y-2">
                                        {['Revenue Analytics', 'Regional Insights', 'AI Forecast'].map((item, idx) => (
                                            <button key={idx} className="flex w-full items-center gap-3 rounded-2xl border border-transparent bg-surface-strong/40 px-4 py-3 text-left text-sm text-foreground-muted transition-all duration-300 hover:border-border hover:bg-white/[0.06] hover:text-foreground">
                                                <Clock size={16} /> {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="p-5">
                                    <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                                        <Sparkles size={12} /> Search Results
                                    </div>
                                    <div className="space-y-2">
                                        {searchResults.map((item, idx) => (
                                            <button key={idx} className="w-full rounded-2xl border border-transparent bg-surface-strong/40 p-4 text-left transition-all duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/5">
                                                <div className="font-semibold text-foreground">{item.topic}</div>
                                                <div className="mt-1 text-xs text-foreground-muted">{item.region || 'Global'}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-10 text-center">
                                    <Search size={28} className="mx-auto mb-3 text-foreground-muted opacity-50" />
                                    <p className="font-medium text-foreground">No results found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-2">
                    <button className={iconBtnClass}>
                        <Zap size={18} />
                    </button>

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

                    {/* NOTIFICATIONS */}
                    <div className="relative">
                        <button onClick={() => toggleDropdown('notifications')} className={iconBtnClass}>
                            <Bell size={18} />
                            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-background bg-red-500" />
                        </button>
                        {activeDropdown === 'notifications' && (
                            <div className={`${dropdownClass} right-0 w-[380px]`}>
                                <div className="flex items-center justify-between border-b border-border p-5">
                                    <div>
                                        <h3 className="font-semibold text-foreground">Notifications</h3>
                                        <p className="mt-1 text-xs text-foreground-muted">Recent updates & alerts</p>
                                    </div>
                                    <button className="text-xs font-medium text-cyan-400 hover:underline">Mark all read</button>
                                </div>
                                <div className="max-h-[360px] overflow-y-auto">
                                    <div className="flex gap-4 border-b border-border p-5 transition-all hover:bg-surface-strong/40 cursor-pointer">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                                            <Activity size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-foreground">AI Report Generated</h4>
                                            <p className="mt-1 text-sm leading-6 text-foreground-muted">Your predictive analytics report is now ready.</p>
                                            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-cyan-400">10 mins ago</p>
                                        </div>
                                    </div>
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
                                    <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-foreground-muted transition-all hover:bg-white/[0.05] hover:text-foreground">
                                        <User size={16} /> My Profile
                                    </button>
                                    <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-foreground-muted transition-all hover:bg-white/[0.05] hover:text-foreground">
                                        <Settings size={16} /> Settings
                                    </button>
                                </div>
                                <div className="p-2">
                                    <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-red-400 transition-all hover:bg-red-500/10 hover:text-red-500">
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