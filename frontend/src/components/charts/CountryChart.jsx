import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
    MapPinned,
    Sparkles,
    TrendingUp,
} from 'lucide-react';

// =====================================
// FLAG-ICONS HELPER
// =====================================
const getCountryCode = (country) => {
    if (!country) return null;
    
    const mapping = {
        'united states of america': 'us',
        'united states': 'us',
        'india': 'in',
        'russia': 'ru',
        'china': 'cn',
        'iran': 'ir',
        'saudi arabia': 'sa',
        'iraq': 'iq',
        'libya': 'ly',
        'germany': 'de',
        'france': 'fr',
        'japan': 'jp',
        'canada': 'ca',
        'brazil': 'br',
        'australia': 'au'
    };

    return mapping[country.toLowerCase().trim()] || null;
};

const CountryChart = ({ data }) => {
    const svgRef = useRef();
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });

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
    const topCountryCode = getCountryCode(topCountry);

    // =====================================
    // CHART RENDERING (D3)
    // =====================================
    useEffect(() => {
        if (!chartData.length) return;

        d3.select(svgRef.current).selectAll('*').remove();

        // =====================================
        // DIMENSIONS
        // =====================================
        const width = 920;
        const height = 450;
        const margin = { top: 20, right: 60, bottom: 40, left: 160 };

        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('width', '100%')
            .style('height', 'auto');

        // =====================================
        // SCALES (Lollipop Chart)
        // =====================================
        const yScale = d3
            .scaleBand()
            .domain(chartData.map((d) => d.country))
            .range([margin.top, height - margin.bottom])
            .padding(1); // Centers the lollipop line

        const maxValue = d3.max(chartData, (d) => d.count);

        const xScale = d3
            .scaleLinear()
            .domain([0, maxValue * 1.1]) // Add headroom
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
        // X Axis (Values)
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(5).tickSize(0))
            .selectAll('text')
            .style('fill', 'var(--foreground-muted)')
            .style('font-size', '12px')
            .style('font-weight', '500')
            .attr('transform', 'translate(0,8)');

        // Y Axis (Countries with HTML Flags via foreignObject)
        const yAxis = svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).tickSize(0));

        // Remove default text and replace with HTML nodes for flag icons
        yAxis.selectAll('text').remove();

        yAxis.selectAll('.tick')
            .append('foreignObject')
            .attr('x', -margin.left)
            .attr('y', -12) // Centers the 24px tall div
            .attr('width', margin.left - 12) // Leaves small gap before the line
            .attr('height', 24)
            .append('xhtml:div')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('justify-content', 'flex-end')
            .style('width', '100%')
            .style('height', '100%')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('color', 'var(--foreground)')
            .html((d) => {
                const code = getCountryCode(d);
                const flagHtml = code 
                    ? `<span class="fi fi-${code} rounded-sm shadow-sm" style="margin-right: 8px; font-size: 14px;"></span>` 
                    : `<span style="margin-right: 8px; font-size: 14px;">🌐</span>`;
                return `${flagHtml}<span style="text-transform: capitalize; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 110px; text-align: right;">${d}</span>`;
            });

        // =====================================
        // COLORS
        // =====================================
        const colors = [
            '#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b',
            '#ef4444', '#ec4899', '#3b82f6', '#84cc16',
        ];

        // =====================================
        // LOLLIPOP STICKS
        // =====================================
        const lines = svg
            .selectAll('.stick')
            .data(chartData)
            .enter()
            .append('line')
            .attr('class', 'stick')
            .attr('x1', margin.left)
            .attr('y1', (d) => yScale(d.country))
            .attr('x2', margin.left)
            .attr('y2', (d) => yScale(d.country))
            .attr('stroke', (d, i) => colors[i % colors.length])
            .attr('stroke-width', 4)
            .attr('stroke-linecap', 'round')
            .attr('opacity', 0.6);

        lines.transition()
            .duration(800)
            .delay((d, i) => i * 70)
            .attr('x2', (d) => xScale(d.count));

        // =====================================
        // LOLLIPOP CANDY
        // =====================================
        const circles = svg
            .selectAll('.candy')
            .data(chartData)
            .enter()
            .append('circle')
            .attr('class', 'candy')
            .attr('cx', margin.left)
            .attr('cy', (d) => yScale(d.country))
            .attr('r', 0)
            .attr('fill', (d, i) => colors[i % colors.length])
            .attr('stroke', 'var(--surface)')
            .attr('stroke-width', 2.5)
            .style('cursor', 'pointer')
            .style('filter', 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))');

        circles.transition()
            .duration(800)
            .delay((d, i) => i * 70)
            .attr('cx', (d) => xScale(d.count))
            .attr('r', 8);

        // =====================================
        // VALUE LABELS
        // =====================================
        svg.selectAll('.value-label')
            .data(chartData)
            .enter()
            .append('text')
            .attr('x', margin.left)
            .attr('y', (d) => yScale(d.country))
            .attr('dy', '0.35em')
            .style('fill', 'var(--foreground)')
            .style('font-size', '12px')
            .style('font-weight', '700')
            .style('opacity', 0)
            .text((d) => d.count)
            .transition()
            .duration(800)
            .delay((d, i) => i * 70)
            .attr('x', (d) => xScale(d.count) + 16)
            .style('opacity', 1);

        // =====================================
        // HOVER INTERACTIONS (React Tooltip)
        // =====================================
        circles
            .on('mouseenter', function (event, d) {
                d3.select(this).transition().duration(150).attr('r', 12).attr('stroke-width', 3);
                lines.filter(l => l.country === d.country).transition().duration(150).attr('opacity', 1).attr('stroke-width', 6);
                
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
            .on('mouseleave', function (event, d) {
                d3.select(this).transition().duration(150).attr('r', 8).attr('stroke-width', 2.5);
                lines.filter(l => l.country === d.country).transition().duration(150).attr('opacity', 0.6).attr('stroke-width', 4);
                
                setTooltip(prev => ({ ...prev, show: false }));
            });

    }, [chartData]);

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-surface p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
            
            {/* REACT PORTAL TOOLTIP WITH FLAG */}
            {tooltip.show && tooltip.data && (
                <div 
                    className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full pb-4"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    <div className="bg-[var(--surface-strong)] border app-border rounded-2xl p-4 shadow-2xl flex flex-col gap-3 min-w-[200px]">
                        <div className="flex items-center gap-3 border-b app-border pb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-xl shadow-sm border border-sky-500/20">
                                {getCountryCode(tooltip.data.country) 
                                    ? <span className={`fi fi-${getCountryCode(tooltip.data.country)} rounded-sm`}></span>
                                    : '🌐'
                                }
                            </div>
                            <div className="font-bold text-sm app-text capitalize truncate max-w-[140px]">
                                {tooltip.data.country}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-semibold">Records</span>
                            <span className="font-bold text-foreground text-base">{tooltip.data.count}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-semibold">Share</span>
                            <span className="font-bold text-sky-500 text-sm">
                                {((tooltip.data.count / totalRecords) * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                        <Sparkles size={14} />
                        Global Analytics
                    </div>

                    <h2 className="text-2xl font-bold app-text">
                        Country Node Map
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 app-text-muted">
                        Lollipop distribution map tracking the top contributing countries in the dataset.
                    </p>
                </div>

                <button className="flex items-center gap-2 rounded-2xl border app-border bg-surface-strong px-5 py-3 text-sm font-medium app-text transition-all duration-300 hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-500">
                    <TrendingUp size={16} />
                    Global Insights
                </button>
            </div>

            {/* COMPACT STATS BOXES WITH FLAG */}
            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="flex items-center justify-between rounded-xl border app-border bg-surface-strong/40 px-4 py-2.5 transition-all hover:bg-surface-strong/60">
                    <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Countries</span>
                    <span className="text-lg font-bold app-text">{chartData.length}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border app-border bg-surface-strong/40 px-4 py-2.5 transition-all hover:bg-surface-strong/60">
                    <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Total Records</span>
                    <span className="text-lg font-bold text-sky-500">{totalRecords}</span>
                </div>

                <div className="rounded-xl border app-border bg-surface-strong/40 px-4 py-2.5 transition-all hover:bg-surface-strong/60">
    <div className="flex items-center gap-2">
        <MapPinned size={8} className="text-emerald-500" />
        <span className="text-xs uppercase tracking-wider app-text-muted">
            Leading
        </span>
    </div>

    <div className="mt-2 flex items-center gap-2 text-emerald-500 font-bold">
        {topCountryCode ? (
            <span className={`fi fi-${topCountryCode} text-xs`}></span>
        ) : (
            '🌐'
        )}

        <span className="text-xs capitalize truncate max-w-30">
            {topCountry.length > 12
                ? `${topCountry.slice(0, 12)}...`
                : topCountry}
        </span>
    </div>
</div>
            </div>

            {/* CHART */}
            <div className="rounded-3xl border app-border bg-surface-strong/20 p-4">
                <div className="w-full">
                    {/* SVG dynamically scales to fit without scrollbars */}
                    <svg ref={svgRef} className="w-full h-auto block" />
                </div>
            </div>
        </div>
    );
};

export default CountryChart;