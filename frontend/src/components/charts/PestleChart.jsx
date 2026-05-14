import { useEffect, useRef } from 'react';

import * as d3 from 'd3';


const PestleChart = ({ data }) => {

    const svgRef = useRef();


    useEffect(() => {

        if (!data || data.length === 0) return;

        // Clear old chart
        d3.select(svgRef.current).selectAll('*').remove();


        // ==========================================
        // PREPARE DATA
        // ==========================================
        const pestleCounts = {};

        data.forEach((item) => {

            if (!item.pestle) return;

            pestleCounts[item.pestle] =
                (pestleCounts[item.pestle] || 0) + 1;
        });


        const chartData = Object.entries(pestleCounts)
            .map(([pestle, count]) => ({
                pestle,
                count,
            }))
            .sort((a, b) => b.count - a.count);


        // ==========================================
        // SVG SETUP
        // ==========================================
        const width = 700;

        const height = 450;

        const margin = {
            top: 20,
            right: 30,
            bottom: 40,
            left: 180,
        };


        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
.attr('preserveAspectRatio', 'xMidYMid meet')
.style('width', '100%')
.style('height', 'auto')


        // ==========================================
        // SCALES
        // ==========================================
        const yScale = d3
            .scaleBand()
            .domain(chartData.map(d => d.pestle))
            .range([
                margin.top,
                height - margin.bottom,
            ])
            .padding(0.25);


        const xScale = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(chartData, d => d.count),
            ])
            .nice()
            .range([
                margin.left,
                width - margin.right,
            ]);


        // ==========================================
        // AXES
        // ==========================================
        const yAxis = d3.axisLeft(yScale);

        const xAxis = d3.axisBottom(xScale);


        svg.append('g')
            .attr(
                'transform',
                `translate(${margin.left},0)`
            )
            .call(yAxis)
            .selectAll('text')
            .style('fill', 'white')
            .style('font-size', '12px');


        svg.append('g')
            .attr(
                'transform',
                `translate(0,${
                    height - margin.bottom
                })`
            )
            .call(xAxis)
            .selectAll('text')
            .style('fill', 'white');


        // ==========================================
        // BARS
        // ==========================================
        svg.selectAll('.bar')
            .data(chartData)
            .enter()
            .append('rect')
            .attr('x', margin.left)
            .attr('y', d => yScale(d.pestle))
            .attr(
                'width',
                d => xScale(d.count) - margin.left
            )
            .attr(
                'height',
                yScale.bandwidth()
            )
            .attr('fill', '#8b5cf6');


    }, [data]);


    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <h3 className="text-xl font-semibold mb-4 text-white">
                PESTLE Analysis
            </h3>

            <div className="w-full overflow-x-auto">
                <svg ref={svgRef}></svg>
            </div>

        </div>
    );
};


export default PestleChart;