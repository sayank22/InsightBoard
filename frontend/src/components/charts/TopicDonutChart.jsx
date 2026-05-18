import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
    Sparkles,
    TrendingUp,
    Flame,         // Gas
    Droplet,       // Oil
    Factory,       // Production
    Send,          // Export
    Zap,           // Energy
    HelpCircle     // Default Fallback
} from 'lucide-react';

// =====================================
// DYNAMIC TOPIC ICON MAPPER
// =====================================
const getTopicIcon = (topic, size = 16, className = "") => {
    const t = topic?.toLowerCase() || '';
    if (t.includes('gas')) return <Flame size={size} className={className} />;
    if (t.includes('oil')) return <Droplet size={size} className={className} />;
    if (t.includes('production')) return <Factory size={size} className={className} />;
    if (t.includes('export')) return <Send size={size} className={className} />;
    if (t.includes('energy')) return <Zap size={size} className={className} />;
    if (t.includes('growth')) return <TrendingUp size={size} className={className} />;
    return <HelpCircle size={size} className={className} />;
};

const CHART_COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

// Helper to create safe CSS class names from topics
const getSafeClassName = (str) => 'slice-' + str.replace(/[^a-zA-Z0-9]/g, '-');

const TopicDonutChart = ({ data }) => {
    const svgRef = useRef();
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });

    // =====================================
    // MEMOIZED DATA
    // =====================================
    const chartData = useMemo(() => {
        if (!data?.length) return [];
        const topicCounts = {};
        data.forEach((item) => {
            if (!item.topic) return;
            topicCounts[item.topic] = (topicCounts[item.topic] || 0) + 1;
        });
        return Object.entries(topicCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([topic, count]) => ({ topic, count }));
    }, [data]);

    const totalRecords = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.count, 0);
    }, [chartData]);

    // const dominantTopic = chartData?.[0]?.topic || '-';

    const colorScale = useMemo(() => {
        return d3.scaleOrdinal().domain(chartData.map(d => d.topic)).range(CHART_COLORS);
    }, [chartData]);

    // Shared Arc calculations for both D3 init and React Legend Hover
    const radius = Math.min(280, 280) / 2 - 10;
    const arc = useMemo(() => d3.arc().innerRadius(radius * 0.65).outerRadius(radius * 0.95), [radius]);
    const hoverArc = useMemo(() => d3.arc().innerRadius(radius * 0.65).outerRadius(radius * 1.02), [radius]);

    // =====================================
    // LEGEND HOVER HANDLERS (React -> D3)
    // =====================================
    const handleLegendEnter = (item) => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        const sliceClass = `.${getSafeClassName(item.topic)}`;

        // Dim all slices, expand the active one
        svg.selectAll('.slice').transition().duration(180).style('opacity', 0.2);
        svg.select(sliceClass).transition().duration(180).attr('d', hoverArc).style('opacity', 1);

        // Update Center Text
        const percentage = ((item.count / totalRecords) * 100).toFixed(1);
        svg.select('.center-value').text(`${percentage}%`);
        svg.select('.center-label').text('Share');
    };

    const handleLegendLeave = () => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);

        // Restore all slices
        svg.selectAll('.slice').transition().duration(180).attr('d', arc).style('opacity', 1);

        // Restore Center Text
        svg.select('.center-value').text(totalRecords);
        svg.select('.center-label').text('Total');
    };

    // =====================================
    // CHART RENDERING (D3)
    // =====================================
    useEffect(() => {
        if (!chartData.length) return;
        d3.select(svgRef.current).selectAll('*').remove();

        const width = 280;
        const height = 280;

        const svg = d3.select(svgRef.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('width', '100%')
            .style('height', 'auto')
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const pie = d3.pie().value((d) => d.count).sort(null);
        const pieData = pie(chartData);

        // CENTER CIRCLE
        svg.append('circle')
            .attr('r', radius * 0.50)
            .attr('fill', 'var(--surface-strong)')
            .attr('stroke', 'var(--border)')
            .attr('stroke-width', 1)
            .style('filter', 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))');

        // CENTER TEXT (With specific classes for legend updating)
        const centerValue = svg.append('text')
            .attr('class', 'center-value')
            .attr('text-anchor', 'middle')
            .attr('y', -2)
            .style('fill', 'var(--foreground)')
            .style('font-size', '26px')
            .style('font-weight', '800')
            .text(totalRecords);

        const centerLabel = svg.append('text')
            .attr('class', 'center-label')
            .attr('text-anchor', 'middle')
            .attr('y', 20)
            .style('fill', 'var(--foreground-muted)')
            .style('font-size', '11px')
            .style('font-weight', '600')
            .style('text-transform', 'uppercase')
            .style('letter-spacing', '0.05em')
            .text('Total');

        // SLICES
        const slices = svg.selectAll('.slice')
            .data(pieData)
            .enter()
            .append('path')
            .attr('class', (d) => `slice ${getSafeClassName(d.data.topic)}`) // Add unique class
            .attr('fill', (d) => colorScale(d.data.topic))
            .attr('stroke', 'var(--surface)') 
            .attr('stroke-width', 3)
            .style('cursor', 'pointer')
            .attr('d', arc);

        slices.attr('opacity', 0).transition().duration(700).delay((d, i) => i * 70).attr('opacity', 1);

        // D3 NATIVE HOVER
        slices
            .on('mouseenter', function (event, d) {
                // Dim others
                svg.selectAll('.slice').transition().duration(180).style('opacity', 0.2);
                // Expand self
                d3.select(this).transition().duration(180).attr('d', hoverArc).style('opacity', 1);

                const percentage = ((d.data.count / totalRecords) * 100).toFixed(1);
                centerValue.text(`${percentage}%`);
                centerLabel.text('Share');

                setTooltip({ show: true, x: event.clientX, y: event.clientY, data: { ...d.data, percentage } });
            })
            .on('mousemove', function (event) {
                setTooltip(prev => ({ ...prev, x: event.clientX, y: event.clientY }));
            })
            .on('mouseleave', function () {
                // Restore all
                svg.selectAll('.slice').transition().duration(180).attr('d', arc).style('opacity', 1);
                centerValue.text(totalRecords);
                centerLabel.text('Total');
                setTooltip(prev => ({ ...prev, show: false }));
            });

    }, [chartData, totalRecords, colorScale, arc, hoverArc, radius]);

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
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm" style={{ backgroundColor: colorScale(tooltip.data.topic) }}>
                                {getTopicIcon(tooltip.data.topic, 20)}
                            </div>
                            <div className="font-bold text-sm app-text capitalize truncate max-w-[140px]">{tooltip.data.topic}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-semibold">Records</span>
                            <span className="font-bold text-foreground text-base">{tooltip.data.count}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-semibold">Share</span>
                            <span className="font-bold text-sm" style={{ color: colorScale(tooltip.data.topic) }}>{tooltip.data.percentage}%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-500">
                        <Sparkles size={12} /> Topic Analytics
                    </div>
                    <h2 className="text-xl font-bold app-text">Topic Distribution</h2>
                </div>
                <button className="flex items-center gap-2 rounded-xl border app-border bg-[var(--surface-strong)] px-4 py-2 text-xs font-medium app-text transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-500">
                    <TrendingUp size={14} /> View Trends
                </button>
            </div>

            {/* CHART & LEGEND CONTAINER */}
            <div className="rounded-3xl border app-border bg-[var(--surface-strong)]/20 p-5">
                {/* Minimized gap here (gap-4 lg:gap-6 instead of 8) */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-6">
                    
                    {/* SVG Chart */}
                    <div className="w-full max-w-[220px] shrink-0">
                        <svg ref={svgRef} className="mx-auto block w-full h-auto" />
                    </div>

                    {/* Interactive Legend */}
                    <div className="w-full flex-1 flex flex-col gap-2 min-w-[140px]">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)] mb-1 pl-1">
                            Dataset Breakdown
                        </h4>
                        
                        {chartData.map((item, index) => {
                            const hexColor = colorScale(item.topic);
                            return (
                                <div 
                                    key={index} 
                                    onMouseEnter={() => handleLegendEnter(item)}
                                    onMouseLeave={handleLegendLeave}
                                    className="group flex items-center justify-between rounded-xl border border-transparent bg-[var(--surface)] px-3 py-2 shadow-sm transition-all duration-300 hover:border-[var(--border)] hover:bg-[var(--surface-strong)]/50 hover:shadow-md cursor-pointer"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-3 w-3 rounded-full shadow-sm transition-transform duration-300 group-hover:scale-125" style={{ backgroundColor: hexColor }} />
                                        <div style={{ color: hexColor }} className="opacity-80 transition-opacity group-hover:opacity-100">
                                            {getTopicIcon(item.topic, 14)}
                                        </div>
                                        <span className="text-xs font-bold capitalize app-text truncate max-w-[120px]">
                                            {item.topic}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default TopicDonutChart;