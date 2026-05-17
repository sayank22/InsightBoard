import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Sparkles, TrendingUp, Monitor, ShieldCheck, Hotel, Wheat, Landmark, Headset, HeartPulse, Zap, Factory } from 'lucide-react';

// =====================================
// DYNAMIC SECTOR ICON MAPPER
// =====================================
const getSectorIcon = (sector, size = 16, className = '') => {
    const s = sector?.toLowerCase() || '';
    const props = { size, className };
    
    // FIXED: Now checks for 'it' strictly as a standalone word using word boundaries (\b)
    if (/\bit\b/.test(s) || s.includes('information technology')) return <Monitor {...props} />;
    
    if (s.includes('security')) return <ShieldCheck {...props} />;
    if (s.includes('tourism') || s.includes('hospitality')) return <Hotel {...props} />;
    if (s.includes('food') || s.includes('agriculture')) return <Wheat {...props} />;
    if (s.includes('finance') || s.includes('financial')) return <Landmark {...props} />;
    if (s.includes('support')) return <Headset {...props} />;
    if (s.includes('health')) return <HeartPulse {...props} />;
    if (s.includes('energy')) return <Zap {...props} />;
    return <Factory {...props} />;
};

const IntensityAreaChart = ({ data }) => {
    const d3ContainerRef = useRef();
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });

    // =====================================
    // DATA & METRICS
    // =====================================
    const chartData = useMemo(() => {
        if (!data?.length) return [];
        const sm = data.reduce((acc, cur) => {
            if (cur.sector) {
                acc[cur.sector] = acc[cur.sector] || { total: 0, count: 0 };
                acc[cur.sector].total += cur.intensity || 0;
                acc[cur.sector].count += 1;
            }
            return acc;
        }, {});

        return Object.entries(sm)
            .map(([sector, v]) => ({ sector, avgIntensity: v.total / v.count }))
            .sort((a, b) => b.avgIntensity - a.avgIntensity)
            .slice(0, 8);
    }, [data]);

    const overallAverage = chartData.length ? (chartData.reduce((s, i) => s + i.avgIntensity, 0) / chartData.length).toFixed(1) : 0;
    const topSector = chartData?.[0]?.sector || '-';

    // =====================================
    // CHART SETUP
    // =====================================
    const width = 920, height = 380;
    const margin = { top: 30, right: 20, bottom: 75, left: 20 };

    const xScale = useMemo(() => d3.scalePoint().domain(chartData.map(d => d.sector)).range([margin.left, width - margin.right]).padding(0.5), [chartData]);
    const yScale = useMemo(() => d3.scaleLinear().domain([0, (d3.max(chartData, d => d.avgIntensity) || 0) * 1.1]).nice().range([height - margin.bottom, margin.top]), [chartData]);

    // =====================================
    // D3 RENDERING
    // =====================================
    useEffect(() => {
        if (!chartData.length) return;
        const g = d3.select(d3ContainerRef.current);
        g.selectAll('*').remove();

        // Defs & Gradient
        const gradient = g.append('defs').append('linearGradient').attr('id', 'area-gradient').attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
        gradient.append('stop').attr('offset', '0%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0.35);
        gradient.append('stop').attr('offset', '100%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0.01);

        // Grid & Axes
        g.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(yScale).ticks(5).tickSize(-width + margin.left + margin.right).tickFormat('')).selectAll('line').attr('stroke', 'var(--border)').attr('stroke-dasharray', '4,4').attr('opacity', 0.4);
        g.selectAll('.domain').remove();
        g.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(xScale).tickSize(0)).selectAll('text').remove();
        g.append('g').attr('transform', `translate(${margin.left - 10},0)`).call(d3.axisLeft(yScale).ticks(5).tickSize(0)).selectAll('text').style('fill', 'var(--foreground-muted)').style('font-size', '11px').style('font-weight', '500');

        // Area & Line
        const area = d3.area().x(d => xScale(d.sector)).y0(height - margin.bottom).y1(d => yScale(d.avgIntensity)).curve(d3.curveMonotoneX);
        const line = d3.line().x(d => xScale(d.sector)).y(d => yScale(d.avgIntensity)).curve(d3.curveMonotoneX);
        
        g.append('path').datum(chartData).attr('fill', 'url(#area-gradient)').attr('d', area).attr('opacity', 0).transition().duration(900).attr('opacity', 1);
        
        const linePath = g.append('path').datum(chartData).attr('fill', 'none').attr('stroke', '#06b6d4').attr('stroke-width', 3).attr('stroke-linecap', 'round').attr('d', line);
        const pathLength = linePath.node().getTotalLength();
        linePath.attr('stroke-dasharray', pathLength).attr('stroke-dashoffset', pathLength).transition().duration(1400).ease(d3.easeCubicOut).attr('stroke-dashoffset', 0);

        // Interactive Points
        g.selectAll('.point').data(chartData).enter().append('circle').attr('class', 'point').attr('cx', d => xScale(d.sector)).attr('cy', d => yScale(d.avgIntensity)).attr('r', 0).attr('fill', '#06b6d4').attr('stroke', 'var(--surface)').attr('stroke-width', 2.5).style('cursor', 'pointer')
            .on('mousemove', function (event, d) {
                d3.select(this).transition().duration(150).attr('r', 8);
                setTooltip({ show: true, x: event.clientX, y: event.clientY, data: d });
            })
            .on('mouseleave', function () {
                d3.select(this).transition().duration(150).attr('r', 5.5);
                setTooltip(prev => ({ ...prev, show: false }));
            })
            .transition().duration(500).delay((d, i) => i * 80 + 400).attr('r', 5.5);

    }, [chartData, xScale, yScale]);

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-[var(--surface)]/80 backdrop-blur-xl p-4 shadow-xl transition-all duration-300 hover:shadow-2xl">
            
            {/* TOOLTIP */}
            {tooltip.show && tooltip.data && (
                <div className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full pb-4" style={{ left: tooltip.x, top: tooltip.y }}>
                    <div className="min-w-[190px] rounded-2xl border app-border bg-[var(--surface-strong)] p-4 shadow-2xl">
                        <div className="mb-3 flex items-center gap-3 border-b app-border pb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                                {getSectorIcon(tooltip.data.sector, 20, 'text-cyan-500')}
                            </div>
                            <div className="truncate text-sm font-bold app-text">{tooltip.data.sector}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider app-text-muted">Avg Intensity</span>
                            <span className="text-base font-bold text-cyan-500">{tooltip.data.avgIntensity.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-500">
                        <Sparkles size={12} /> Sector Analytics
                    </div>
                    <h2 className="text-xl font-bold app-text">Sector Intensity Curve</h2>
                    <p className="mt-1 max-w-xl text-sm leading-5 app-text-muted">Smooth distribution mapping the average intensity across top performing sectors.</p>
                </div>
                <button className="flex items-center gap-2 rounded-2xl border app-border bg-[var(--surface-strong)] px-4 py-2 text-sm font-medium app-text transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500 hover:text-cyan-500">
                    <TrendingUp size={15} /> Analyze Growth
                </button>
            </div>

            {/* STATS */}
            <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-[2fr_2fr_4fr]">
    
    <div className="flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-4 py-2 transition-all hover:bg-[var(--surface-strong)]/60">
        <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted">Sectors</span>
        <span className="text-base font-bold app-text">{chartData.length}</span>
    </div>
    
    <div className="flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-4 py-2 transition-all hover:bg-[var(--surface-strong)]/60">
        <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted">Average</span>
        <span className="text-base font-bold text-cyan-500">{overallAverage}</span>
    </div>
    
    <div className="flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-4 py-2 transition-all hover:bg-[var(--surface-strong)]/60">
        <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted">Leader</span>
        <div className="flex items-center gap-2 font-bold text-violet-500">
            {getSectorIcon(topSector, 15, 'text-violet-500')}
            <span className="max-w-[180px] truncate text-sm capitalize">{topSector}</span>
        </div>
    </div>
    
</div>

            {/* CHART */}
            <div className="relative w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full">
                    <g ref={d3ContainerRef} />
                    <g className="react-labels">
                        {chartData.map((item, index) => {
                            const words = item.sector.split(' ');
                            
                            return (
                                <foreignObject key={index} x={xScale(item.sector) - 45} y={height - margin.bottom + 12} width={90} height={70}>
    <div 
        xmlns="http://www.w3.org/1999/xhtml" 
        // 1. Added group class here to track the hover state of the entire box
        className="flex flex-col items-center text-center w-full cursor-pointer group"
        onMouseMove={(e) => {
            setTooltip({
                show: true,
                x: e.clientX,
                y: e.clientY - 15,
                data: item,      
            });
        }}
        onMouseLeave={() => {
            setTooltip(prev => ({ ...prev, show: false }));
        }}
    >
        {/* 2. Added group-hover:bg-cyan-500/10 and group-hover:text-cyan-500 */}
        <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--foreground)] shadow-sm transition-colors duration-200 group-hover:bg-cyan-500/10 group-hover:text-cyan-500">
            {getSectorIcon(item.sector, 15)}
        </div>
        
        {/* 3. Replaced fixed text colors with group-hover overrides */}
        <span className="text-[10px] font-semibold leading-tight capitalize text-[var(--foreground)] transition-colors duration-200 group-hover:text-cyan-500">
            {words[0]}
        </span>
        
        {words.length > 1 && (
            <span className="max-w-[80px] text-[10px] font-semibold leading-tight capitalize text-[var(--foreground)] transition-colors duration-200 group-hover:text-cyan-500">
                {words.slice(1).join(' ')}
            </span>
        )}
    </div>
</foreignObject>
                            );
                        })}
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default IntensityAreaChart;