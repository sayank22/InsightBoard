import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ScrollToTop from '../ui/ScrollToTop';
import BuyNowButton from '../ui/BuyNowButton';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        // 1. ROOT WRAPPER: Enforces strict screen limits to prevent mobile "zoom/stretch" bugs
        <div className="flex min-h-screen max-w-[100vw] overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
            
            {/* 2. SIDEBAR: Sits on the left side of the flex container */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* 3. CONTENT COLUMN: min-w-0 is CRITICAL here so charts don't break the flex width */}
            <div className="flex w-full min-w-0 flex-1 flex-col transition-all duration-300 min-h-screen">
                
                <Navbar setSidebarOpen={setSidebarOpen} />
                
                {/* 4. MAIN: flex-1 ensures it grows to push the Footer to the very bottom */}
                <main className="flex-1 w-full max-w-full p-4 md:p-6 lg:p-8 overflow-x-hidden">
                    {children}
                </main>

                <Footer />
            </div>

            {/* Global Floating Elements */}
            <ScrollToTop />
            <BuyNowButton />

        </div>
    );
};

export default DashboardLayout;