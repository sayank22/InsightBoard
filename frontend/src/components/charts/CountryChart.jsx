import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import {
    Globe,
    MapPinned,
    Sparkles,
    TrendingUp,
} from 'lucide-react';

const CountryChart = ({ data }) => {
    const svgRef = useRef();

    // =====================================
    // MEMOIZED DATA
    // =====================================
    const chartData = useMemo(() => {
        if (!data?.length) return [];

        const countryCounts = {};

        data.forEach((item) => {
            if (!item.country) return;
            countryCounts[item.country] = (countryCounts[item.country] || 0) + 1;
        });

        return Object.entries(countryCounts)
            .map(([country, count]) => ({
                country,
                count,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8); // Top 8 Countries
    }, [data]);

    // =====================================
    // TOTAL
    // =====================================
    const totalRecords = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.count, 0);
    }, [chartData]);

    const topCountry = chartData?.[0]?.country || '-';

    // =====================================
    // CHART
    // =====================================
    useEffect(() => {
        if (!chartData.length) return;

        d3.select(svgRef.current).selectAll('*').remove();
        d3.selectAll('.country-tooltip').remove();

        // =====================================
        // DIMENSIONS
        // =====================================
        const width = 920;
        const height = 450; // Reduced for compact layout
        const margin = { top: 20, right: 40, bottom: 40, left: 180 }; // Left margin for long country names

        // =====================================
        // SVG
        // =====================================
        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('width', '100%')
            .style('height', 'auto');

        // =====================================
        // SCALES (Horizontal Bar Chart)
        // =====================================
        const yScale = d3
            .scaleBand()
            .domain(chartData.map((d) => d.country))
            .range([margin.top, height - margin.bottom])
            .padding(0.26);

        const maxValue = d3.max(chartData, (d) => d.count);

        const xScale = d3
            .scaleLinear()
            .domain([0, maxValue])
            .nice()
            .range([margin.left, width - margin.right]);

        // =====================================
        // GRID
        // =====================================
        svg.append('g')
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

        svg.selectAll('.domain').remove();

        // =====================================
        // AXES
        // =====================================
        // Y Axis (Countries)
        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).tickSize(0))
            .selectAll('text')
            .style('fill', 'var(--foreground)')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .attr('dx', '-8');

        // X Axis (Values)
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(5).tickSize(0))
            .selectAll('text')
            .style('fill', 'var(--foreground-muted)')
            .style('font-size', '12px')
            .style('font-weight', '500')
            .attr('transform', 'translate(0,8)');

        // =====================================
        // TOOLTIP
        // =====================================
        const tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'country-tooltip')
            .style('position', 'absolute')
            .style('opacity', 0)
            .style('pointer-events', 'none')
            .style('background', 'var(--surface-strong)')
            .style('border', '1px solid var(--border)')
            .style('border-radius', '12px')
            .style('padding', '12px 14px')
            .style('color', 'var(--foreground)')
            .style('font-size', '13px')
            .style('box-shadow', '0 10px 25px -5px rgba(0,0,0,0.1)')
            .style('z-index', '50');

        // =====================================
        // COLORS
        // =====================================
        const colors = [
            '#0ea5e9', // Sky 500
            '#8b5cf6', // Violet 500
            '#10b981', // Emerald 500
            '#f59e0b', // Amber 500
            '#ef4444', // Red 500
            '#ec4899', // Pink 500
            '#3b82f6', // Blue 500
            '#84cc16', // Lime 500
        ];

        // =====================================
        // BARS
        // =====================================
        const bars = svg
            .selectAll('.bar')
            .data(chartData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', margin.left)
            .attr('y', (d) => yScale(d.country))
            .attr('height', yScale.bandwidth())
            .attr('width', 0) // Start width at 0 for animation
            .attr('rx', 8)
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
        // VALUE LABELS (Inside/End of Bars)
        // =====================================
        svg.selectAll('.value-label')
            .data(chartData)
            .enter()
            .append('text')
            .attr('x', (d) => xScale(d.count) + 12)
            .attr('y', (d) => yScale(d.country) + yScale.bandwidth() / 2)
            .attr('dy', '0.35em')
            .style('fill', 'var(--foreground)')
            .style('font-size', '12px')
            .style('font-weight', '700')
            .style('opacity', 0)
            .text((d) => d.count)
            .transition()
            .duration(500)
            .delay((d, i) => i * 70 + 400)
            .style('opacity', 1);

        // =====================================
        // HOVER
        // =====================================
        bars.on('mouseenter', function (event, d) {
            d3.select(this)
                .transition()
                .duration(150)
                .style('opacity', 1)
                .attr('stroke', 'var(--foreground)')
                .attr('stroke-width', 2);

            const percentage = ((d.count / totalRecords) * 100).toFixed(1);

            tooltip
                .style('opacity', 1)
                .html(`
                    <div style="font-weight:700; font-size:13px; margin-bottom:8px; border-bottom:1px solid var(--border); padding-bottom:6px;">
                        ${d.country}
                    </div>
                    <div style="display:grid; grid-template-columns:auto auto; gap:6px 16px; color:var(--foreground-muted);">
                        <span>Records</span>
                        <strong style="color:var(--foreground);">${d.count}</strong>
                        <span>Share</span>
                        <strong style="color:var(--foreground);">${percentage}%</strong>
                    </div>
                `);
        })
        .on('mousemove', function (event) {
            tooltip
                .style('left', `${event.pageX + 15}px`)
                .style('top', `${event.pageY - 40}px`);
        })
        .on('mouseleave', function () {
            d3.select(this)
                .transition()
                .duration(150)
                .style('opacity', 0.85)
                .attr('stroke', 'none');

            tooltip.style('opacity', 0);
        });

        return () => {
            d3.selectAll('.country-tooltip').remove();
        };

    }, [chartData, totalRecords]);

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-surface p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
            
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                        <Sparkles size={14} />
                        Global Analytics
                    </div>

                    <h2 className="text-2xl font-bold app-text">
                        Country Distribution
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 app-text-muted">
                        Top countries contributing the highest number of records in the dataset.
                    </p>
                </div>

                <button className="flex items-center gap-2 rounded-2xl border app-border bg-surface-strong px-5 py-3 text-sm font-medium app-text transition-all duration-300 hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-500">
                    <TrendingUp size={16} />
                    Global Insights
                </button>
            </div>

            {/* COMPACT STATS BOXES */}
            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="flex items-center justify-between rounded-xl border app-border bg-surface-strong/40 px-4 py-2.5 transition-all hover:bg-surface-strong/60">
                    <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Countries</span>
                    <span className="text-lg font-bold app-text">{chartData.length}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border app-border bg-surface-strong/40 px-4 py-2.5 transition-all hover:bg-surface-strong/60">
                    <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Total Records</span>
                    <span className="text-lg font-bold text-sky-500">{totalRecords}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border app-border bg-surface-strong/40 px-4 py-2.5 transition-all hover:bg-surface-strong/60">
                    <div className="flex items-center gap-2">
                        <MapPinned size={14} className="text-emerald-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Leading</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-500">
                        {topCountry.length > 12 ? `${topCountry.slice(0, 12)}...` : topCountry}
                    </span>
                </div>
            </div>

            {/* CHART */}
            <div className="rounded-3xl border app-border bg-surface-strong/20 p-4">
                <div className="w-full">
                    {/* SVG scales naturally without overflow wrapping */}
                    <svg ref={svgRef} className="w-full h-auto block" />
                </div>
            </div>
        </div>
    );
};

export default CountryChart;