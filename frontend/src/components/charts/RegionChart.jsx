import { useEffect, useRef } from 'react';

import * as d3 from 'd3';


const RegionChart = ({ data }) => {

    const svgRef = useRef();


    useEffect(() => {

        if (!data || data.length === 0) return;

        // Clear previous SVG
        d3.select(svgRef.current).selectAll('*').remove();


        // ==========================================
        // PREPARE DATA
        // ==========================================
        const regionCounts = {};

        data.forEach((item) => {

            if (!item.region) return;

            regionCounts[item.region] =
                (regionCounts[item.region] || 0) + 1;
        });


        const chartData = Object.entries(regionCounts)
            .map(([region, count]) => ({
                region,
                count,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);


        // ==========================================
        // SVG SETUP
        // ==========================================
        const width = 600;

        const height = 400;

        const margin = {
            top: 20,
            right: 20,
            bottom: 100,
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
            .scaleBand()
            .domain(chartData.map((d) => d.region))
            .range([margin.left, width - margin.right])
            .padding(0.3);


        const yScale = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(chartData, (d) => d.count),
            ])
            .nice()
            .range([
                height - margin.bottom,
                margin.top,
            ]);


        // ==========================================
        // AXES
        // ==========================================
        const xAxis = d3.axisBottom(xScale);

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
            .attr('transform', 'rotate(-25)')
            .style('text-anchor', 'end')
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
        // BARS
        // ==========================================
        svg.selectAll('.bar')
            .data(chartData)
            .enter()
            .append('rect')
            .attr('x', (d) => xScale(d.region))
            .attr('y', (d) => yScale(d.count))
            .attr('width', xScale.bandwidth())
            .attr(
                'height',
                (d) =>
                    height -
                    margin.bottom -
                    yScale(d.count)
            )
            .attr('fill', '#10b981');


    }, [data]);


    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <h3 className="text-xl font-semibold mb-4 text-white">
                Region Analysis
            </h3>

            <div className="w-full overflow-x-auto">
                <svg ref={svgRef}></svg>
            </div>

        </div>
    );
};


export default RegionChart;