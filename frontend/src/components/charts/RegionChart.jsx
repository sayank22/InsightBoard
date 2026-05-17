import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Globe2, Sparkles, TrendingUp } from 'lucide-react';

const RegionChart = ({ data }) => {
    const svgRef = useRef();
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null, percentage: 0 });

    // =====================================
    // DATA & METRICS
    // =====================================
    const chartData = useMemo(() => {
        if (!data?.length) return [];
        const regionCounts = data.reduce((acc, item) => {
            if (item.region) acc[item.region] = (acc[item.region] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(regionCounts)
            .map(([region, count]) => ({ region, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
    }, [data]);

    const totalRecords = useMemo(() => chartData.reduce((sum, item) => sum + item.count, 0), [chartData]);
    const leadingRegion = chartData?.[0]?.region || '-';

    // =====================================
    // D3 RENDERING
    // =====================================
    useEffect(() => {
        if (!chartData.length) return;
        const g = d3.select(svgRef.current);
        g.selectAll('*').remove();

        // Dimensions maximized for space
        const width = 1000, height = 300;
        const margin = { top: 20, right: 20, bottom: 40, left: 40 };

        const svg = g.attr('viewBox', `0 0 ${width} ${height}`).style('width', '100%').style('height', 'auto');

        // Scales
        const xScale = d3.scaleBand().domain(chartData.map(d => d.region)).range([margin.left, width - margin.right]).padding(0.28);
        const yScale = d3.scaleLinear().domain([0, d3.max(chartData, d => d.count)]).nice().range([height - margin.bottom, margin.top]);

        // Grid & Axes
        svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(yScale).ticks(5).tickSize(-width + margin.left + margin.right).tickFormat('')).selectAll('line').attr('stroke', 'var(--border)').attr('stroke-dasharray', '4,4').attr('opacity', 0.5);
        svg.selectAll('.domain').remove();

        svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(xScale).tickSize(0)).selectAll('text').style('fill', 'var(--foreground-muted)').style('font-size', '11px').style('font-weight', '500').attr('transform', 'translate(0, 10)');
        svg.append('g').attr('transform', `translate(${margin.left - 10},0)`).call(d3.axisLeft(yScale).ticks(5).tickSize(0)).selectAll('text').style('fill', 'var(--foreground-muted)').style('font-size', '11px').style('font-weight', '500');

        // Colors
        const colors = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#14b8a6'];

        // Bars
        const bars = svg.selectAll('.bar').data(chartData).enter().append('rect').attr('class', 'bar')
            .attr('x', d => xScale(d.region))
            .attr('y', height - margin.bottom)
            .attr('width', xScale.bandwidth())
            .attr('height', 0)
            .attr('rx', 6)
            .attr('fill', (d, i) => colors[i % colors.length])
            .style('cursor', 'pointer')
            .style('opacity', 0.85);

        bars.transition().duration(800).delay((d, i) => i * 70)
            .attr('y', d => yScale(d.count))
            .attr('height', d => height - margin.bottom - yScale(d.count));

        // Value Labels
        svg.selectAll('.value-label').data(chartData).enter().append('text')
            .attr('x', d => xScale(d.region) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.count) - 8)
            .attr('text-anchor', 'middle')
            .style('fill', 'var(--foreground)')
            .style('font-size', '11px')
            .style('font-weight', '700')
            .style('opacity', 0)
            .text(d => d.count)
            .transition().duration(500).delay((d, i) => i * 70 + 400).style('opacity', 1);

        // Hover Interactions
        bars.on('mouseenter', function (event, d) {
                d3.select(this).transition().duration(150).style('opacity', 1).attr('stroke', 'var(--foreground)').attr('stroke-width', 2);
                setTooltip({ 
                    show: true, 
                    x: event.clientX, 
                    y: event.clientY, 
                    data: d,
                    percentage: ((d.count / totalRecords) * 100).toFixed(1)
                });
            })
            .on('mousemove', event => setTooltip(prev => ({ ...prev, x: event.clientX, y: event.clientY })))
            .on('mouseleave', function () {
                d3.select(this).transition().duration(150).style('opacity', 0.85).attr('stroke', 'none');
                setTooltip(prev => ({ ...prev, show: false }));
            });

    }, [chartData, totalRecords]);

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-[var(--surface)]/80 backdrop-blur-xl p-5 shadow-xl transition-all duration-300 hover:shadow-2xl">
            
            {/* REACT TOOLTIP */}
            {tooltip.show && tooltip.data && (
                <div className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full pb-3" style={{ left: tooltip.x, top: tooltip.y - 10 }}>
                    <div className="min-w-[150px] rounded-2xl border app-border bg-[var(--surface-strong)] p-3 shadow-2xl">
                        <div className="mb-2 font-bold text-[13px] text-foreground border-b app-border pb-2 capitalize">{tooltip.data.region}</div>
                        <div className="flex justify-between gap-4 text-[11px] text-foreground-muted mb-1.5">
                            <span>Records</span><strong className="text-foreground">{tooltip.data.count}</strong>
                        </div>
                        <div className="flex justify-between gap-4 text-[11px] text-foreground-muted">
                            <span>Share</span><strong className="text-foreground">{tooltip.percentage}%</strong>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER - Stepped down fonts */}
            <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <Sparkles size={12} /> Geographic Analytics
                    </div>
                    <h2 className="text-lg font-bold app-text">Region Distribution</h2>
                    <p className="mt-0.5 max-w-xl text-[13px] leading-5 app-text-muted">Top regions contributing the highest activity and data volume.</p>
                </div>
                <button className="flex items-center gap-2 rounded-xl border app-border bg-[var(--surface-strong)] px-4 py-2 text-[13px] font-medium app-text transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-500">
                    <TrendingUp size={15} /> View Insights
                </button>
            </div>

            {/* STATS - Group hover applied */}
            <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-3">
                <div className="group cursor-pointer flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-2 transition-all hover:bg-[var(--surface-strong)]/60">
                    <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted transition-colors duration-300 group-hover:text-emerald-500/80">Regions</span>
                    <span className="text-base font-bold app-text transition-colors duration-300 group-hover:text-emerald-500">{chartData.length}</span>
                </div>

                <div className="group cursor-pointer flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-2 transition-all hover:bg-[var(--surface-strong)]/60">
                    <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted transition-colors duration-300 group-hover:text-cyan-500/80">Total Records</span>
                    <span className="text-base font-bold text-cyan-500 transition-all duration-300 group-hover:brightness-125">{totalRecords}</span>
                </div>

                <div className="group cursor-pointer flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-2 transition-all hover:bg-[var(--surface-strong)]/60 min-w-0">
                    <div className="flex items-center gap-1.5 shrink-0">
                        <Globe2 size={14} className="text-emerald-500 transition-colors duration-300 group-hover:brightness-125" />
                        <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted transition-colors duration-300 group-hover:text-emerald-500/80">Leading Region</span>
                    </div>
                    <span className="text-base font-bold text-emerald-500 truncate ml-2 transition-colors duration-300 group-hover:brightness-125">
                        {leadingRegion}
                    </span>
                </div>
            </div>

            {/* CHART - Border removed, utilizes full width */}
            <div className="relative w-full mt-2">
                <svg ref={svgRef} className="block w-full h-auto" />
            </div>
            
        </div>
    );
};

export default RegionChart;