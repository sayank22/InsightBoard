import { useState, useEffect, useMemo, useRef } from 'react';
import { 
    AlertTriangle, 
    TrendingUp, 
    Zap, 
    ChevronLeft, 
    ChevronRight,
    Globe2,
    Factory,
    Layers,
    Pause
} from 'lucide-react';

// =====================================
// DYNAMIC THEME-INDEPENDENT BACKGROUND STYLES
// =====================================
const getCardStyles = (type) => {
    switch (type) {
        case 'CRITICAL RISK':
            return {
                bgWash: 'bg-gradient-to-br from-rose-500/[0.04] via-rose-500/[0.01] to-transparent',
                borderHover: 'hover:border-rose-500/30 focus:border-rose-500/30',
                glow: 'shadow-rose-500/[0.06] hover:border-rose-500/30'
            };
        case 'HIGH PROBABILITY':
            return {
                bgWash: 'bg-gradient-to-br from-amber-500/[0.04] via-amber-500/[0.01] to-transparent',
                borderHover: 'hover:border-amber-500/30 focus:border-amber-500/30',
                glow: 'shadow-amber-500/[0.06] hover:border-amber-500/30'
            };
        case 'STRATEGIC OPPORTUNITY':
            return {
                bgWash: 'bg-gradient-to-br from-emerald-500/[0.04] via-emerald-500/[0.01] to-transparent',
                borderHover: 'hover:border-emerald-500/30 focus:border-emerald-500/30',
                glow: 'shadow-emerald-500/[0.06] hover:border-emerald-500/30'
            };
        case 'GLOBAL HOTSPOT':
            return {
                bgWash: 'bg-gradient-to-br from-sky-500/[0.04] via-sky-500/[0.01] to-transparent',
                borderHover: 'hover:border-sky-500/30 focus:border-sky-500/30',
                glow: 'shadow-sky-500/[0.06] hover:border-sky-500/30'
            };
        case 'DOMINANT SECTOR':
            return {
                bgWash: 'bg-gradient-to-br from-violet-500/[0.04] via-violet-500/[0.01] to-transparent',
                borderHover: 'hover:border-violet-500/30 focus:border-violet-500/30',
                glow: 'shadow-violet-500/[0.06] hover:border-violet-500/30'
            };
        case 'MACRO DRIVER':
            return {
                bgWash: 'bg-gradient-to-br from-fuchsia-500/[0.04] via-fuchsia-500/[0.01] to-transparent',
                borderHover: 'hover:border-fuchsia-500/30 focus:border-fuchsia-500/30',
                glow: 'shadow-fuchsia-500/[0.06] hover:border-fuchsia-500/30'
            };
        default:
            return {
                bgWash: 'bg-gradient-to-br from-cyan-500/[0.04] via-cyan-500/[0.01] to-transparent',
                borderHover: 'hover:border-cyan-500/30 focus:border-cyan-500/30',
                glow: 'shadow-cyan-500/[0.06] hover:border-cyan-500/30'
            };
    }
};

