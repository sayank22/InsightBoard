import { useEffect, useRef } from 'react';

import * as d3 from 'd3';


const TopicPieChart = ({ data }) => {

    const svgRef = useRef();


    useEffect(() => {

        if (!data || data.length === 0) return;

        // Clear old SVG
        d3.select(svgRef.current).selectAll('*').remove();


        // ==========================================
        // PREPARE DATA
        // ==========================================
        const topicCounts = {};

        data.forEach((item) => {

            if (!item.topic) return;

            topicCounts[item.topic] =
                (topicCounts[item.topic] || 0) + 1;
        });


        const chartData = Object.entries(topicCounts)
            .map(([topic, count]) => ({
                topic,
                count,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);


        // ==========================================
        // SVG SETUP
        // ==========================================
        const width = 450;

        const height = 400;

        const radius = Math.min(width, height) / 2;


        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
.attr('preserveAspectRatio', 'xMidYMid meet')
.style('width', '100%')
.style('height', 'auto')
            .append('g')
            .attr(
                'transform',
                `translate(${width / 2}, ${height / 2})`
            );


        // ==========================================
        // COLORS
        // ==========================================
        const color = d3.scaleOrdinal(d3.schemeTableau10);


        // ==========================================
        // PIE GENERATOR
        // ==========================================
        const pie = d3
            .pie()
            .value((d) => d.count);


        const dataReady = pie(chartData);


        // ==========================================
        // ARC GENERATOR
        // ==========================================
        const arc = d3
            .arc()
            .innerRadius(0)
            .outerRadius(radius - 40);


        // ==========================================
        // DRAW PIE
        // ==========================================
        svg.selectAll('path')
            .data(dataReady)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', (d) => color(d.data.topic))
            .attr('stroke', '#0f172a')
            .style('stroke-width', '2px');


        // ==========================================
        // LABELS
        // ==========================================
        svg.selectAll('text')
            .data(dataReady)
            .enter()
            .append('text')
            .text((d) => d.data.topic)
            .attr(
                'transform',
                (d) => `translate(${arc.centroid(d)})`
            )
            .style('text-anchor', 'middle')
            .style('font-size', '10px')
            .style('fill', 'white');


    }, [data]);


    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <h3 className="text-xl font-semibold mb-4 text-white">
                Topic Distribution
            </h3>

            <div className="flex justify-center w-full overflow-x-auto">
                <svg ref={svgRef}></svg>
            </div>

        </div>
    );
};


export default TopicPieChart;