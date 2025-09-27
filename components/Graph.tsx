
import React, { useRef, useEffect } from 'react';
import { Point, GraphType } from '../types';

declare const d3: any;

interface GraphProps {
  data: Point[];
  type: GraphType;
}

const Graph: React.FC<GraphProps> = ({ data, type }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svg.node().getBoundingClientRect().width;
    const height = 450;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };

    const xExtent = d3.extent(data, (d: Point) => d.x) as [number, number];
    const yExtent = d3.extent(data, (d: Point) => d.y) as [number, number];
    
    const padding = (Math.max(xExtent[1] - xExtent[0], yExtent[1] - yExtent[0])) * 0.1 || 1;

    const xScale = d3.scaleLinear()
      .domain([xExtent[0] - padding, xExtent[1] + padding])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] - padding, yExtent[1] + padding])
      .range([height - margin.bottom, margin.top]);

    const chart = svg.attr('width', width).attr('height', height);

    // Arrowhead marker for directed graph
    if (type === 'directed') {
      chart.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 19) // Position arrowhead at the edge of the circle
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#6b7280');
    }

    // Prepare edges (links)
    const edges = [];
    for (let i = 0; i < data.length - 1; i++) {
      edges.push({ source: data[i], target: data[i + 1] });
    }

    // Draw edges
    chart.selectAll('.link')
      .data(edges)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', (d: any) => xScale(d.source.x))
      .attr('y1', (d: any) => yScale(d.source.y))
      .attr('x2', (d: any) => xScale(d.target.x))
      .attr('y2', (d: any) => yScale(d.target.y))
      .attr('stroke', '#9ca3af')
      .attr('stroke-width', 2)
      .attr('marker-end', type === 'directed' ? 'url(#arrowhead)' : null);

    // Draw nodes
    const nodes = chart.selectAll('.node')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: Point) => `translate(${xScale(d.x)},${yScale(d.y)})`);
      
    nodes.append('circle')
      .attr('r', 8)
      .attr('fill', '#4f46e5')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);
      
    // Draw labels
    nodes.append('text')
      .text((d: Point) => `(${d.x}, ${d.y})`)
      .attr('x', 12)
      .attr('y', 4)
      .attr('font-size', '12px')
      .attr('fill', '#374151');

  }, [data, type]);

  return <svg ref={svgRef} className="w-full h-full"></svg>;
};

export default Graph;
