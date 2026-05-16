import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
    Activity,
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
            .slice(0, 6) // Shows top 6 topics
            .map(([topic, count]) => ({
                topic,
                count,
            }));
    }, [data]);

    // =====================================
    // TOTAL
    // =====================================
    const totalRecords = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.count, 0);
    }, [chartData]);

    const dominantTopic = chartData?.[0]?.topic || '-';

    // =====================================
    // CHART RENDERING (D3)
    // =====================================
    useEffect(() => {
        if (!chartData.length) return;

        d3.select(svgRef.current).selectAll('*').remove();

        // =====================================
        // DIMENSIONS
        // =====================================
        const width = 460;
        const height = 320;
        const radius = Math.min(width, height) / 2 - 25;

        // =====================================
        // SVG
        // =====================================
        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('width', '100%')
            .style('height', 'auto')
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // =====================================
        // COLORS
        // =====================================
        const colors = [
            '#06b6d4', '#8b5cf6', '#10b981', 
            '#f59e0b', '#ef4444', '#ec4899',
        ];

        const colorScale = d3
            .scaleOrdinal()
            .domain(chartData.map((d) => d.topic))
            .range(colors);

        // =====================================
        // PIE
        // =====================================
        const pie = d3.pie().value((d) => d.count).sort(null);
        const pieData = pie(chartData);

        // =====================================
        // ARCS
        // =====================================
        const arc = d3
            .arc()
            .innerRadius(radius * 0.62)
            .outerRadius(radius * 0.9);

        const hoverArc = d3
            .arc()
            .innerRadius(radius * 0.62)
            .outerRadius(radius * 0.96);

        // =====================================
        // CENTER (Theme Aware)
        // =====================================
        svg.append('circle')
            .attr('r', radius * 0.48)
            .attr('fill', 'var(--surface-strong)')
            .attr('stroke', 'var(--border)')
            .attr('stroke-width', 1);

        const centerValue = svg
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('y', -8)
            .style('fill', 'var(--foreground)')
            .style('font-size', '34px')
            .style('font-weight', '800')
            .text(totalRecords);

        const centerLabel = svg
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('y', 22)
            .style('fill', 'var(--foreground-muted)')
            .style('font-size', '13px')
            .style('font-weight', '600')
            .text('Total Topics');

        // =====================================
        // SLICES
        // =====================================
        const slices = svg
            .selectAll('.slice')
            .data(pieData)
            .enter()
            .append('path')
            .attr('class', 'slice')
            .attr('fill', (d) => colorScale(d.data.topic))
            .attr('stroke', 'var(--surface)') 
            .attr('stroke-width', 3)
            .style('cursor', 'pointer')
            .attr('d', arc);

        // =====================================
        // ENTRY ANIMATION
        // =====================================
        slices
            .attr('opacity', 0)
            .transition()
            .duration(700)
            .delay((d, i) => i * 70)
            .attr('opacity', 1);

        // =====================================
        // HOVER INTERACTIONS (React Tooltip)
        // =====================================
        slices
            .on('mouseenter', function (event, d) {
                // Animate D3 Slice
                d3.select(this).transition().duration(180).attr('d', hoverArc);

                const percentage = ((d.data.count / totalRecords) * 100).toFixed(1);

                // Update D3 Center Text dynamically
                centerValue.text(`${percentage}%`);
                centerLabel.text(
                    d.data.topic.length > 16
                        ? `${d.data.topic.slice(0, 16)}...`
                        : d.data.topic
                );

                // Trigger React Tooltip
                setTooltip({
                    show: true,
                    x: event.clientX,
                    y: event.clientY,
                    data: { ...d.data, percentage }
                });
            })
            .on('mousemove', function (event) {
                setTooltip(prev => ({ ...prev, x: event.clientX, y: event.clientY }));
            })
            .on('mouseleave', function () {
                // Restore D3 Slice
                d3.select(this).transition().duration(180).attr('d', arc);

                // Restore D3 Center Text
                centerValue.text(totalRecords);
                centerLabel.text('Total Topics');

                // Hide Tooltip
                setTooltip(prev => ({ ...prev, show: false }));
            });

    }, [chartData, totalRecords]);

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
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                                {getTopicIcon(tooltip.data.topic, 20, "text-violet-500")}
                            </div>
                            <div className="font-bold text-sm app-text capitalize truncate max-w-[140px]">
                                {tooltip.data.topic}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-semibold">Records</span>
                            <span className="font-bold text-foreground text-base">{tooltip.data.count}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-semibold">Share</span>
                            <span className="font-bold text-violet-500 text-sm">{tooltip.data.percentage}%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-500 dark:text-violet-400">
                        <Sparkles size={14} />
                        Topic Analytics
                    </div>

                    <h2 className="text-2xl font-bold app-text">
                        Topic Distribution
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 app-text-muted">
                        Most dominant topics contributing to the dataset. Hover slices for details.
                    </p>
                </div>

                <button className="flex items-center gap-2 rounded-2xl border app-border bg-[var(--surface-strong)] px-5 py-3 text-sm font-medium app-text transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-500">
                    <TrendingUp size={16} />
                    View Trends
                </button>
            </div>

            {/* COMPACT STATS BOXES WITH ICON */}
            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-4 py-2.5 transition-all hover:bg-[var(--surface-strong)]/60">
                    <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Total Topics</span>
                    <span className="text-lg font-bold app-text">{chartData.length}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-4 py-2.5 transition-all hover:bg-[var(--surface-strong)]/60">
                    <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Avg Records</span>
                    <span className="text-lg font-bold text-cyan-500">
                        {chartData.length > 0 ? (totalRecords / chartData.length).toFixed(1) : 0}
                    </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-4 py-2.5 transition-all hover:bg-[var(--surface-strong)]/60">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Dominant</span>
                    </div>
                    <div className="flex items-center gap-2 text-violet-500 font-bold">
                        {getTopicIcon(dominantTopic, 16, "text-violet-500")}
                        <span className="text-lg capitalize truncate max-w-[110px]">
                            {dominantTopic !== '-' ? dominantTopic : '-'}
                        </span>
                    </div>
                </div>
            </div>

            {/* CHART */}
            <div className="rounded-3xl border app-border bg-[var(--surface-strong)]/20 p-4">
                <div className="w-full">
                    {/* Max width set to prevent the donut from getting massive on ultrawide screens */}
                    <svg ref={svgRef} className="mx-auto block w-full max-w-[460px] h-auto" />
                </div>
            </div>

        </div>
    );
};

export default TopicDonutChart;