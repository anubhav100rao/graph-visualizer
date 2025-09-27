import React, { useRef, useEffect } from 'react';
import { Point } from '../types';

declare const d3: any;

interface ScatterPlotProps {
  data: Point[];
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    
    const parentNode = svg.node().parentNode;
    if (!parentNode) return;
    const parentRect = parentNode.getBoundingClientRect();

    const width = parentRect.width - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const chart = svg
      .attr('width', parentRect.width)
      .attr('height', 500)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Find data range for scales, adding some padding for visibility
    const [minX, maxX] = d3.extent(data, (d: Point) => d.x);
    const [minY, maxY] = d3.extent(data, (d: Point) => d.y);

    const xPadding = (maxX - minX) * 0.1 || 1;
    const yPadding = (maxY - minY) * 0.1 || 1;
    
    // Handle cases where all points have the same x or y value
    const domainX = (minX === maxX) ? [minX - 1, maxX + 1] : [minX - xPadding, maxX + xPadding];
    const domainY = (minY === maxY) ? [minY - 1, maxY + 1] : [minY - yPadding, maxY + yPadding];

    // Add X axis
    const x = d3.scaleLinear().domain(domainX).range([0, width]);
    const xAxis = chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear().domain(domainY).range([height, 0]);
    const yAxis = chart.append('g')
      .call(d3.axisLeft(y));

    // Style axes to make them more prominent
    [xAxis, yAxis].forEach(axis => {
        axis.selectAll('text').style('font-size', '12px').style('fill', '#374151');
        axis.select('.domain').attr('stroke', '#6b7280');
        axis.selectAll('line').attr('stroke', '#d1d5db');
    });

    // X-axis Label
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2 + margin.left)
        .attr('y', height + margin.top + 40)
        .style('font-size', '14px')
        .style('fill', '#374151')
        .text('X-axis');

    // Y-axis Label
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('y', margin.left - 45)
        .attr('x', -height / 2 - margin.top)
        .style('font-size', '14px')
        .style('fill', '#374151')
        .text('Y-axis');

    // Add dots with tooltips
    const dots = chart.append('g');
    
    dots.selectAll('circle')
      .data(data)
      .join('circle')
        .attr('cx', (d: Point) => x(d.x))
        .attr('cy', (d: Point) => y(d.y))
        .attr('r', 6)
        .attr('fill', '#4f46e5')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
      .append('title')
        .text((d: Point) => `(x: ${d.x}, y: ${d.y})`);
        
    // Add coordinate labels
    dots.selectAll('text')
      .data(data)
      .join('text')
        .attr('x', (d: Point) => x(d.x) + 10)
        .attr('y', (d: Point) => y(d.y) + 5)
        .text((d: Point) => `(${d.x}, ${d.y})`)
        .attr('font-size', '12px')
        .attr('fill', '#6b7280');

  }, [data]);
  
  return <svg ref={svgRef} className="w-full"></svg>;
};

export default ScatterPlot;