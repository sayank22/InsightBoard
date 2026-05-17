import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import {
    Activity,
    Layers3,
    Sparkles,
} from 'lucide-react';

const BubbleChart = ({ data }) => {
    const svgRef = useRef();

    // =====================================
    // MEMOIZED DATA
    // =====================================
    const validData = useMemo(() => {
        return (
            data?.filter(
                (item) =>
                    item.intensity > 0 &&
                    item.relevance > 0 &&
                    item.likelihood > 0
            ) || []
        );
    }, [data]);

    useEffect(() => {
        if (!validData.length) return;

        d3.select(svgRef.current).selectAll('*').remove();
        d3.selectAll('.bubble-tooltip').remove();

        // =====================================
        // PERFORMANCE LIMIT
        // =====================================
        const chartData = validData.slice(0, 120);

        // =====================================
        // DIMENSIONS (Maximized for space)
        // =====================================
        const width = 1000;
        const height = 300; 
        // Reduced margins so the chart stretches further to the edges
        const margin = { top: 20, right: 20, bottom: 50, left: 50 };

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
            .scaleLinear()
            .domain([0, d3.max(chartData, (d) => d.relevance)])
            .nice()
            .range([margin.left, width - margin.right]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(chartData, (d) => d.intensity)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const radiusScale = d3
            .scaleSqrt()
            .domain([0, d3.max(chartData, (d) => d.likelihood)])
            .range([4, 24]); // Slightly scaled down max bubble size

        // =====================================
        // COLORS
        // =====================================
        const colors = [
            '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', 
            '#ef4444', '#ec4899', '#3b82f6', '#84cc16'
        ];

        const topics = [...new Set(chartData.map((d) => d.topic || 'Unknown'))];
        const colorScale = d3.scaleOrdinal().domain(topics).range(colors);

        // =====================================
        // GRID
        // =====================================
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(6).tickSize(-height + margin.top + margin.bottom).tickFormat(''))
            .selectAll('line')
            .attr('stroke', 'var(--border)')
            .attr('stroke-dasharray', '4,4')
            .attr('opacity', 0.5);

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(6).tickSize(-width + margin.left + margin.right).tickFormat(''))
            .selectAll('line')
            .attr('stroke', 'var(--border)')
            .attr('stroke-dasharray', '4,4')
            .attr('opacity', 0.5);

        svg.selectAll('.domain').remove();

        // =====================================
        // AXES (Smaller text)
        // =====================================
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(6))
            .selectAll('text')
            .style('fill', 'var(--foreground-muted)')
            .style('font-size', '11px'); // 12px -> 11px

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(6))
            .selectAll('text')
            .style('fill', 'var(--foreground-muted)')
            .style('font-size', '11px'); // 12px -> 11px

        // =====================================
        // AXIS LABELS (Smaller text)
        // =====================================
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 10)
            .attr('text-anchor', 'middle')
            .style('fill', 'var(--foreground)')
            .style('font-size', '12px') // 13px -> 12px
            .style('font-weight', '600')
            .text('Relevance Score');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', 16)
            .attr('text-anchor', 'middle')
            .style('fill', 'var(--foreground)')
            .style('font-size', '12px') // 13px -> 12px
            .style('font-weight', '600')
            .text('Intensity Score');

        // =====================================
        // TOOLTIP
        // =====================================
        const tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'bubble-tooltip')
            .style('position', 'absolute')
            .style('opacity', 0)
            .style('pointer-events', 'none')
            .style('background', 'var(--surface-strong)')
            .style('border', '1px solid var(--border)')
            .style('border-radius', '12px')
            .style('padding', '10px 14px')
            .style('color', 'var(--foreground)')
            .style('font-size', '12px') // 13px -> 12px
            .style('box-shadow', '0 10px 25px -5px rgba(0,0,0,0.1)')
            .style('z-index', '50');

        // =====================================
        // BUBBLES
        // =====================================
        const bubbles = svg
            .selectAll('.bubble')
            .data(chartData)
            .enter()
            .append('circle')
            .attr('class', 'bubble')
            .attr('cx', (d) => xScale(d.relevance))
            .attr('cy', (d) => yScale(d.intensity))
            .attr('r', 0)
            .attr('fill', (d) => colorScale(d.topic || 'Unknown'))
            .attr('fill-opacity', 0.75)
            .attr('stroke', 'var(--surface)')
            .attr('stroke-width', 1.5)
            .style('cursor', 'crosshair');

        bubbles
            .transition()
            .duration(700)
            .delay((d, i) => i * 3)
            .ease(d3.easeBackOut.overshoot(1.5))
            .attr('r', (d) => radiusScale(d.likelihood));

        bubbles
            .on('mouseenter', function (event, d) {
                d3.selectAll('.bubble').transition().duration(150).attr('fill-opacity', 0.15);
                d3.select(this)
                    .raise()
                    .transition().duration(150)
                    .attr('stroke', 'var(--foreground)')
                    .attr('stroke-width', 2.5)
                    .attr('fill-opacity', 1)
                    .attr('r', radiusScale(d.likelihood) + 4);

                const bubbleColor = colorScale(d.topic || 'Unknown');

                tooltip
                    .style('opacity', 1)
                    .html(`
                        <div style="font-weight:700; margin-bottom:6px; font-size:13px; text-transform:capitalize; border-bottom:1px solid var(--border); padding-bottom:4px; color:var(--foreground);">
                            ${d.topic || 'Unknown'}
                        </div>
                        <div style="display:grid; grid-template-columns:auto auto; gap:4px 14px; font-size:11px; color:var(--foreground-muted);">
                            <span>Intensity</span><strong style="color:${bubbleColor};">${d.intensity}</strong>
                            <span>Relevance</span><strong style="color:${bubbleColor};">${d.relevance}</strong>
                            <span>Likelihood</span><strong style="color:${bubbleColor};">${d.likelihood}</strong>
                        </div>
                    `);
            })
            .on('mousemove', function (event) {
                tooltip.style('left', `${event.pageX + 16}px`).style('top', `${event.pageY - 40}px`);
            })
            .on('mouseleave', function () {
                d3.selectAll('.bubble')
                    .transition().duration(200)
                    .attr('stroke', 'var(--surface)')
                    .attr('stroke-width', 1.5)
                    .attr('fill-opacity', 0.75)
                    .attr('r', (d) => radiusScale(d.likelihood));
                tooltip.style('opacity', 0);
            });

        return () => {
            d3.selectAll('.bubble-tooltip').remove();
        };
    }, [validData]);

    // =====================================
    // STATS
    // =====================================
    const avgIntensity = validData.length > 0
        ? (validData.reduce((sum, item) => sum + item.intensity, 0) / validData.length).toFixed(1)
        : 0;

    const topicCount = new Set(validData.map((item) => item.topic || 'Unknown')).size;

    return (
        <div className="relative overflow-hidden rounded-3xl border app-border bg-[var(--surface)] p-5 shadow-xl transition-all duration-300 hover:shadow-2xl">
            
            {/* HEADER - Stepped down fonts 1 level */}
            <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                        <Sparkles size={12} />
                        Correlation Analytics
                    </div>
                    <h2 className="text-lg font-bold app-text">
                        Bubble Intelligence Map
                    </h2>
                    <p className="mt-0.5 max-w-2xl text-[13px] leading-5 app-text-muted">
                        Relationship between relevance, intensity, and likelihood across different topics.
                    </p>
                </div>

                <button className="flex items-center gap-2 rounded-xl border app-border bg-[var(--surface-strong)] px-4 py-2 text-[13px] font-medium app-text transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-500">
                    <Activity size={15} />
                    Analyze Trends
                </button>
            </div>

            {/* STATS - Stepped down fonts 1 level */}
            <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-3">
                <div className="flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-2 transition-all hover:bg-[var(--surface-strong)]/60">
                    <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted">Data Points</span>
                    <span className="text-base font-bold app-text">{validData.length}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-2 transition-all hover:bg-[var(--surface-strong)]/60">
                    <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted">Avg Intensity</span>
                    <span className="text-base font-bold text-cyan-500">{avgIntensity}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border app-border bg-[var(--surface-strong)]/40 px-3 py-2 transition-all hover:bg-[var(--surface-strong)]/60">
                    <div className="flex items-center gap-2">
                        <Layers3 size={14} className="text-violet-500" />
                        <span className="text-[11px] font-semibold uppercase tracking-wider app-text-muted">Categories</span>
                    </div>
                    <span className="text-base font-bold text-violet-500">{topicCount}</span>
                </div>
            </div>

            {/* CHART - Removed outer box, uses full width seamlessly */}
            <div className="relative w-full mt-2">
                <svg ref={svgRef} className="block w-full h-auto" />
            </div>
            
        </div>
    );
};

export default BubbleChart;