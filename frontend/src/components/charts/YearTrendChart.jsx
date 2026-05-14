import { useEffect, useRef } from 'react';

import * as d3 from 'd3';


const YearTrendChart = ({ data }) => {

    const svgRef = useRef();


    useEffect(() => {

        if (!data || data.length === 0) return;

        // Clear previous SVG
        d3.select(svgRef.current).selectAll('*').remove();


        // ==========================================
        // PREPARE DATA
        // ==========================================
        const yearCounts = {};

        data.forEach((item) => {

            if (!item.end_year) return;

            yearCounts[item.end_year] =
                (yearCounts[item.end_year] || 0) + 1;
        });


        const chartData = Object.entries(yearCounts)
            .map(([year, count]) => ({
                year: Number(year),
                count,
            }))
            .sort((a, b) => a.year - b.year);


        // ==========================================
        // SVG SETUP
        // ==========================================
        const width = 800;

        const height = 400;

        const margin = {
            top: 20,
            right: 30,
            bottom: 60,
            left: 60,
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
        const xScale = d3
            .scaleLinear()
            .domain(d3.extent(chartData, d => d.year))
            .range([
                margin.left,
                width - margin.right,
            ]);


        const yScale = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(chartData, d => d.count),
            ])
            .nice()
            .range([
                height - margin.bottom,
                margin.top,
            ]);


        // ==========================================
        // AXES
        // ==========================================
        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format('d'));

        const yAxis = d3.axisLeft(yScale);


        svg.append('g')
            .attr(
                'transform',
                `translate(0, ${
                    height - margin.bottom
                })`
            )
            .call(xAxis)
            .selectAll('text')
            .style('fill', 'white');


        svg.append('g')
            .attr(
                'transform',
                `translate(${margin.left},0)`
            )
            .call(yAxis)
            .selectAll('text')
            .style('fill', 'white');


        // ==========================================
        // LINE GENERATOR
        // ==========================================
        const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.count))
            .curve(d3.curveMonotoneX);


        // ==========================================
        // DRAW LINE
        // ==========================================
        svg.append('path')
            .datum(chartData)
            .attr('fill', 'none')
            .attr('stroke', '#f59e0b')
            .attr('stroke-width', 3)
            .attr('d', line);


        // ==========================================
        // DRAW DOTS
        // ==========================================
        svg.selectAll('circle')
            .data(chartData)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.year))
            .attr('cy', d => yScale(d.count))
            .attr('r', 5)
            .attr('fill', '#f59e0b');


    }, [data]);


    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <h3 className="text-xl font-semibold mb-4 text-white">
                Year Trend Analysis
            </h3>

            <div className="w-full overflow-x-auto">
                <svg ref={svgRef}></svg>
            </div>

        </div>
    );
};


export default YearTrendChart;