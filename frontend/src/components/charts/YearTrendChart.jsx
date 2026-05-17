import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { CalendarRange, Sparkles, TrendingUp } from 'lucide-react';

const YearTrendChart = ({ data }) => {
    const svgRef = useRef();
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });

    // =====================================
    // DATA & METRICS
    // =====================================
    const chartData = useMemo(() => {
        if (!data?.length) return [];
        const yearCounts = data.reduce((acc, item) => {
            if (item.end_year && !isNaN(item.end_year)) acc[item.end_year] = (acc[item.end_year] || 0) + 1;
            return acc;
        }, {});

        let processed = Object.entries(yearCounts)
            .map(([year, count]) => ({ year: Number(year), count }))
            .sort((a, b) => a.year - b.year);

        // Prevent single-point chart breaking
        if (processed.length === 1) {
            processed = [{ year: processed[0].year - 1, count: 0 }, ...processed, { year: processed[0].year + 1, count: 0 }];
        }
        return processed;
    }, [data]);

    const totalRecords = data?.length || 0;
    const latestYear = chartData.length ? Math.max(...chartData.map(d => d.year)) : 'N/A';
    const peakYear = chartData.length ? chartData.reduce((a, b) => (a.count > b.count ? a : b)).year : 'N/A';

    // =====================================
    // D3 RENDERING
    // =====================================
    useEffect(() => {
        if (!chartData.length) return;
        const g = d3.select(svgRef.current);
        g.selectAll('*').remove();

        // Dimensions maximized for space
        const width = 1000, height = 300;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        const svg = g.attr('viewBox', `0 0 ${width} ${height}`).style('width', '100%').style('height', 'auto');

        // Gradient
        const gradient = svg.append('defs').append('linearGradient').attr('id', 'trend-gradient').attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
        gradient.append('stop').attr('offset', '0%').attr('stop-color', '#f59e0b').attr('stop-opacity', 0.25);
        gradient.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b').attr('stop-opacity', 0);

        // Scales
        const xScale = d3.scaleLinear().domain(d3.extent(chartData, d => d.year)).range([margin.left, width - margin.right]);
        const yScale = d3.scaleLinear().domain([0, d3.max(chartData, d => d.count)]).nice().range([height - margin.bottom, margin.top]);

        // Grid & Axes
        svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(yScale).ticks(5).tickSize(-width + margin.left + margin.right).tickFormat('')).selectAll('line').attr('stroke', 'var(--border)').attr('stroke-dasharray', '4,4').attr('opacity', 0.5);
        svg.selectAll('.domain').remove();
        
        svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(Math.min(chartData.length, 8)).tickSize(0)).selectAll('text').style('fill', 'var(--foreground-muted)').style('font-size', '11px').style('font-weight', '500').attr('transform', 'translate(0, 6)');
        svg.append('g').attr('transform', `translate(${margin.left - 10},0)`).call(d3.axisLeft(yScale).ticks(5).tickSize(0)).selectAll('text').style('fill', 'var(--foreground-muted)').style('font-size', '11px').style('font-weight', '500');

        // Area & Line
        const area = d3.area().x(d => xScale(d.year)).y0(height - margin.bottom).y1(d => yScale(d.count)).curve(d3.curveMonotoneX);
        const line = d3.line().x(d => xScale(d.year)).y(d => yScale(d.count)).curve(d3.curveMonotoneX);

        svg.append('path').datum(chartData).attr('fill', 'url(#trend-gradient)').attr('opacity', 0).attr('d', area).transition().duration(700).attr('opacity', 1);
        
        const linePath = svg.append('path').datum(chartData).attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 3).attr('stroke-linecap', 'round').attr('d', line);
        const pathLength = linePath.node().getTotalLength();
        linePath.attr('stroke-dasharray', pathLength).attr('stroke-dashoffset', pathLength).transition().duration(1200).ease(d3.easeCubicOut).attr('stroke-dashoffset', 0);

        // Points & Interactions
        svg.selectAll('.point').data(chartData).enter().append('circle').attr('class', 'point').attr('cx', d => xScale(d.year)).attr('cy', d => yScale(d.count)).attr('r', 0).attr('fill', '#f59e0b').attr('stroke', 'var(--surface)').attr('stroke-width', 2.5).style('cursor', 'pointer')
            .on('mouseenter', function(event, d) {
                d3.select(this).transition().duration(150).attr('r', 8);
                setTooltip({ show: true, x: event.clientX, y: event.clientY, data: d });
            })
            .on('mousemove', event => setTooltip(prev => ({ ...prev, x: event.clientX, y: event.clientY })))
            .on('mouseleave', function() {
                d3.select(this).transition().duration(150).attr('r', 5);
                setTooltip(prev => ({ ...prev, show: false }));
            })
            .transition().duration(500).delay((d, i) => i * 60).attr('r', 5);

    }, [chartData]);

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-[var(--surface)]/80 backdrop-blur-xl p-5 shadow-xl transition-all duration-300 hover:shadow-2xl">
            
            {/* TOOLTIP */}
            {tooltip.show && tooltip.data && (
                <div className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full pb-3" style={{ left: tooltip.x, top: tooltip.y - 10 }}>
                    <div className="min-w-[150px] rounded-2xl border app-border bg-[var(--surface-strong)] p-3 shadow-2xl">
                        <div className="mb-2 font-bold text-[13px] text-foreground border-b app-border pb-2">Year {tooltip.data.year}</div>
                        <div className="flex justify-between gap-4 text-[11px] text-foreground-muted">
                            <span>Records</span><strong className="text-amber-500">{tooltip.data.count}</strong>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER - Stepped down fonts */}
            <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-400">
                        <Sparkles size={12} /> Time Series Analytics
                    </div>
                    <h2 className="text-lg font-bold app-text">Year Trend Analysis</h2>
                    <p className="mt-0.5 max-w-xl text-[13px] leading-5 app-text-muted">Historical progression and yearly distribution trends across the dataset.</p>
                </div>
                <button className="flex items-center gap-2 rounded-xl border app-border bg-[var(--surface-strong)] px-4 py-2 text-[13px] font-medium app-text transition-all duration-300 hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500">
                    <TrendingUp size={15} /> Forecast Trends
                </button>
            </div>

            {/* STATS - Group hover applied */}
            <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-3">
                <div className="group cursor-pointer flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-2 transition-all hover:bg-[var(--surface-strong)]/60">
                    <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted transition-colors duration-300 group-hover:text-amber-500/80">Total Records</span>
                    <span className="text-base font-bold app-text transition-colors duration-300 group-hover:text-amber-500">{totalRecords.toLocaleString()}</span>
                </div>

                <div className="group cursor-pointer flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-2 transition-all hover:bg-[var(--surface-strong)]/60">
                    <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted transition-colors duration-300 group-hover:text-amber-500/80">Latest Year</span>
                    <span className="text-base font-bold text-amber-500 transition-all duration-300 group-hover:brightness-125">{latestYear}</span>
                </div>

                <div className="group cursor-pointer flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-2 transition-all hover:bg-[var(--surface-strong)]/60">
                    <div className="flex items-center gap-1.5">
                        <CalendarRange size={14} className="text-emerald-500 transition-colors duration-300 group-hover:text-amber-500" />
                        <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted transition-colors duration-300 group-hover:text-amber-500/80">Peak Activity</span>
                    </div>
                    <span className="text-base font-bold text-emerald-500 transition-colors duration-300 group-hover:text-amber-500">{peakYear}</span>
                </div>
            </div>

            {/* CHART - Border removed, utilizes full width */}
            <div className="relative w-full mt-2">
                <svg ref={svgRef} className="block w-full h-auto" />
            </div>
            
        </div>
    );
};

export default YearTrendChart;