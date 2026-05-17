import { ShoppingCart } from 'lucide-react';

const BuyNowButton = () => {
    return (
        <div className="fixed top-1/2 right-0 z-50 -translate-y-1/2">
            <a
                href="#pricing" // Change this to your actual checkout or pricing link
                className="group flex items-center gap-2 rounded-l-xl bg-gradient-to-r from-rose-500 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:pr-6 hover:shadow-rose-500/50"
            >
                <ShoppingCart size={18} className="transition-transform group-hover:-rotate-12" />
                <span className="tracking-wide">Buy Now</span>
                
                {/* Subtle pulse ring behind the button */}
                <span className="absolute right-0 top-0 -z-10 h-full w-full animate-pulse rounded-l-xl bg-rose-500 opacity-40 blur-md"></span>
            </a>
        </div>
    );
};

export default BuyNowButton;