import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { MapPinned, Sparkles, TrendingUp } from 'lucide-react';

// =====================================
// FLAG-ICONS HELPER
// =====================================
const getCountryCode = (country) => {
    if (!country) return null;
    const mapping = {
        'united states of america': 'us', 'united states': 'us', 'india': 'in',
        'russia': 'ru', 'china': 'cn', 'iran': 'ir', 'saudi arabia': 'sa',
        'iraq': 'iq', 'libya': 'ly', 'germany': 'de', 'france': 'fr',
        'japan': 'jp', 'canada': 'ca', 'brazil': 'br', 'australia': 'au'
    };
    return mapping[country.toLowerCase().trim()] || null;
};

const CountryChart = ({ data }) => {
    const svgRef = useRef();
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });

    // =====================================
    // DATA & METRICS
    // =====================================
    const chartData = useMemo(() => {
        if (!data?.length) return [];
        const counts = data.reduce((acc, item) => {
            if (item.country) acc[item.country] = (acc[item.country] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count).slice(0, 8);
    }, [data]);

    const totalRecords = useMemo(() => chartData.reduce((s, i) => s + i.count, 0), [chartData]);
    const topCountry = chartData?.[0]?.country || '-';
    const topCountryCode = getCountryCode(topCountry);

    // =====================================
    // D3 RENDERING
    // =====================================
    useEffect(() => {
        if (!chartData.length) return;
        const g = d3.select(svgRef.current);
        g.selectAll('*').remove();

        // Dimensions maximized for space
        const width = 1000, height = 220; 
        const margin = { top: 15, right: 30, bottom: 30, left: 140 };

        const svg = g.attr('viewBox', `0 0 ${width} ${height}`).style('width', '100%').style('height', 'auto');

        const yScale = d3.scaleBand().domain(chartData.map(d => d.country)).range([margin.top, height - margin.bottom]).padding(1);
        const xScale = d3.scaleLinear().domain([0, d3.max(chartData, d => d.count) * 1.1]).nice().range([margin.left, width - margin.right]);

        // Grid & X-Axis (Stepped down font to 11px)
        svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(5).tickSize(-height + margin.top + margin.bottom).tickFormat(''))
            .selectAll('line').attr('stroke', 'var(--border)').attr('stroke-dasharray', '4,4').attr('opacity', 0.5);
        svg.selectAll('.domain').remove();
        
        svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(xScale).ticks(5).tickSize(0))
            .selectAll('text').style('fill', 'var(--foreground-muted)').style('font-size', '11px').style('font-weight', '500').attr('transform', 'translate(0,6)');

        // =====================================
        // CUSTOM Y-AXIS WITH FLAGS
        // =====================================
        const yAxis = svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(yScale).tickSize(0));
        yAxis.selectAll('text').remove();

        yAxis.selectAll('.tick').append('foreignObject').attr('x', -margin.left).attr('y', -12).attr('width', margin.left - 12).attr('height', 24)
            .append('xhtml:div').style('display', 'flex').style('align-items', 'center').style('justify-content', 'flex-end').style('width', '100%').style('height', '100%').style('cursor', 'pointer')
            .html(d => {
                const code = getCountryCode(d);
                const flag = code ? `<span class="fi fi-${code}" style="margin-right:8px; font-size:13px; border-radius:3px; box-shadow:0 1px 3px rgba(0,0,0,0.1); transition:all 0.2s ease;"></span>` : `<span style="margin-right:8px; font-size:13px;">🌐</span>`;
                return `<div class="country-axis-item" style="display:flex; align-items:center; justify-content:flex-end; width:100%; transition:all 0.2s ease;">${flag}<span class="country-axis-text" style="text-transform:capitalize; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:105px; text-align:right; color:var(--foreground); font-size:11px; font-weight:600; transition:all 0.2s ease;">${d}</span></div>`;
            });

        const colors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#84cc16'];

        // =====================================
        // LOLLIPOP CHART (Lines & Circles)
        // =====================================
        const lines = svg.selectAll('.stick').data(chartData).enter().append('line').attr('class', 'stick')
            .attr('x1', margin.left).attr('y1', d => yScale(d.country)).attr('x2', margin.left).attr('y2', d => yScale(d.country))
            .attr('stroke', (d, i) => colors[i % colors.length]).attr('stroke-width', 3).attr('stroke-linecap', 'round').attr('opacity', 0.6);
        
        lines.transition().duration(800).delay((d, i) => i * 60).attr('x2', d => xScale(d.count));

        const circles = svg.selectAll('.candy').data(chartData).enter().append('circle').attr('class', 'candy')
            .attr('cx', margin.left).attr('cy', d => yScale(d.country)).attr('r', 0)
            .attr('fill', (d, i) => colors[i % colors.length]).attr('stroke', 'var(--surface)').attr('stroke-width', 2)
            .style('cursor', 'pointer').style('filter', 'drop-shadow(0px 3px 4px rgba(0,0,0,0.1))');
        
        circles.transition().duration(800).delay((d, i) => i * 60).attr('cx', d => xScale(d.count)).attr('r', 7);

        // Value Labels (Stepped down font to 11px)
        svg.selectAll('.value-label').data(chartData).enter().append('text')
            .attr('x', margin.left).attr('y', d => yScale(d.country)).attr('dy', '0.35em')
            .style('fill', 'var(--foreground)').style('font-size', '11px').style('font-weight', '700').style('opacity', 0)
            .text(d => d.count).transition().duration(800).delay((d, i) => i * 60).attr('x', d => xScale(d.count) + 12).style('opacity', 1);

        // =====================================
        // INTERACTIONS
        // =====================================
        circles.on('mouseenter', function (event, d) {
            d3.select(this).transition().duration(150).attr('r', 10).attr('stroke-width', 2.5);
            lines.filter(l => l.country === d.country).transition().duration(150).attr('opacity', 1).attr('stroke-width', 5);
            setTooltip({ show: true, x: event.clientX, y: event.clientY, data: d });
        })
        .on('mousemove', e => setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY })))
        .on('mouseleave', function (event, d) {
            d3.select(this).transition().duration(150).attr('r', 7).attr('stroke-width', 2);
            lines.filter(l => l.country === d.country).transition().duration(150).attr('opacity', 0.6).attr('stroke-width', 3);
            setTooltip(prev => ({ ...prev, show: false }));
        });

        // Y-Axis Interactive Hover (Preserved)
        yAxis.selectAll('.tick foreignObject div')
            .on('mouseenter', function(event, countryName) {
                d3.select(this).select('.country-axis-text').style('color', '#0ea5e9').style('font-weight', '700');
                d3.select(this).select('.fi').style('transform', 'scale(1.08)');
                d3.select(this).style('transform', 'translateX(4px)');
                lines.filter(d => d.country === countryName).transition().duration(150).attr('opacity', 1).attr('stroke-width', 5);
                circles.filter(d => d.country === countryName).transition().duration(150).attr('r', 10).attr('stroke-width', 2.5);
            })
            .on('mouseleave', function(event, countryName) {
                d3.select(this).select('.country-axis-text').style('color', 'var(--foreground)').style('font-weight', '600');
                d3.select(this).select('.fi').style('transform', 'scale(1)');
                d3.select(this).style('transform', 'translateX(0px)');
                lines.filter(d => d.country === countryName).transition().duration(150).attr('opacity', 0.6).attr('stroke-width', 3);
                circles.filter(d => d.country === countryName).transition().duration(150).attr('r', 7).attr('stroke-width', 2);
            });

    }, [chartData]);

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-[var(--surface)]/80 backdrop-blur-xl p-5 shadow-xl transition-all duration-300 hover:shadow-2xl flex flex-col h-full">
            
            {/* TOOLTIP (Stepped down) */}
            {tooltip.show && tooltip.data && (
                <div className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full pb-3" style={{ left: tooltip.x, top: tooltip.y - 10 }}>
                    <div className="min-w-[170px] rounded-xl border app-border bg-[var(--surface-strong)] p-3 shadow-2xl flex flex-col gap-2">
                        <div className="flex items-center gap-2.5 border-b app-border pb-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-lg shadow-sm border border-sky-500/20">
                                {getCountryCode(tooltip.data.country) ? <span className={`fi fi-${getCountryCode(tooltip.data.country)} rounded-sm`}></span> : '🌐'}
                            </div>
                            <div className="font-bold text-[13px] app-text capitalize truncate max-w-[120px]">{tooltip.data.country}</div>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                            <span className="text-[11px] text-[var(--foreground-muted)] uppercase tracking-wider font-semibold">Records</span>
                            <span className="font-bold text-foreground text-[13px]">{tooltip.data.count}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-[var(--foreground-muted)] uppercase tracking-wider font-semibold">Share</span>
                            <span className="font-bold text-sky-500 text-[13px]">{((tooltip.data.count / totalRecords) * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER (Compact) */}
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                        <Sparkles size={12} /> Global Analytics
                    </div>
                    <h2 className="text-xl font-bold app-text">Country Node Map</h2>
                    <p className="mt-0.5 max-w-xl text-[13px] leading-5 app-text-muted">Lollipop distribution tracking the top contributing countries.</p>
                </div>
                <button className="flex items-center gap-2 rounded-xl border app-border bg-[var(--surface-strong)] px-4 py-2 text-[13px] font-medium app-text transition-all duration-300 hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-500">
                    <TrendingUp size={15} /> Global Insights
                </button>
            </div>

            {/* STATS (Group Hover added, smaller text) */}
            <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-[3fr_3fr_4fr]">
                <div className="group cursor-pointer flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-2 transition-all hover:bg-[var(--surface-strong)]/60">
                    <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted transition-colors duration-300 group-hover:text-sky-500/80">Countries</span>
                    <span className="text-base font-bold app-text transition-colors duration-300 group-hover:text-sky-500">{chartData.length}</span>
                </div>

                <div className="group cursor-pointer flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-2 transition-all hover:bg-[var(--surface-strong)]/60">
                    <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted transition-colors duration-300 group-hover:text-sky-500/80">Total Records</span>
                    <span className="text-base font-bold text-sky-500 transition-all duration-300 group-hover:brightness-125">{totalRecords}</span>
                </div>

                <div className="group cursor-pointer flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-2 transition-all hover:bg-[var(--surface-strong)]/60 min-w-0">
                    <div className="flex items-center gap-1.5 shrink-0">
                        <MapPinned size={12} className="text-emerald-500 transition-colors duration-300 group-hover:text-sky-500" />
                        <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted transition-colors duration-300 group-hover:text-sky-500/80">Leading</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500 font-bold min-w-0 transition-colors duration-300 group-hover:text-sky-500">
                        {topCountryCode && <span className={`fi fi-${topCountryCode} text-[11px] shrink-0 rounded-sm`}></span>}
                        <span className="text-sm capitalize truncate">{topCountry}</span>
                    </div>
                </div>
            </div>

            {/* CHART CANVAS (No border, max width) */}
            <div className="relative w-full mt-2">
                <svg ref={svgRef} className="block w-full h-auto" />
            </div>
            
        </div>
    );
};

export default CountryChart;