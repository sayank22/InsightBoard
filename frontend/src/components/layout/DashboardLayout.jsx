import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            <div className="flex">
                <Sidebar />

                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;