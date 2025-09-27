
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

    // --- Data Preparation ---
    // The input 'data' is a list of Points {x, y}, which we interpret as edges {source, target}.
    const links = data.map(p => ({ source: p.x, target: p.y }));
    
    // Deduplicate nodes from the links
    const nodeIds = new Set<number>();
    links.forEach(link => {
      nodeIds.add(link.source);
      nodeIds.add(link.target);
    });
    
    // Create nodes array for D3 simulation
    const nodes = Array.from(nodeIds).map(id => ({ id }));

    // --- D3 Setup ---
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = svg.node().getBoundingClientRect().width;
    const height = 500;
    svg.attr('width', width).attr('height', height);

    // Arrowhead marker for directed graph
    if (type === 'directed') {
      svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 15) // Adjust position to be at the edge of the circle
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#6b7280');
    }

    // --- Simulation ---
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // --- Drawing Elements ---
    const link = svg.append('g')
      .attr('stroke', '#9ca3af')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 2)
      .attr('marker-end', type === 'directed' ? 'url(#arrowhead)' : null);

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 8)
      .attr('fill', '#4f46e5');

    const labels = svg.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
        .attr("x", 12)
        .attr("y", 4)
        .attr('font-size', '12px')
        .attr('fill', '#374151')
        .text((d: any) => d.id);
        
    node.append("title")
        .text((d: any) => d.id);

    // --- Simulation Ticker ---
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
      
      labels
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // --- Drag Interactivity ---
    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
    }
    
    node.call(drag(simulation));

  }, [data, type]);

  return <svg ref={svgRef} className="w-full h-full"></svg>;
};

export default Graph;
