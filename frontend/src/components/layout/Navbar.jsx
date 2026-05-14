import {
    Bell,
    ChevronDown,
    Globe,
    Menu,
    Monitor,
    Moon,
    Search,
    Sun,
} from 'lucide-react';

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { useTheme } from '../../context/ThemeContext';


const Navbar = ({
    setSidebarOpen,
    dashboardData = [],
}) => {

    // ==========================================
    // STATES
    // ==========================================
    const [searchTerm, setSearchTerm] = useState('');

    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) {
            return [];
        }

        return dashboardData
            .filter((item) =>
                item.topic
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
            .slice(0, 5);
    }, [searchTerm, dashboardData]);

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [showProfile, setShowProfile] =
        useState(false);

    const [showLanguage, setShowLanguage] =
        useState(false);

    const [showTheme, setShowTheme] =
        useState(false);


    const { theme, resolvedTheme, setTheme } = useTheme();

    const currentThemeIcon =
        resolvedTheme === 'dark' ? (
            <Moon size={20} />
        ) : (
            <Sun size={20} />
        );

    const themeLabel =
        theme === 'system'
            ? `System (${resolvedTheme})`
            : theme.charAt(0).toUpperCase() + theme.slice(1);

    const dropdownRef = useRef();


    // ==========================================
    // SEARCH FUNCTIONALITY
    // ==========================================


    // ==========================================
    // CLOSE DROPDOWNS
    // ==========================================
    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {

                setShowNotifications(false);

                setShowProfile(false);

                setShowLanguage(false);

                setShowTheme(false);
            }
        };

        document.addEventListener(
            'mousedown',
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleOutsideClick
            );
        };

    }, []);


    return (
<header className="sticky top-0 z-40 h-16 bg-[color:var(--surface-strong)] border-b border-[color:var(--border)] flex items-center justify-between px-4 md:px-6">

            {/* LEFT SECTION */}
            <div className="flex items-center gap-4">

                {/* MOBILE MENU */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setSidebarOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </button>


                {/* LOGO */}
                <div>

                    <h1 className="text-xl md:text-2xl font-bold text-white">

                        <span className="hidden sm:inline">
                            Analytics Dashboard
                        </span>

                        <span className="sm:hidden">
                            Dashboard
                        </span>

                    </h1>

                </div>

            </div>


            {/* SEARCH */}
            <div className="hidden md:flex relative w-full max-w-md mx-6">

                <Search
                    size={18}
                    className="absolute left-3 top-3 text-slate-400"
                />


                <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="
                        w-full
                        bg-slate-800
                        border border-slate-700
                        rounded-xl
                        pl-10 pr-4 py-2
                        text-white
                        outline-none
                        focus:border-slate-500
                    "
                />


                {/* SEARCH RESULTS */}
                {(searchResults.length > 0 ||
                    searchTerm.trim()) && (

                    <div className="
                        absolute
                        top-14
                        left-0
                        w-full
                        bg-slate-900
                        border border-slate-800
                        rounded-xl
                        shadow-xl
                        overflow-hidden
                    ">

                        {searchResults.length > 0 ? (

                            searchResults.map((item, index) => (

                                <div
                                    key={index}
                                    className="
                                        px-4 py-3
                                        hover:bg-slate-800
                                        border-b border-slate-800
                                        cursor-pointer
                                    "
                                >

                                    <p className="text-white text-sm font-medium">
                                        {item.topic}
                                    </p>

                                    <p className="text-slate-400 text-xs mt-1">
                                        {item.region || 'No Region'}
                                    </p>

                                </div>
                            ))

                        ) : (

                            <div className="p-4 border-b border-slate-800">

                                <p className="text-sm text-slate-400">
                                    No results found.
                                </p>

                            </div>
                        )}

                    </div>
                )}

            </div>


            {/* RIGHT SECTION */}
            <div
                ref={dropdownRef}
                className="flex items-center gap-2 md:gap-3"
            >

                {/* LANGUAGE */}
                <div className="relative">

                    <button
                        onClick={() =>
                            setShowLanguage(!showLanguage)
                        }
                        className="
                            flex items-center gap-1
                            p-2 rounded-lg
                            hover:bg-slate-800
                            text-slate-300
                            transition
                        "
                    >

                        <Globe size={20} />

                        <ChevronDown size={16} />

                    </button>


                    {showLanguage && (

                        <div className="
                            absolute right-0 mt-2
                            w-40
                            bg-slate-900
                            border border-slate-800
                            rounded-xl
                            shadow-xl
                            overflow-hidden
                        ">

                            {[
                                'English',
                                'Hindi',
                                'Bengali',
                            ].map((lang) => (

                                <button
                                    key={lang}
                                    className="
                                        w-full text-left
                                        px-4 py-3
                                        hover:bg-slate-800
                                        text-white
                                    "
                                >
                                    {lang}
                                </button>
                            ))}

                        </div>
                    )}

                </div>


                {/* THEME */}
                <div className="relative">

                    <button
                        onClick={() =>
                            setShowTheme(!showTheme)
                        }
                        className="
                            flex items-center gap-1
                            p-2 rounded-lg
                            hover:bg-slate-800
                            text-slate-300
                            transition
                        "
                        title={themeLabel}
                    >

                        {currentThemeIcon}

                        <ChevronDown size={16} />

                    </button>


                    {showTheme && (

                        <div className="
                            absolute right-0 mt-2
                            w-44
                            bg-slate-900
                            border border-slate-800
                            rounded-xl
                            shadow-xl
                            overflow-hidden
                        ">

                            <button
                                onClick={() =>
                                    setTheme('light')
                                }
                                className="
                                    w-full flex items-center gap-2
                                    px-4 py-3
                                    hover:bg-slate-800
                                    text-white
                                "
                            >

                                <Sun size={18} />

                                Light

                            </button>


                            <button
                                onClick={() =>
                                    setTheme('dark')
                                }
                                className="
                                    w-full flex items-center gap-2
                                    px-4 py-3
                                    hover:bg-slate-800
                                    text-white
                                "
                            >

                                <Moon size={18} />

                                Dark

                            </button>


                            <button
                                onClick={() =>
                                    setTheme('system')
                                }
                                className="
                                    w-full flex items-center gap-2
                                    px-4 py-3
                                    hover:bg-slate-800
                                    text-white
                                "
                            >

                                <Monitor size={18} />

                                System

                            </button>

                        </div>
                    )}

                </div>


                {/* NOTIFICATIONS */}
                <div className="relative">

                    <button
                        onClick={() =>
                            setShowNotifications(
                                !showNotifications
                            )
                        }
                        className="
                            relative
                            p-2 rounded-lg
                            hover:bg-slate-800
                            text-slate-300
                            transition
                        "
                    >

                        <Bell size={20} />

                        <span className="
                            absolute top-1 right-1
                            w-2 h-2
                            bg-red-500
                            rounded-full
                        "></span>

                    </button>


                    {showNotifications && (

                        <div className="
                            absolute right-0 mt-2
                            w-72
                            bg-slate-900
                            border border-slate-800
                            rounded-xl
                            shadow-xl
                            overflow-hidden
                        ">

                            <div className="
                                px-4 py-3
                                border-b border-slate-800
                                text-white font-semibold
                            ">
                                Notifications
                            </div>


                            <div className="
                                px-4 py-3
                                border-b border-slate-800
                                hover:bg-slate-800
                            ">

                                <p className="text-white text-sm">
                                    Dashboard updated successfully
                                </p>

                            </div>


                            <div className="
                                px-4 py-3
                                hover:bg-slate-800
                            ">

                                <p className="text-white text-sm">
                                    New analytics report generated
                                </p>

                            </div>

                        </div>
                    )}

                </div>


                {/* PROFILE */}
                <div className="relative">

                    <button
                        onClick={() =>
                            setShowProfile(!showProfile)
                        }
                        className="
                            flex items-center gap-2
                            bg-slate-800
                            px-3 py-2
                            rounded-xl
                            hover:bg-slate-700
                            transition
                        "
                    >

                        <div className="
                            w-8 h-8
                            rounded-full
                            bg-cyan-500
                            flex items-center justify-center
                            text-black
                            font-bold
                        ">
                            S
                        </div>


                        <div className="hidden md:block text-left">

                            <p className="text-sm text-white font-medium">
                                Sayan
                            </p>

                            <p className="text-xs text-slate-400">
                                Developer
                            </p>

                        </div>


                        <ChevronDown
                            size={16}
                            className="text-slate-400"
                        />

                    </button>


                    {showProfile && (

                        <div className="
                            absolute right-0 mt-2
                            w-52
                            bg-slate-900
                            border border-slate-800
                            rounded-xl
                            shadow-xl
                            overflow-hidden
                        ">

                            <button className="
                                w-full text-left
                                px-4 py-3
                                hover:bg-slate-800
                                text-white
                            ">
                                Profile
                            </button>


                            <button className="
                                w-full text-left
                                px-4 py-3
                                hover:bg-slate-800
                                text-white
                            ">
                                Settings
                            </button>


                            <button className="
                                w-full text-left
                                px-4 py-3
                                hover:bg-slate-800
                                text-red-400
                            ">
                                Logout
                            </button>

                        </div>
                    )}

                </div>

            </div>

        </header>
    );
};


export default Navbar;