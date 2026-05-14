import { useEffect, useRef } from 'react';

import * as d3 from 'd3';


const IntensityBarChart = ({ data }) => {

    const svgRef = useRef();


    useEffect(() => {

        if (!data || data.length === 0) return;

        // Clear old SVG
        d3.select(svgRef.current).selectAll('*').remove();


        // ==========================================
        // PREPARE DATA
        // ==========================================
        const sectorMap = {};

        data.forEach((item) => {

            if (!item.sector) return;

            if (!sectorMap[item.sector]) {
                sectorMap[item.sector] = {
                    total: 0,
                    count: 0,
                };
            }

            sectorMap[item.sector].total += item.intensity || 0;

            sectorMap[item.sector].count += 1;
        });


        const chartData = Object.entries(sectorMap).map(
            ([sector, values]) => ({
                sector,
                avgIntensity:
                    values.total / values.count,
            })
        );


        // ==========================================
        // SVG SETUP
        // ==========================================
        const width = 800;

        const height = 400;

        const margin = {
            top: 20,
            right: 20,
            bottom: 80,
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
            .domain(chartData.map((d) => d.sector))
            .range([margin.left, width - margin.right])
            .padding(0.3);


        const yScale = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(
                    chartData,
                    (d) => d.avgIntensity
                ),
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
            .attr('transform', 'rotate(-30)')
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
            .attr('x', (d) => xScale(d.sector))
            .attr('y', (d) =>
                yScale(d.avgIntensity)
            )
            .attr('width', xScale.bandwidth())
            .attr(
                'height',
                (d) =>
                    height -
                    margin.bottom -
                    yScale(d.avgIntensity)
            )
            .attr('fill', '#3b82f6');


    }, [data]);


    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <h3 className="text-xl font-semibold mb-4 text-white">
                Average Intensity by Sector
            </h3>

            <div className="w-full overflow-x-auto">
                <svg ref={svgRef}></svg>
            </div>

        </div>
    );
};


export default IntensityBarChart;