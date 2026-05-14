import { useEffect, useRef } from 'react';

import * as d3 from 'd3';


const BubbleChart = ({ data }) => {

    const svgRef = useRef();


    useEffect(() => {

        if (!data || data.length === 0) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll('*').remove();


        // ==========================================
        // FILTER VALID DATA
        // ==========================================
        const chartData = data.filter(
            item =>
                item.intensity > 0 &&
                item.relevance > 0 &&
                item.likelihood > 0
        );


        // ==========================================
        // SVG SETUP
        // ==========================================
        const width = 850;

        const height = 500;

        const margin = {
            top: 20,
            right: 40,
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
            .domain([
                0,
                d3.max(chartData, d => d.relevance),
            ])
            .nice()
            .range([
                margin.left,
                width - margin.right,
            ]);


        const yScale = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(chartData, d => d.intensity),
            ])
            .nice()
            .range([
                height - margin.bottom,
                margin.top,
            ]);


        const radiusScale = d3
            .scaleSqrt()
            .domain([
                0,
                d3.max(chartData, d => d.likelihood),
            ])
            .range([5, 30]);


        // ==========================================
        // AXES
        // ==========================================
        const xAxis = d3.axisBottom(xScale);

        const yAxis = d3.axisLeft(yScale);


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


        svg.append('g')
            .attr(
                'transform',
                `translate(${margin.left},0)`
            )
            .call(yAxis)
            .selectAll('text')
            .style('fill', 'white');


        // ==========================================
        // AXIS LABELS
        // ==========================================
        svg.append('text')
            .attr(
                'x',
                width / 2
            )
            .attr(
                'y',
                height - 15
            )
            .style('text-anchor', 'middle')
            .style('fill', 'white')
            .text('Relevance');


        svg.append('text')
            .attr(
                'transform',
                'rotate(-90)'
            )
            .attr(
                'x',
                -height / 2
            )
            .attr(
                'y',
                20
            )
            .style('text-anchor', 'middle')
            .style('fill', 'white')
            .text('Intensity');


        // ==========================================
        // TOOLTIP
        // ==========================================
        const tooltip = d3
            .select('body')
            .append('div')
            .style('position', 'absolute')
            .style('background', '#0f172a')
            .style('color', 'white')
            .style('padding', '10px')
            .style('border-radius', '8px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('opacity', 0);


        // ==========================================
        // DRAW BUBBLES
        // ==========================================
        svg.selectAll('circle')
            .data(chartData)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.relevance))
            .attr('cy', d => yScale(d.intensity))
            .attr(
                'r',
                d => radiusScale(d.likelihood)
            )
            .attr('fill', '#06b6d4')
            .attr('opacity', 0.7)
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1)

            // Tooltip events
            .on('mouseover', (event, d) => {

                tooltip
                    .style('opacity', 1)
                    .html(`
                        <strong>${d.topic || 'No Topic'}</strong><br/>
                        Intensity: ${d.intensity}<br/>
                        Relevance: ${d.relevance}<br/>
                        Likelihood: ${d.likelihood}
                    `);
            })

            .on('mousemove', (event) => {

                tooltip
                    .style(
                        'left',
                        `${event.pageX + 10}px`
                    )
                    .style(
                        'top',
                        `${event.pageY - 20}px`
                    );
            })

            .on('mouseout', () => {

                tooltip.style('opacity', 0);
            });


    }, [data]);


    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <h3 className="text-xl font-semibold mb-4 text-white">
                Intensity vs Relevance vs Likelihood
            </h3>

            <div className="w-full overflow-x-auto">
                <svg ref={svgRef}></svg>
            </div>

        </div>
    );
};


export default BubbleChart;