const AutoInsightSlider = ({ data = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef(null);

    // =====================================
    // COMPUTE REAL INSIGHTS FROM DATA
    // =====================================
    const insights = useMemo(() => {
        if (!data || data.length === 0) return [];

        // 1. Sort-based Metrics
        const maxIntensityItem = [...data].sort((a, b) => (b.intensity || 0) - (a.intensity || 0))[0] || {};
        const maxLikelihoodItem = [...data].sort((a, b) => (b.likelihood || 0) - (a.likelihood || 0))[0] || {};
        const topOpportunity = [...data].sort((a, b) => (b.relevance || 0) - (a.relevance || 0))[0] || {};

        // 2. Frequency-based Metrics Helper
        const getTopFrequency = (key) => {
            const counts = {};
            data.forEach(item => {
                if (item[key] && item[key].trim() !== '') {
                    counts[item[key]] = (counts[item[key]] || 0) + 1;
                }
            });
            const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            return sorted[0] || ['Unknown', 0];
        };

        const [topCountry, countryCount] = getTopFrequency('country');
        const [topSector, sectorCount] = getTopFrequency('sector');
        const [topPestle] = getTopFrequency('pestle');

        // Total records for percentage math
        const total = data.length;

        return [
            {
                id: 0,
                type: 'CRITICAL RISK',
                title: `Peak Threat Detected in ${maxIntensityItem.sector || 'Global Markets'}`,
                description: `A critical trend regarding "${maxIntensityItem.topic || 'Uncategorized'}" in ${maxIntensityItem.country || 'Global region'} has reached a peak intensity impact factor of ${maxIntensityItem.intensity || 0}.`,
                icon: AlertTriangle,
                badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
            },
            {
                id: 1,
                type: 'HIGH PROBABILITY',
                title: `Incoming Structural Shift: ${maxLikelihoodItem.topic || 'Trend'}`,
                description: `Analytical models show a maximum likelihood coefficient of ${maxLikelihoodItem.likelihood || 0}/5 regarding incoming updates in the ${maxLikelihoodItem.pestle || 'macro'} sector.`,
                icon: Zap,
                badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            },
            {
                id: 2,
                type: 'STRATEGIC OPPORTUNITY',
                title: `${topOpportunity.sector || 'Emerging'} Domain Acceleration`,
                description: `High operational relevance value (${topOpportunity.relevance || 0}/7) discovered under the "${topOpportunity.topic || 'General'}" focus node, showing alignment requirements.`,
                icon: TrendingUp,
                badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            },
            {
                id: 3,
                type: 'GLOBAL HOTSPOT',
                title: `Geographic Concentration: ${topCountry}`,
                description: `Volume analysis indicates ${topCountry} is the primary origin point for dataset insights, accounting for ${countryCount} distinct strategic records (${((countryCount/total)*100).toFixed(1)}% of total).`,
                icon: Globe2,
                badgeColor: 'bg-sky-500/10 text-sky-500 border-sky-500/20'
            },
            {
                id: 4,
                type: 'DOMINANT SECTOR',
                title: `Industry Focus: ${topSector}`,
                description: `The ${topSector} sector dominates current analytical tracking, representing a massive focal point of ${sectorCount} independent data entries.`,
                icon: Factory,
                badgeColor: 'bg-violet-500/10 text-violet-500 border-violet-500/20'
            },
            {
                id: 5,
                type: 'MACRO DRIVER',
                title: `Primary Shift: ${topPestle} Factors`,
                description: `PESTLE categorization reveals that ${topPestle} drivers are the leading catalyst for change, heavily influencing current market and systemic trajectories.`,
                icon: Layers,
                badgeColor: 'bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20'
            }
        ];
    }, [data]);

    // =====================================
    // AUTOMATIC TIMER LOGIC (5s Interval with Pause)
    // =====================================
    useEffect(() => {
        if (insights.length === 0 || isPaused) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            setActiveIndex((current) => (current + 1) % insights.length);
        }, 5000); 

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [insights.length, isPaused]);

    if (data.length === 0 || insights.length === 0) return null;

    const currentCard = insights[activeIndex];
    const CardIcon = currentCard.icon;
    const progressKey = `${activeIndex}-${isPaused}`;
    const cardStyle = getCardStyles(currentCard.type);

    return (
        <div 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className={`relative overflow-hidden rounded-3xl border app-border bg-cyan-300 p-6 shadow-xl transition-all duration-500 ease-in-out ${cardStyle.glow} ${cardStyle.borderHover}`}
        >
            {/* RICH SUBTLE EMISSION BACKGROUND GRADIENT LAYER */}
            <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${cardStyle.bgWash}`} />

            {/* PAUSE INDICATOR */}
            <div className={`absolute top-6 right-6 flex items-center gap-1.5 transition-opacity duration-300 z-10 ${isPaused ? 'opacity-100' : 'opacity-0'}`}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Paused</span>
                <Pause size={14} className="text-[var(--foreground-muted)] fill-current" />
            </div>

            {/* CARD CONTENT */}
            <div 
                key={activeIndex} // Refreshes text alignment animations
                className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 min-h-[120px] animate-in fade-in slide-in-from-right-8 duration-500"
            >
                <div className="flex-1 pr-8 md:pr-0">
                    {/* Badge */}
                    <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${currentCard.badgeColor}`}>
                        {currentCard.type}
                    </span>
                    
                    {/* Title */}
                    <h3 className="mt-3 text-xl font-bold app-text capitalize">
                        {currentCard.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="mt-1.5 text-sm leading-6 app-text-muted max-w-4xl">
                        {currentCard.description}
                    </p>
                </div>

                {/* Accent Icon Graphic Box */}
                <div className={`hidden md:flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl border border-white/5 ${currentCard.badgeColor.split(' ')[0]} ${currentCard.badgeColor.split(' ')[1]}`}>
                    <CardIcon size={32} strokeWidth={2.5} />
                </div>
            </div>

            {/* CONTROLS AREA PANEL */}
            <div className="relative z-10 mt-6 pt-5 border-t app-border flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Visual Indicators Dots with Animated Progress */}
                <div className="flex items-center gap-2">
                    {insights.map((_, i) => {
                        const isActive = i === activeIndex;
                        const colorMatch = currentCard.badgeColor.match(/bg-(\w+-\d+)/);
                        const bgFill = colorMatch ? `bg-${colorMatch[1].replace('10', '500')}` : 'bg-cyan-500';

                        return (
                            <button
                                key={i}
                                onClick={() => {
                                    setIsPaused(true);
                                    setActiveIndex(i);
                                }}
                                className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 ${
                                    isActive ? 'w-10 bg-[var(--border)]' : 'w-2 bg-[var(--border)] hover:bg-[var(--foreground-muted)]'
                                }`}
                            >
                                {isActive && (
                                    <div 
                                        key={progressKey}
                                        className={`absolute top-0 left-0 h-full w-full ${bgFill}`}
                                        style={{
                                            animation: isPaused ? 'none' : 'fill-progress 5s linear forwards',
                                            transformOrigin: 'left',
                                            transform: isPaused ? 'scaleX(1)' : 'scaleX(0)'
                                        }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Manual Direction Buttons */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => {
                            setIsPaused(true);
                            setActiveIndex((curr) => (curr - 1 + insights.length) % insights.length);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-strong)]/40 app-text transition hover:bg-[var(--hover)] hover:text-[var(--foreground)]"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() => {
                            setIsPaused(true);
                            setActiveIndex((curr) => (curr + 1) % insights.length);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-strong)]/40 app-text transition hover:bg-[var(--hover)] hover:text-[var(--foreground)]"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Animation Engine Keyframe */}
            <style>{`
                @keyframes fill-progress {
                    0% { transform: scaleX(0); }
                    100% { transform: scaleX(1); }
                }
            `}</style>
        </div>
    );
};

export default AutoInsightSlider;