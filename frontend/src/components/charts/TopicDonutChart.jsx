import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import {
    Activity,
    Layers3,
    Sparkles,
    TrendingUp,
} from 'lucide-react';

const TopicDonutChart = ({ data }) => {
    const svgRef = useRef();

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

    // =====================================
    // CHART
    // =====================================
    useEffect(() => {
        if (!chartData.length) return;

        d3.select(svgRef.current).selectAll('*').remove();
        d3.selectAll('.topic-tooltip').remove();

        // =====================================
        // DIMENSIONS
        // =====================================
        const width = 460;
        const height = 460;
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
        // Inner circle matches the surface background
        svg.append('circle')
            .attr('r', radius * 0.48)
            .attr('fill', 'var(--surface)')
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
        // TOOLTIP (Theme Aware)
        // =====================================
        const tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'topic-tooltip')
            .style('position', 'absolute')
            .style('opacity', 0)
            .style('pointer-events', 'none')
            .style('background', 'var(--surface-strong)')
            .style('border', '1px solid var(--border)')
            .style('border-radius', '14px')
            .style('padding', '12px 14px')
            .style('color', 'var(--foreground)')
            .style('font-size', '12px')
            .style('box-shadow', '0 10px 30px rgba(0,0,0,0.15)')
            .style('z-index', '50');

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
            .attr('stroke', 'var(--surface)') // Matches background exactly
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
        // HOVER
        // =====================================
        slices
            .on('mouseenter', function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(180)
                    .attr('d', hoverArc);

                const percentage = ((d.data.count / totalRecords) * 100).toFixed(1);

                centerValue.text(`${percentage}%`);
                centerLabel.text(
                    d.data.topic.length > 16
                        ? `${d.data.topic.slice(0, 16)}...`
                        : d.data.topic
                );

                tooltip
                    .style('opacity', 1)
                    .html(`
                        <div style="font-weight:700; margin-bottom:8px; font-size:13px; text-transform:capitalize; border-bottom:1px solid var(--border); padding-bottom:6px;">
                            ${d.data.topic}
                        </div>
                        <div style="display:flex; justify-content:space-between; gap:20px; color:var(--foreground-muted);">
                            <span>Records</span>
                            <strong style="color:var(--foreground);">${d.data.count}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; gap:20px; color:var(--foreground-muted); margin-top:4px;">
                            <span>Share</span>
                            <strong style="color:var(--foreground);">${percentage}%</strong>
                        </div>
                    `);
            })
            .on('mousemove', function (event) {
                tooltip
                    .style('left', `${event.pageX + 14}px`)
                    .style('top', `${event.pageY - 28}px`);
            })
            .on('mouseleave', function () {
                d3.select(this)
                    .transition()
                    .duration(180)
                    .attr('d', arc);

                centerValue.text(totalRecords);
                centerLabel.text('Total Topics');

                tooltip.style('opacity', 0);
            });

        return () => {
            d3.selectAll('.topic-tooltip').remove();
        };

    }, [chartData, totalRecords]);

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-surface p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
            
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

                <button className="flex items-center gap-2 rounded-2xl border app-border bg-surface-strong px-5 py-3 text-sm font-medium app-text transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-500">
                    <TrendingUp size={16} />
                    View Trends
                </button>
            </div>

            {/* COMPACT STATS BOXES */}
            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="flex items-center justify-between rounded-xl border app-border bg-surface-strong/40 px-4 py-2.5 transition-all hover:bg-surface-strong/60">
                    <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Total Topics</span>
                    <span className="text-lg font-bold app-text">{chartData.length}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border app-border bg-surface-strong/40 px-4 py-2.5 transition-all hover:bg-surface-strong/60">
                    <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Avg Records</span>
                    <span className="text-lg font-bold text-cyan-500">
                        {chartData.length > 0 ? (totalRecords / chartData.length).toFixed(1) : 0}
                    </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border app-border bg-surface-strong/40 px-4 py-2.5 transition-all hover:bg-surface-strong/60">
                    <div className="flex items-center gap-2">
                        <Activity size={14} className="text-violet-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Dominant</span>
                    </div>
                    <span className="text-lg font-bold text-violet-500">
                        {chartData?.[0]?.topic ? (
                            chartData[0].topic.length > 10 ? `${chartData[0].topic.slice(0, 10)}...` : chartData[0].topic
                        ) : '-'}
                    </span>
                </div>
            </div>

            {/* CHART */}
            <div className="rounded-3xl border app-border bg-surface-strong/20 p-4">
                <div className="w-full">
                    {/* Max width set to prevent the donut from getting massive on ultrawide screens */}
                    <svg ref={svgRef} className="mx-auto block w-full max-w-[460px] h-auto" />
                </div>
            </div>

        </div>
    );
};

export default TopicDonutChart;