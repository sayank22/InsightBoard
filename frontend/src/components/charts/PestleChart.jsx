import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
    Activity,
    Briefcase,
    Sparkles,
    FileText,
    Factory,       // Industries
    Coins,         // Economic
    Landmark,      // Political
    Leaf,          // Environmental
    Users,         // Social
    Cpu,           // Technological
    Coffee         // Lifestyles
} from 'lucide-react';

// =====================================
// DYNAMIC PESTLE ICON MAPPER
// =====================================
const getPestleIcon = (pestle, size = 16, className = "") => {
    const p = pestle?.toLowerCase() || '';
    
    if (p.includes('industries') || p.includes('industry')) return <Factory size={size} className={className} />;
    if (p.includes('economic') || p.includes('economy')) return <Coins size={size} className={className} />;
    if (p.includes('political') || p.includes('politics')) return <Landmark size={size} className={className} />;
    if (p.includes('environmental') || p.includes('environment')) return <Leaf size={size} className={className} />;
    if (p.includes('social') || p.includes('society')) return <Users size={size} className={className} />;
    if (p.includes('technological') || p.includes('technology')) return <Cpu size={size} className={className} />;
    if (p.includes('organization') || p.includes('corporate')) return <Briefcase size={size} className={className} />;
    if (p.includes('lifestyle') || p.includes('culture')) return <Coffee size={size} className={className} />;
    
    return <Activity size={size} className={className} />; // Default Fallback
};

