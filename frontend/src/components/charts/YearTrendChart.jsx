import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import {
    CalendarRange,
    Sparkles,
    TrendingUp,
} from 'lucide-react';

const YearTrendChart = ({ data }) => {
    const svgRef = useRef();

    // =====================================
    // MEMOIZED DATA
    // =====================================
    const chartData = useMemo(() => {
        if (!data?.length) return [];

        const yearCounts = {};

        data.forEach((item) => {
            if (!item.end_year || isNaN(item.end_year)) return;
            yearCounts[item.end_year] = (yearCounts[item.end_year] || 0) + 1;
        });

        let processed = Object.entries(yearCounts)
            .map(([year, count]) => ({
                year: Number(year),
                count,
            }))
            .sort((a, b) => a.year - b.year);

        // Prevent single-point chart issues
        if (processed.length === 1) {
            processed = [
                { year: processed[0].year - 1, count: 0 },
                ...processed,
                { year: processed[0].year + 1, count: 0 },
            ];
        }

        return processed;
    }, [data]);

    // =====================================
    // STATS
    // =====================================
    const totalRecords = data?.length || 0;

    const latestYear = chartData.length > 0
        ? Math.max(...chartData.map((d) => d.year))
        : 'N/A';

    const peakYear = chartData.length > 0
        ? chartData.reduce((a, b) => (a.count > b.count ? a : b)).year
        : 'N/A';

    // =====================================
    // CHART
    // =====================================
    useEffect(() => {
        if (!chartData.length) return;

        d3.select(svgRef.current).selectAll('*').remove();
        d3.selectAll('.trend-tooltip').remove();

        // =====================================
        // DIMENSIONS
        // =====================================
        const width = 950;
        const height = 400; // Slightly reduced height to match the compact stats
        const margin = { top: 30, right: 30, bottom: 50, left: 60 };

        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('width', '100%')
            .style('height', 'auto');

        // =====================================
        // GRADIENT
        // =====================================
        const defs = svg.append('defs');
        const gradient = defs
            .append('linearGradient')
            .attr('id', 'trend-gradient')
            .attr('x1', '0%').attr('y1', '0%')
            .attr('x2', '0%').attr('y2', '100%');

        gradient.append('stop').attr('offset', '0%').attr('stop-color', '#f59e0b').attr('stop-opacity', 0.25);
        gradient.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b').attr('stop-opacity', 0);

        // =====================================
        // SCALES
        // =====================================
        const xScale = d3
            .scaleLinear()
            .domain(d3.extent(chartData, (d) => d.year))
            .range([margin.left, width - margin.right]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(chartData, (d) => d.count)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // =====================================
        // GRID
        // =====================================
        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(5).tickSize(-width + margin.left + margin.right).tickFormat(''))
            .selectAll('line')
            .attr('stroke', 'var(--border)')
            .attr('stroke-dasharray', '4,4')
            .attr('opacity', 0.5);

        svg.selectAll('.domain').remove();

        // =====================================
        // AXES
        // =====================================
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(Math.min(chartData.length, 8)).tickSize(0))
            .selectAll('text')
            .style('fill', 'var(--foreground-muted)')
            .style('font-size', '12px')
            .style('font-weight', '500')
            .attr('transform', 'translate(0, 8)');

        svg.append('g')
            .attr('transform', `translate(${margin.left - 10},0)`)
            .call(d3.axisLeft(yScale).ticks(5).tickSize(0))
            .selectAll('text')
            .style('fill', 'var(--foreground-muted)')
            .style('font-size', '12px')
            .style('font-weight', '500');

        // =====================================
        // AREA
        // =====================================
        const area = d3
            .area()
            .x((d) => xScale(d.year))
            .y0(height - margin.bottom)
            .y1((d) => yScale(d.count))
            .curve(d3.curveMonotoneX);

        svg.append('path')
            .datum(chartData)
            .attr('fill', 'url(#trend-gradient)')
            .attr('opacity', 0)
            .attr('d', area)
            .transition()
            .duration(700)
            .attr('opacity', 1);

        // =====================================
        // LINE
        // =====================================
        const line = d3
            .line()
            .x((d) => xScale(d.year))
            .y((d) => yScale(d.count))
            .curve(d3.curveMonotoneX);

        const linePath = svg.append('path')
            .datum(chartData)
            .attr('fill', 'none')
            .attr('stroke', '#f59e0b')
            .attr('stroke-width', 3)
            .attr('stroke-linecap', 'round')
            .attr('d', line);

        const pathLength = linePath.node().getTotalLength();

        linePath
            .attr('stroke-dasharray', pathLength)
            .attr('stroke-dashoffset', pathLength)
            .transition()
            .duration(1200)
            .ease(d3.easeCubicOut)
            .attr('stroke-dashoffset', 0);

        // =====================================
        // TOOLTIP (THEME AWARE)
        // =====================================
        const tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'trend-tooltip')
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
        // POINTS
        // =====================================
        const points = svg
            .selectAll('.point')
            .data(chartData)
            .enter()
            .append('circle')
            .attr('cx', (d) => xScale(d.year))
            .attr('cy', (d) => yScale(d.count))
            .attr('r', 0)
            .attr('fill', '#f59e0b')
            .attr('stroke', 'var(--surface)') // Fix: Matches theme background
            .attr('stroke-width', 2.5)
            .style('cursor', 'pointer');

        points.transition()
            .duration(500)
            .delay((d, i) => i * 60)
            .attr('r', 5);

        // HOVER
        points.on('mouseenter', function (event, d) {
            d3.select(this).transition().duration(150).attr('r', 8);

            tooltip
                .style('opacity', 1)
                .html(`
                    <div style="font-weight:700; font-size:13px; margin-bottom:6px; color:var(--foreground);">
                        Year ${d.year}
                    </div>
                    <div style="display:flex; justify-content:space-between; gap:18px; color:var(--foreground-muted); font-size:12px;">
                        <span>Records</span>
                        <strong style="color:#f59e0b;">${d.count}</strong>
                    </div>
                `);
        })
        .on('mousemove', function (event) {
            tooltip
                .style('left', `${event.pageX + 15}px`)
                .style('top', `${event.pageY - 40}px`);
        })
        .on('mouseleave', function () {
            d3.select(this).transition().duration(150).attr('r', 5);
            tooltip.style('opacity', 0);
        });

        return () => {
            d3.selectAll('.trend-tooltip').remove();
        };

    }, [chartData]);

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-surface p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
            
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-400">
                        <Sparkles size={14} />
                        Time Series Analytics
                    </div>
                    <h2 className="text-2xl font-bold app-text">
                        Year Trend Analysis
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 app-text-muted">
                        Historical progression and yearly distribution trends across the dataset.
                    </p>
                </div>

                <button className="flex items-center gap-2 rounded-2xl border app-border bg-surface-strong px-5 py-3 text-sm font-medium app-text transition-all duration-300 hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500">
                    <TrendingUp size={16} />
                    Forecast Trends
                </button>
            </div>

            {/* COMPACT STATS BOXES */}
            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                
                <div className="flex items-center justify-between rounded-xl border app-border bg-surface-strong/40 px-4 py-2.5 transition-all hover:bg-surface-strong/60">
                    <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Total Records</span>
                    <span className="text-lg font-bold app-text">{totalRecords.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border app-border bg-surface-strong/40 px-4 py-2.5 transition-all hover:bg-surface-strong/60">
                    <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Latest Year</span>
                    <span className="text-lg font-bold text-amber-500">{latestYear}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border app-border bg-surface-strong/40 px-4 py-2.5 transition-all hover:bg-surface-strong/60">
                    <div className="flex items-center gap-2">
                        <CalendarRange size={14} className="text-emerald-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Peak Activity</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-500">{peakYear}</span>
                </div>

            </div>

            {/* CHART */}
            <div className="rounded-3xl border app-border bg-surface-strong/20 p-4">
                <div className="w-full">
                    <svg ref={svgRef} className="w-full h-auto" />
                </div>
            </div>
            
        </div>
    );
};

export default YearTrendChart;