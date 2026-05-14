import {
    LayoutDashboard,
    BarChart3,
    FileText,
    Settings,
} from 'lucide-react';


const menuItems = [
    {
        title: 'Overview',
        icon: LayoutDashboard,
    },
    {
        title: 'Analytics',
        icon: BarChart3,
    },
    {
        title: 'Reports',
        icon: FileText,
    },
    {
        title: 'Settings',
        icon: Settings,
    },
];


const Sidebar = ({
    sidebarOpen,
    setSidebarOpen,
}) => {

    return (
        <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}


            {/* Sidebar */}
            <aside
                className={`
                    fixed md:static top-0 left-0 z-50
                    h-screen w-72
                    bg-[color:var(--surface)] border-r border-[color:var(--border)]
                    transform transition-transform duration-300
                    ${sidebarOpen
                        ? 'translate-x-0'
                        : '-translate-x-full md:translate-x-0'
                    }
                `}
            >

                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-[color:var(--border)]">

                    <h2 className="text-xl font-bold text-[color:var(--foreground)]">
                        InsightBoard
                    </h2>

                </div>


                {/* Menu */}
                <nav className="p-4">

                    <ul className="space-y-2">

                        {menuItems.map((item, index) => {

                            const Icon = item.icon;

                            return (
                                <li
                                    key={index}
                                    className="
                                        flex items-center gap-3
                                        px-4 py-3 rounded-xl
                                        text-[color:var(--muted)]
                                        hover:bg-[color:var(--surface-strong)]
                                        hover:text-[color:var(--foreground)]
                                        cursor-pointer
                                        transition
                                    "
                                >

                                    <Icon size={20} />

                                    <span>
                                        {item.title}
                                    </span>

                                </li>
                            );
                        })}

                    </ul>

                </nav>


                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[color:var(--border)]">

                    <p className="text-sm text-[color:var(--muted)]">
                        Analytics Dashboard v1.0
                    </p>

                </div>

            </aside>
        </>
    );
};


export default Sidebar;