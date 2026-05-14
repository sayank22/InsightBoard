const Sidebar = () => {
    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 hidden md:block">
            <h2 className="text-lg font-semibold mb-6 text-white">
                Dashboard Menu
            </h2>

            <ul className="space-y-4 text-slate-300">
                <li className="hover:text-white cursor-pointer">
                    Overview
                </li>

                <li className="hover:text-white cursor-pointer">
                    Analytics
                </li>

                <li className="hover:text-white cursor-pointer">
                    Reports
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;