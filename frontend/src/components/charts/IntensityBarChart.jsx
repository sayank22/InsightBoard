import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
    Activity,
    Sparkles,
    TrendingUp,
    Monitor,       // Information Technology
    ShieldCheck,   // Security
    Plane,         // Tourism & hospitality
    Wheat,         // Food & agriculture
    Landmark,      // Financial services
    Headset,       // Support services
    HeartPulse,    // Healthcare
    Zap,           // Energy
    Factory        // Default
} from 'lucide-react';

// =====================================
// DYNAMIC SECTOR ICON MAPPER
// =====================================
const getSectorIcon = (sector, size = 16, className = "") => {
    const s = sector?.toLowerCase() || '';
    
    if (s.includes('information technology') || s.includes('it')) return <Monitor size={size} className={className} />;
    if (s.includes('security')) return <ShieldCheck size={size} className={className} />;
    if (s.includes('tourism') || s.includes('hospitality')) return <Plane size={size} className={className} />;
    if (s.includes('food') || s.includes('agriculture')) return <Wheat size={size} className={className} />;
    if (s.includes('financial') || s.includes('finance')) return <Landmark size={size} className={className} />;
    if (s.includes('support')) return <Headset size={size} className={className} />;
    if (s.includes('healthcare') || s.includes('health')) return <HeartPulse size={size} className={className} />;
    if (s.includes('energy')) return <Zap size={size} className={className} />;
    
    return <Factory size={size} className={className} />;
};

