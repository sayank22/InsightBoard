import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ScrollToTop from '../ui/ScrollToTop';
import BuyNowButton from '../ui/BuyNowButton';


const DashboardLayout = ({ children }) => {

    const [sidebarOpen, setSidebarOpen] =
        useState(false);


    return (
        <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
            <Navbar setSidebarOpen={setSidebarOpen} />
            <div className="flex">
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <main className="flex-1 p-4 md:p-6 md:ml-0">
                    {children}
                </main>
            </div>

            {/* Global Floating Elements */}
            <ScrollToTop />
            <BuyNowButton />

        </div>
    );
};


export default DashboardLayout;