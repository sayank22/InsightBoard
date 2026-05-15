import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import {
    Activity,
    Sparkles,
    TrendingUp,
} from 'lucide-react';

const IntensityBarChart = ({ data }) => {
    const svgRef = useRef();

    // =====================================
    // MEMOIZED DATA
    // =====================================
    const chartData = useMemo(() => {
        if (!data?.length) return [];

        const sectorMap = {};

        data.forEach((item) => {
            if (!item.sector) return;

            if (!sectorMap[item.sector]) {
                sectorMap[item.sector] = {
                    total: 0,
                    count: 0,
                };
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
            .slice(0, 8);
    }, [data]);

    // =====================================
    // AVERAGE
    // =====================================
    const overallAverage = useMemo(() => {
        if (!chartData.length) return 0;

        return (
            chartData.reduce(
                (sum, item) => sum + item.avgIntensity,
                0
            ) / chartData.length
        ).toFixed(1);
    }, [chartData]);

    // =====================================
    // CHART
    // =====================================
    useEffect(() => {
        if (!chartData.length) return;

        d3.select(svgRef.current).selectAll('*').remove();
        d3.selectAll('.intensity-tooltip').remove();

        // =====================================
        // DIMENSIONS
        // =====================================
        const width = 920;
        const height = 450; // Slightly reduced to match the compact stats layout
        const margin = { top: 30, right: 30, bottom: 90, left: 70 };

        // =====================================
        // SVG
        // =====================================
        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('width', '100%')
            .style('height', 'auto');

        // =====================================
        // SCALES
        // =====================================
        const xScale = d3
            .scaleBand()
            .domain(chartData.map((d) => d.sector))
            .range([margin.left, width - margin.right])
            .padding(0.28);

        const maxValue = d3.max(chartData, (d) => d.avgIntensity);

        const yScale = d3
            .scaleLinear()
            .domain([0, maxValue])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // =====================================
        // GRID
        // =====================================
        svg.append('g')
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

        svg.selectAll('.domain').remove();

        // =====================================
        // AXES
        // =====================================
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickSize(0))
            .selectAll('text')
            .style('fill', 'var(--foreground-muted)')
            .style('font-size', '12px')
            .style('font-weight', '500')
            .attr('transform', 'translate(0,14)')
            .style('text-anchor', 'middle');

        svg.append('g')
            .attr('transform', `translate(${margin.left - 10},0)`)
            .call(d3.axisLeft(yScale).ticks(5).tickSize(0))
            .selectAll('text')
            .style('fill', 'var(--foreground-muted)')
            .style('font-size', '12px')
            .style('font-weight', '500');

        // =====================================
        // TOOLTIP
        // =====================================
        const tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'intensity-tooltip')
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
            '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b',
            '#ef4444', '#ec4899', '#3b82f6', '#14b8a6',
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
            .attr('x', (d) => xScale(d.sector))
            .attr('y', height - margin.bottom)
            .attr('width', xScale.bandwidth())
            .attr('height', 0)
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
            .attr('y', (d) => yScale(d.avgIntensity))
            .attr('height', (d) => height - margin.bottom - yScale(d.avgIntensity));

        // =====================================
        // VALUE LABELS
        // =====================================
        svg.selectAll('.value-label')
            .data(chartData)
            .enter()
            .append('text')
            .attr('x', (d) => xScale(d.sector) + xScale.bandwidth() / 2)
            .attr('y', (d) => yScale(d.avgIntensity) - 10)
            .attr('text-anchor', 'middle')
            .style('fill', 'var(--foreground)')
            .style('font-size', '12px')
            .style('font-weight', '700')
            .style('opacity', 0)
            .text((d) => d.avgIntensity.toFixed(1))
            .transition()
            .duration(500)
            .delay((d, i) => i * 70 + 300)
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

            tooltip
                .style('opacity', 1)
                .html(`
                    <div style="font-weight:700; font-size:13px; margin-bottom:8px; border-bottom:1px solid var(--border); padding-bottom:6px;">
                        ${d.sector}
                    </div>
                    <div style="display:flex; justify-content:space-between; gap:18px; color:var(--foreground-muted);">
                        <span>Avg Intensity</span>
                        <strong style="color:var(--foreground);">${d.avgIntensity.toFixed(2)}</strong>
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
            d3.selectAll('.intensity-tooltip').remove();
        };

    }, [chartData]);

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-surface p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
            
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-500 dark:text-cyan-400">
                        <Sparkles size={14} />
                        Sector Analytics
                    </div>

                    <h2 className="text-2xl font-bold app-text">
                        Intensity by Sector
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 app-text-muted">
                        Comparative average intensity analysis across leading sectors.
                    </p>
                </div>

                <button className="flex items-center gap-2 rounded-2xl border app-border bg-surface-strong px-5 py-3 text-sm font-medium app-text transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-500">
                    <TrendingUp size={16} />
                    Analyze Growth
                </button>
            </div>

            {/* COMPACT STATS BOXES */}
            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                
                <div className="flex items-center justify-between rounded-xl border app-border bg-surface-strong/40 px-4 py-2.5 transition-all hover:bg-surface-strong/60">
                    <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Sectors</span>
                    <span className="text-lg font-bold app-text">{chartData.length}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border app-border bg-surface-strong/40 px-4 py-2.5 transition-all hover:bg-surface-strong/60">
                    <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Avg Intensity</span>
                    <span className="text-lg font-bold text-cyan-500">{overallAverage}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border app-border bg-surface-strong/40 px-4 py-2.5 transition-all hover:bg-surface-strong/60">
                    <div className="flex items-center gap-2">
                        <Activity size={14} className="text-violet-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Top Sector</span>
                    </div>
                    <span className="text-lg font-bold text-violet-500">
                        {chartData?.[0]?.sector || '-'}
                    </span>
                </div>

            </div>

            {/* CHART */}
            <div className="rounded-3xl border app-border bg-surface-strong/20 p-4">
                <div className="w-full">
                    <svg ref={svgRef} className="w-full h-auto block" />
                </div>
            </div>
            
        </div>
    );
};

export default IntensityBarChart;