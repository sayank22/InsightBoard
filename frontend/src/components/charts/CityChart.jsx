import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Building2, Sparkles, TrendingUp, SearchX, Info } from 'lucide-react';

const CityChart = ({ data }) => {
    const svgRef = useRef();
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null, percentage: 0 });

    // =====================================
    // DATA & METRICS
    // =====================================
    const chartData = useMemo(() => {
        if (!data?.length) return [];
        const counts = data.reduce((acc, { city }) => {
            if (city && city.trim()) acc[city.trim()] = (acc[city.trim()] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([city, count]) => ({ city, count }))
            .sort((a, b) => b.count - a.count).slice(0, 8);
    }, [data]);

    const totalRecords = useMemo(() => chartData.reduce((s, i) => s + i.count, 0), [chartData]);
    const topCity = chartData?.[0]?.city || '-';

    // =====================================
    // D3 RENDERING (Miniaturized)
    // =====================================
    useEffect(() => {
        if (!chartData.length) return;
        const g = d3.select(svgRef.current);
        g.selectAll('*').remove();

        // Highly compressed dimensions
        const width = 800, height = 240; 
        const margin = { top: 10, right: 25, bottom: 20, left: 90 };

        const svg = g.attr('viewBox', `0 0 ${width} ${height}`).style('width', '100%').style('height', 'auto');

        const yScale = d3.scaleBand().domain(chartData.map(d => d.city)).range([margin.top, height - margin.bottom]).padding(0.2);
        const xScale = d3.scaleLinear().domain([0, d3.max(chartData, d => d.count)]).nice().range([margin.left, width - margin.right]);

        // Grid & Axes
        svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(xScale).ticks(5).tickSize(-height + margin.top + margin.bottom).tickFormat('')).selectAll('line').attr('stroke', 'var(--border)').attr('stroke-dasharray', '3,3').attr('opacity', 0.4);
        svg.selectAll('.domain').remove();

        svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(yScale).tickSize(0)).selectAll('text').style('fill', 'var(--foreground)').style('font-size', '10px').style('font-weight', '600').attr('dx', '-6');
        svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(xScale).ticks(5).tickSize(0)).selectAll('text').style('fill', 'var(--foreground-muted)').style('font-size', '9px').style('font-weight', '500').attr('transform', 'translate(0,6)');

        const colors = ['#ec4899', '#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#84cc16'];

        // Bars & Labels
        const bars = svg.selectAll('.bar').data(chartData).enter().append('rect').attr('class', 'bar')
            .attr('x', margin.left).attr('y', d => yScale(d.city)).attr('height', yScale.bandwidth()).attr('width', 0)
            .attr('rx', 4).attr('fill', (d, i) => colors[i % colors.length]).style('cursor', 'pointer').style('opacity', 0.85);

        bars.transition().duration(800).delay((d, i) => i * 50).attr('width', d => xScale(d.count) - margin.left);

        svg.selectAll('.val-label').data(chartData).enter().append('text')
            .attr('x', d => xScale(d.count) + 6).attr('y', d => yScale(d.city) + yScale.bandwidth() / 2).attr('dy', '0.35em')
            .style('fill', 'var(--foreground)').style('font-size', '9px').style('font-weight', '700').style('opacity', 0)
            .text(d => d.count).transition().duration(500).delay((d, i) => i * 50 + 400).style('opacity', 1);

        // Hover
        bars.on('mouseenter', function (event, d) {
            d3.select(this).transition().duration(150).style('opacity', 1).attr('stroke', 'var(--foreground)').attr('stroke-width', 1.5);
            setTooltip({ show: true, x: event.clientX, y: event.clientY, data: d, percentage: ((d.count / totalRecords) * 100).toFixed(1) });
        }).on('mousemove', e => setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY })))
        .on('mouseleave', function () {
            d3.select(this).transition().duration(150).style('opacity', 0.85).attr('stroke', 'none');
            setTooltip(prev => ({ ...prev, show: false }));
        });

    }, [chartData, totalRecords]);

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-[var(--surface)]/80 backdrop-blur-xl p-4 shadow-xl transition-all duration-300 hover:shadow-2xl flex flex-col h-full">
            
            {/* TOOLTIP (Scaled down) */}
            {tooltip.show && tooltip.data && (
                <div className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full pb-2" style={{ left: tooltip.x, top: tooltip.y - 10 }}>
                    <div className="min-w-[130px] rounded-xl border app-border bg-[var(--surface-strong)] p-2.5 shadow-2xl">
                        <div className="mb-1.5 font-bold text-[11px] text-foreground border-b app-border pb-1.5 capitalize">{tooltip.data.city}</div>
                        <div className="flex justify-between gap-3 text-[9px] text-foreground-muted mb-1">
                            <span>Records</span><strong className="text-foreground">{tooltip.data.count}</strong>
                        </div>
                        <div className="flex justify-between gap-3 text-[9px] text-foreground-muted">
                            <span>Share</span><strong className="text-foreground">{tooltip.percentage}%</strong>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER (Compact) */}
            <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-pink-500/20 bg-pink-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-pink-600 dark:text-pink-400">
                        <Sparkles size={10} /> Urban Analytics
                    </div>
                    <h2 className="text-lg font-bold app-text">City Distribution</h2>
                    <p className="mt-0.5 max-w-xl text-[11px] leading-4 app-text-muted">Top cities contributing the highest number of records.</p>
                </div>
                {chartData.length > 0 && (
                    <button className="flex items-center gap-1.5 rounded-xl border app-border bg-[var(--surface-strong)] px-3 py-1.5 text-[11px] font-medium app-text transition-all duration-300 hover:border-pink-500/30 hover:bg-pink-500/10 hover:text-pink-500">
                        <TrendingUp size={13} /> City Insights
                    </button>
                )}
            </div>

            {chartData.length === 0 ? (
                // EMPTY STATE (Compact)
                <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-dashed app-border bg-[var(--surface-strong)]/20 p-6 min-h-[180px]">
                    <div className="text-center animate-in fade-in zoom-in duration-500">
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-strong)]/50">
                            <SearchX className="h-5 w-5 text-foreground-muted opacity-50" />
                        </div>
                        <h3 className="text-sm font-semibold app-text">No City Data Available</h3>
                        <p className="mt-1 max-w-[200px] mx-auto text-[10px] leading-4 app-text-muted">Dataset lacks specific city-level variables.</p>
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[var(--surface-strong)] px-2 py-1 text-[9px] font-medium app-text-muted border app-border">
                            <Info size={10} /> Handled Gracefully
                        </div>
                    </div>
                </div>
            ) : (
                // ACTIVE CHART
                <>
                    {/* STATS (Group hover & Mini fonts) */}
                    <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-[3fr_3fr_4fr]">
                        <div className="group cursor-pointer flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-1.5 transition-all hover:bg-[var(--surface-strong)]/60">
                            <span className="text-[10px] font-semibold uppercase tracking-wider app-text-muted transition-colors group-hover:text-pink-500/80">Cities</span>
                            <span className="text-sm font-bold app-text transition-colors group-hover:text-pink-500">{chartData.length}</span>
                        </div>

                        <div className="group cursor-pointer flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-1.5 transition-all hover:bg-[var(--surface-strong)]/60">
                            <span className="text-[10px] font-semibold uppercase tracking-wider app-text-muted transition-colors group-hover:text-cyan-500/80">Records</span>
                            <span className="text-sm font-bold text-cyan-500 transition-all group-hover:brightness-125">{totalRecords}</span>
                        </div>

                        <div className="group cursor-pointer flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-1.5 transition-all hover:bg-[var(--surface-strong)]/60 min-w-0">
                            <div className="flex items-center gap-1.5 shrink-0">
                                <Building2 size={12} className="text-pink-500 transition-colors group-hover:brightness-125" />
                                <span className="text-[10px] font-semibold uppercase tracking-wider app-text-muted transition-colors group-hover:text-pink-500/80">Leading</span>
                            </div>
                            <span className="text-sm font-bold text-pink-500 truncate ml-2 transition-colors group-hover:brightness-125">
                                {topCity}
                            </span>
                        </div>
                    </div>

                    {/* CHART CANVAS */}
                    <div className="relative w-full mt-1">
                        <svg ref={svgRef} className="block w-full h-auto" />
                    </div>
                </>
            )}
        </div>
    );
};

export default CityChart;