const PestleChart = ({ data }) => {
    const d3ContainerRef = useRef();
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });

    // =====================================
    // MEMOIZED DATA
    // =====================================
    const chartData = useMemo(() => {
        if (!data?.length) return [];

        const pestleCounts = {};

        data.forEach((item) => {
            if (!item.pestle) return;
            pestleCounts[item.pestle] = (pestleCounts[item.pestle] || 0) + 1;
        });

        return Object.entries(pestleCounts)
            .map(([pestle, count]) => ({
                pestle,
                count,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8); // Top 8 PESTLE factors
    }, [data]);

    // =====================================
    // TOTAL
    // =====================================
    const totalCount = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.count, 0);
    }, [chartData]);

    const topSegment = chartData?.[0]?.pestle || '-';

    // =====================================
    // SHARED SCALES (React + D3 Sync)
    // =====================================
    const width = 950;
    const height = 220;
    const margin = { top: 20, right: 40, bottom: 40, left: 160 };

    const yScale = useMemo(() => {
        return d3.scaleBand()
            .domain(chartData.map((d) => d.pestle))
            .range([margin.top, height - margin.bottom])
            .padding(0.26);
    }, [chartData]);

    const xScale = useMemo(() => {
        const maxValue = d3.max(chartData, (d) => d.count) || 0;
        return d3.scaleLinear()
            .domain([0, maxValue * 1.1]) // 10% Headroom for end-labels
            .nice()
            .range([margin.left, width - margin.right]);
    }, [chartData]);

    // =====================================
    // CHART RENDERING (D3)
    // =====================================
    useEffect(() => {
        if (!chartData.length) return;

        // Target inner <g> to preserve React's <foreignObject> overlay elements
        const g = d3.select(d3ContainerRef.current);
        g.selectAll('*').remove();

        // =====================================
        // GRID
        // =====================================
        g.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(
                d3.axisBottom(xScale)
                    .ticks(5)
                    .tickSize(-height + margin.top + margin.bottom)
                    .tickFormat('')
            )
            .selectAll('line')
            .attr('stroke', 'var(--border)')
            .attr('stroke-dasharray', '4,4')
            .attr('opacity', 0.5);

        g.selectAll('.domain').remove();

        // =====================================
        // AXES
        // =====================================
        // Y Axis (Lines only, text removed for React icons)
        g.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).tickSize(0))
            .selectAll('text').remove();

        // X Axis (Values - Reduced to 11px)
        g.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(5).tickSize(0))
            .selectAll('text')
            .style('fill', 'var(--foreground-muted)')
            .style('font-size', '11px')
            .style('font-weight', '500')
            .attr('transform', 'translate(0,8)');

        // =====================================
        // COLORS
        // =====================================
        const colors = [
            '#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b',
            '#ef4444', '#ec4899', '#3b82f6', '#84cc16',
        ];

        // =====================================
        // HORIZONTAL BARS
        // =====================================
        const bars = g
            .selectAll('.bar')
            .data(chartData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', margin.left)
            .attr('y', (d) => yScale(d.pestle))
            .attr('height', yScale.bandwidth())
            .attr('width', 0) // Start width at 0 for animation
            .attr('rx', 6)
            .attr('fill', (d, i) => colors[i % colors.length])
            .style('cursor', 'pointer')
            .style('opacity', 0.85);

        // =====================================
        // ANIMATION
        // =====================================
        bars.transition()
            .duration(800)
            .delay((d, i) => i * 70)
            .attr('width', (d) => xScale(d.count) - margin.left);

        // =====================================
        // VALUE LABELS (Reduced to 11px)
        // =====================================
        g.selectAll('.value-label')
            .data(chartData)
            .enter()
            .append('text')
            .attr('x', margin.left)
            .attr('y', (d) => yScale(d.pestle) + yScale.bandwidth() / 2)
            .attr('dy', '0.35em')
            .style('fill', 'var(--foreground)')
            .style('font-size', '11px')
            .style('font-weight', '700')
            .style('opacity', 0)
            .text((d) => d.count)
            .transition()
            .duration(800)
            .delay((d, i) => i * 70)
            .attr('x', (d) => xScale(d.count) + 10)
            .style('opacity', 1);

        // =====================================
        // HOVER INTERACTIONS (Bars)
        // =====================================
        bars.on('mouseenter', function (event, d) {
            d3.select(this)
                .transition()
                .duration(150)
                .style('opacity', 1)
                .attr('stroke', 'var(--foreground)')
                .attr('stroke-width', 2);

            setTooltip({
                show: true,
                x: event.clientX,
                y: event.clientY,
                data: d,
            });
        })
        .on('mousemove', function (event) {
            setTooltip(prev => ({ ...prev, x: event.clientX, y: event.clientY }));
        })
        .on('mouseleave', function () {
            d3.select(this)
                .transition()
                .duration(150)
                .style('opacity', 0.85)
                .attr('stroke', 'none');

            setTooltip(prev => ({ ...prev, show: false }));
        });

    }, [chartData, xScale, yScale]);

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-[var(--surface)] p-5 shadow-xl transition-all duration-300 hover:shadow-2xl">
            
            {/* REACT PORTAL TOOLTIP (Stepped down font sizes) */}
            {tooltip.show && tooltip.data && (
                <div 
                    className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full pb-3"
                    style={{ left: tooltip.x, top: tooltip.y - 10 }}
                >
                    <div className="bg-[var(--surface-strong)] border app-border rounded-xl p-3 shadow-2xl flex flex-col gap-2 min-w-[180px]">
                        <div className="flex items-center gap-2.5 border-b app-border pb-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                                {getPestleIcon(tooltip.data.pestle, 16, "text-violet-500")}
                            </div>
                            <div className="font-bold text-[13px] app-text capitalize truncate max-w-[130px]">
                                {tooltip.data.pestle}
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                            <span className="text-[11px] text-[var(--foreground-muted)] uppercase tracking-wider font-semibold">Records</span>
                            <span className="font-bold text-foreground text-[13px]">{tooltip.data.count}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-[var(--foreground-muted)] uppercase tracking-wider font-semibold">Share</span>
                            <span className="font-bold text-violet-500 text-[13px]">
                                {((tooltip.data.count / totalCount) * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER (Stepped down font sizes) */}
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-violet-500 dark:text-violet-400">
                        <Sparkles size={12} />
                        Strategic Factors
                    </div>
                    <h2 className="text-xl font-bold app-text">
                        PESTLE Analysis
                    </h2>
                    <p className="mt-1 max-w-xl text-[13px] leading-5 app-text-muted">
                        Distribution of macro-environmental categories across the dataset.
                    </p>
                </div>
                <button className="flex items-center gap-2 rounded-xl border app-border bg-[var(--surface-strong)] px-4 py-2 text-[13px] font-medium app-text transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-500">
                    <FileText size={15} />
                    Generate Report
                </button>
            </div>

            {/* COMPACT STATS BOXES (Stepped down font sizes & Group hover) */}
            <div className="mb-5 grid grid-cols-1 gap-2 md:grid-cols-3">
                <div className="group cursor-pointer flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-2 transition-all hover:bg-[var(--surface-strong)]/60">
                    <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted transition-colors duration-300 group-hover:text-violet-500/80">Categories</span>
                    <span className="text-base font-bold app-text transition-colors duration-300 group-hover:text-violet-500">{chartData.length}</span>
                </div>

                <div className="group cursor-pointer flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-2 transition-all hover:bg-[var(--surface-strong)]/60">
                    <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted transition-colors duration-300 group-hover:text-cyan-500/80">Total Records</span>
                    <span className="text-base font-bold text-cyan-500 transition-colors duration-300 group-hover:brightness-125">{totalCount}</span>
                </div>

                <div className="group cursor-pointer flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-2 transition-all hover:bg-[var(--surface-strong)]/60 min-w-0">
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted transition-colors duration-300 group-hover:text-violet-500/80">Top Segment</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-violet-500 font-bold min-w-0 transition-colors duration-300 group-hover:brightness-125">
                        <div className="shrink-0">
                            {getPestleIcon(topSegment, 14, "text-violet-500")}
                        </div>
                        <span className="text-sm capitalize truncate max-w-[100px]">
                            {topSegment}
                        </span>
                    </div>
                </div>
            </div>

            {/* CHART */}
            <div className="rounded-2xl border app-border bg-[var(--surface-strong)]/20 p-3">
                <div className="w-full relative">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block">
                        
                        {/* D3 Structure Injected Here */}
                        <g ref={d3ContainerRef} />

                        {/* REACT Y-AXIS LABELS (Interactive Hover added here) */}
                        <g className="react-labels">
                            {chartData.map((item, index) => {
                                const yPos = yScale(item.pestle);
                                const bandHeight = yScale.bandwidth();
                                
                                return (
                                    <foreignObject
                                        key={index}
                                        x={0}
                                        y={yPos}
                                        width={margin.left - 10}
                                        height={bandHeight}
                                    >
                                        <div 
                                            xmlns="http://www.w3.org/1999/xhtml" 
                                            // 1. Added group and cursor-pointer classes
                                            className="group flex items-center justify-end h-full gap-2.5 w-full cursor-pointer"
                                            
                                            // 2. Added Mouse events to trigger the chart tooltip
                                            onMouseMove={(e) => {
                                                setTooltip({
                                                    show: true,
                                                    x: e.clientX,
                                                    y: e.clientY - 15,
                                                    data: item
                                                });
                                            }}
                                            onMouseLeave={() => {
                                                setTooltip(prev => ({ ...prev, show: false }));
                                            }}
                                        >
                                            {/* 3. Icon turns violet on hover */}
                                            <div className="flex items-center justify-center text-[var(--foreground-muted)] shadow-sm transition-colors duration-200 group-hover:text-violet-500">
                                                {getPestleIcon(item.pestle, 14)}
                                            </div>
                                            {/* 4. Text drops to 11px and turns violet on hover */}
                                            <span className="text-[11px] font-semibold text-[var(--foreground)] capitalize truncate text-right transition-colors duration-200 group-hover:text-violet-500">
                                                {item.pestle}
                                            </span>
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

export default PestleChart;