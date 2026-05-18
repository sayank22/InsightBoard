import { Link } from 'react-router-dom';
import { Heart, Code2, LifeBuoy, ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="mt-auto w-full border-t app-border bg-[var(--surface-strong)]/40 px-6 py-5 backdrop-blur-xl transition-all duration-300">
            <div className="mx-auto flex w-full flex-col items-center justify-between gap-4 md:flex-row">
                
                {/* LEFT SIDE: Creator Credit */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--foreground-muted)]">
                    <span>Made with</span>
                    <Heart size={14} className="animate-pulse text-rose-500 fill-rose-500" />
                    <span>by</span>
                    <a 
                        href="https://sayan-kundu-portfolio.netlify.app" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-bold text-cyan-500 transition-colors duration-300 hover:text-cyan-400 hover:underline"
                    >
                        Sayan Kundu
                    </a>
                </div>

                {/* RIGHT SIDE: Navigation Links */}
                <div className="flex items-center gap-6 text-sm font-medium">
                    
                    {/* License - Internal Link */}
                    <Link 
                        to="/license" 
                        className="group flex items-center gap-2 text-[var(--foreground-muted)] transition-colors duration-300 hover:text-cyan-500"
                    >
                        <ShieldCheck size={16} className="transition-transform group-hover:scale-110" />
                        <span className="hidden sm:inline">License</span>
                    </Link>
                    
                    {/* Documentation - External Github Link */}
                    <a 
                        href="https://github.com/sayank22/InsightBoard" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 text-[var(--foreground-muted)] transition-colors duration-300 hover:text-cyan-500"
                    >
                        <Code2 size={16} className="transition-transform group-hover:scale-110" />
                        <span className="hidden sm:inline">Documentation</span>
                    </a>
                    
                    {/* Support - Internal Link */}
                    <Link 
                        to="/support" 
                        className="group flex items-center gap-2 text-[var(--foreground-muted)] transition-colors duration-300 hover:text-cyan-500"
                    >
                        <LifeBuoy size={16} className="transition-transform group-hover:scale-110" />
                        <span className="hidden sm:inline">Support</span>
                    </Link>
                    
                </div>
                
            </div>
        </footer>
    );
};

export default Footer;