const IntensityAreaChart = ({ data }) => {
    const d3ContainerRef = useRef();
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });

    // =====================================
    // MEMOIZED DATA
    // =====================================
    const chartData = useMemo(() => {
        if (!data?.length) return [];

        const sectorMap = {};

        data.forEach((item) => {
            if (!item.sector) return;
            if (!sectorMap[item.sector]) {
                sectorMap[item.sector] = { total: 0, count: 0 };
            }
            sectorMap[item.sector].total += item.intensity || 0;
            sectorMap[item.sector].count += 1;
        });

        return Object.entries(sectorMap)
            .map(([sector, values]) => ({
                sector,
                avgIntensity: values.total / values.count,
            }))
            .sort((a, b) => b.avgIntensity - a.avgIntensity)
            .slice(0, 8); // Top 8 Sectors
    }, [data]);

    // =====================================
    // METRICS
    // =====================================
    const overallAverage = useMemo(() => {
        if (!chartData.length) return 0;
        return (
            chartData.reduce((sum, item) => sum + item.avgIntensity, 0) / chartData.length
        ).toFixed(1);
    }, [chartData]);

    const topSector = chartData?.[0]?.sector || '-';

    // =====================================
    // SHARED SCALES (React + D3 Sync)
    // =====================================
    const width = 920;
    const height = 440; // Extra height for the stacked icons & text
    const margin = { top: 40, right: 40, bottom: 90, left: 60 };

    const xScale = useMemo(() => {
        return d3.scalePoint()
            .domain(chartData.map((d) => d.sector))
            .range([margin.left, width - margin.right])
            .padding(0.5);
    }, [chartData]);

    const yScale = useMemo(() => {
        const maxValue = d3.max(chartData, (d) => d.avgIntensity) || 0;
        return d3.scaleLinear()
            .domain([0, maxValue * 1.1]) // 10% headroom
            .nice()
            .range([height - margin.bottom, margin.top]);
    }, [chartData]);

    // =====================================
    // CHART RENDERING (D3)
    // =====================================
    useEffect(() => {
        if (!chartData.length) return;

        // Select the specific <g> element for D3 so it doesn't delete React's elements
        const g = d3.select(d3ContainerRef.current);
        g.selectAll('*').remove();

        // DEFS (Gradients)
        const defs = g.append('defs');
        const gradient = defs
            .append('linearGradient')
            .attr('id', 'area-gradient')
            .attr('x1', '0%').attr('y1', '0%')
            .attr('x2', '0%').attr('y2', '100%');

        gradient.append('stop').attr('offset', '0%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0.4);
        gradient.append('stop').attr('offset', '100%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0.01);

        // GRID LINES
        g.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(
                d3.axisLeft(yScale)
                    .ticks(5)
                    .tickSize(-width + margin.left + margin.right)
                    .tickFormat('')
            )
            .selectAll('line')
            .attr('stroke', 'var(--border)')
            .attr('stroke-dasharray', '4,4')
            .attr('opacity', 0.5);

        g.selectAll('.domain').remove();

        // X AXIS BASE LINE (Text is removed, handled by React)
        g.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickSize(0))
            .selectAll('text').remove();

        // Y AXIS
        g.append('g')
            .attr('transform', `translate(${margin.left - 10},0)`)
            .call(d3.axisLeft(yScale).ticks(5).tickSize(0))
            .selectAll('text')
            .style('fill', 'var(--foreground-muted)')
            .style('font-size', '12px')
            .style('font-weight', '500');

        // AREA SPLINE
        const area = d3
            .area()
            .x((d) => xScale(d.sector))
            .y0(height - margin.bottom)
            .y1((d) => yScale(d.avgIntensity))
            .curve(d3.curveMonotoneX);

        g.append('path')
            .datum(chartData)
            .attr('fill', 'url(#area-gradient)')
            .attr('d', area)
            .attr('opacity', 0)
            .transition()
            .duration(1000)
            .attr('opacity', 1);

        // SPLINE LINE
        const line = d3
            .line()
            .x((d) => xScale(d.sector))
            .y((d) => yScale(d.avgIntensity))
            .curve(d3.curveMonotoneX);

        const linePath = g
            .append('path')
            .datum(chartData)
            .attr('fill', 'none')
            .attr('stroke', '#06b6d4') // Cyan-500
            .attr('stroke-width', 3)
            .attr('stroke-linecap', 'round')
            .attr('d', line);

        const pathLength = linePath.node().getTotalLength();

        linePath
            .attr('stroke-dasharray', pathLength)
            .attr('stroke-dashoffset', pathLength)
            .transition()
            .duration(1500)
            .ease(d3.easeCubicOut)
            .attr('stroke-dashoffset', 0);

        // INTERACTIVE POINTS
        const points = g
            .selectAll('.point')
            .data(chartData)
            .enter()
            .append('circle')
            .attr('class', 'point')
            .attr('cx', (d) => xScale(d.sector))
            .attr('cy', (d) => yScale(d.avgIntensity))
            .attr('r', 0)
            .attr('fill', '#06b6d4')
            .attr('stroke', 'var(--surface)')
            .attr('stroke-width', 2.5)
            .style('cursor', 'pointer');

        points
            .transition()
            .duration(500)
            .delay((d, i) => i * 80 + 500)
            .attr('r', 6);

        // HOVER INTERACTIONS
        points
            .on('mousemove', function (event, d) {
                d3.select(this).transition().duration(150).attr('r', 9);
                setTooltip({
                    show: true,
                    x: event.clientX,
                    y: event.clientY,
                    data: d,
                });
            })
            .on('mouseleave', function () {
                d3.select(this).transition().duration(150).attr('r', 6);
                setTooltip((prev) => ({ ...prev, show: false }));
            });

    }, [chartData, xScale, yScale]);

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-[var(--surface)] p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
            
            {/* REACT PORTAL TOOLTIP */}
            {tooltip.show && tooltip.data && (
                <div 
                    className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full pb-4"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    <div className="bg-[var(--surface-strong)] border app-border rounded-2xl p-4 shadow-2xl flex flex-col gap-3 min-w-[200px]">
                        <div className="flex items-center gap-3 border-b app-border pb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                                {getSectorIcon(tooltip.data.sector, 20, "text-cyan-500")}
                            </div>
                            <div className="font-bold text-sm app-text capitalize truncate max-w-[140px]">
                                {tooltip.data.sector}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-semibold">Avg Intensity</span>
                            <span className="font-bold text-cyan-500 text-base">{tooltip.data.avgIntensity.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                        <Sparkles size={14} />
                        Sector Analytics
                    </div>
                    <h2 className="text-2xl font-bold app-text">
                        Sector Intensity Curve
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 app-text-muted">
                        Smooth area distribution mapping the average intensity across the highest-performing sectors.
                    </p>
                </div>
                <button className="flex items-center gap-2 rounded-2xl border app-border bg-[var(--surface-strong)] px-5 py-3 text-sm font-medium app-text transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-500">
                    <TrendingUp size={16} />
                    Analyze Growth
                </button>
            </div>

            {/* COMPACT STATS BOXES WITH ICONS */}
            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-4 py-2.5 transition-all hover:bg-[var(--surface-strong)]/60">
                    <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Sectors Analyzed</span>
                    <span className="text-lg font-bold app-text">{chartData.length}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-4 py-2.5 transition-all hover:bg-[var(--surface-strong)]/60">
                    <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Overall Average</span>
                    <span className="text-lg font-bold text-cyan-500">{overallAverage}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-4 py-2.5 transition-all hover:bg-[var(--surface-strong)]/60">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Leading Sector</span>
                    </div>
                    <div className="flex items-center gap-2 text-violet-500 font-bold">
                        {getSectorIcon(topSector, 16, "text-violet-500")}
                        <span className="text-lg capitalize truncate max-w-[120px]">
                            {topSector}
                        </span>
                    </div>
                </div>
            </div>

            {/* CHART */}
            <div className="rounded-3xl border app-border bg-[var(--surface-strong)]/20 p-4">
                <div className="w-full relative">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block">
                        
                        {/* D3 Injects the structural chart into this group */}
                        <g ref={d3ContainerRef} />
                        
                        {/* React Injects perfectly positioned HTML labels overlaying the X-Axis */}
                        <g className="react-labels">
                            {chartData.map((item, index) => {
                                const xPos = xScale(item.sector);
                                const words = item.sector.split(' ');
                                const firstWord = words[0];
                                const restWords = words.slice(1).join(' ');

                                return (
                                    <foreignObject
                                        key={index}
                                        x={xPos - 50}
                                        y={height - margin.bottom + 14}
                                        width={100}
                                        height={80}
                                    >
                                        <div xmlns="http://www.w3.org/1999/xhtml" className="flex flex-col items-center text-center w-full">
                                            {/* Stacked Icon Component */}
                                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--surface)] border app-border mb-1.5 text-[var(--foreground-muted)] shadow-sm">
                                                {getSectorIcon(item.sector, 16)}
                                            </div>
                                            
                                            {/* Stacked Word Array */}
                                            <span className="text-[11px] font-bold text-[var(--foreground)] capitalize leading-tight">
                                                {firstWord}
                                            </span>
                                            {restWords && (
                                                <span className="text-[9px] font-medium text-[var(--foreground-muted)] capitalize leading-tight mt-0.5 max-w-[90px]">
                                                    {restWords}
                                                </span>
                                            )}
                                        </div>
                                    </foreignObject>
                                );
                            })}
                        </g>

                    </svg>
                </div>
            </div>
            
        </div>
    );
};

export default IntensityAreaChart;