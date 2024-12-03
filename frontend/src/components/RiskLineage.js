import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey';
import { getAllStatus } from '../api/completionStatusApi';

const LineageDiagram = () => {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statuses = await getAllStatus();
        console.log('Fetched statuses:', statuses); // Log fetched data
        const groupedData = processLineageData(statuses);
        console.log('Processed data:', groupedData); // Log processed data
        setData(groupedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const processLineageData = (statuses) => {
    const nodes = [];
    const links = [];
    let nodeIndex = 0;

    // Create completion status nodes
    const completedId = nodeIndex++;
    const incompleteId = nodeIndex++;
    nodes.push(
      {
        id: completedId,
        name: 'Completed',
        type: 'status',
        category: 'completed',
        size: 0,
      },
      {
        id: incompleteId,
        name: 'Incomplete',
        type: 'status',
        category: 'incomplete',
        size: 0,
      }
    );

    // Create maps to track families and grouped controls
    const familyMap = new Map();
    const controlFamilyMap = new Map();

    // First pass: Create family and grouped control nodes
    statuses.forEach((status) => {
      const familyDesc = status.familyId.family_desc;
      const controlFamilyDesc = status.controlId.control_Family_Id;

      // Handle family nodes
      if (!familyMap.has(familyDesc)) {
        familyMap.set(familyDesc, {
          id: nodeIndex++,
          name: familyDesc,
          type: 'family',
        });
        nodes.push(familyMap.get(familyDesc));
      }

      // Handle grouped control nodes by control_Family_Id
      if (!controlFamilyMap.has(controlFamilyDesc)) {
        controlFamilyMap.set(controlFamilyDesc, {
          id: nodeIndex++,
          name: status.controlId.section,
          type: 'controlGroup',
          familyId: familyMap.get(familyDesc).id,
        });
        nodes.push(controlFamilyMap.get(controlFamilyDesc));
      }

      // Link from grouped control to status
      const targetId = status.isCompleted ? completedId : incompleteId;
      nodes[targetId].size++; // Increment status node size

      links.push({
        source: controlFamilyMap.get(controlFamilyDesc).id,
        target: targetId,
        value: 1,
      });
    });

    return { nodes, links };
  };

  useEffect(() => {
    if (data.nodes.length === 0) return;

    const width = 1000;
    const height = 800;

    const svg = d3
      .select('#lineage')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    svg.selectAll('*').remove();

    // Add title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('class', 'diagram-title')
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .text('Risk Lineage Diagram');

    // Add more spacing between elements
    const nodePadding = 40;
    const nodeWidth = 30;

    const sankeyGenerator = sankey()
      .nodeId((d) => d.id)
      .nodeAlign(sankeyLeft)
      .nodeWidth(nodeWidth) // Adjust node width if necessary
      .nodePadding(nodePadding) // Increased padding
      .extent([
        [50, 50],
        [width - 50, height - 50],
      ]);

    // Generate Sankey layout directly with numeric IDs
    const { nodes, links } = sankeyGenerator(data);

    // Draw links
    svg
      .append('g')
      .attr('class', 'links')
      .attr('fill', 'none')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d) =>
        d.target.category === 'completed' ? '#00cc44' : '#ff4444'
      )
      .attr('stroke-width', (d) => Math.max(1, d.width))
      .attr('opacity', 0.5)
      .on('mouseover', function () {
        d3.select(this).attr('opacity', 0.8);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.5);
      });

    // Draw group backgrounds first
    const controlGroups = new Map();
    nodes.forEach((node) => {
      if (node.type === 'controlGroup') {
        if (!controlGroups.has(node.name)) {
          controlGroups.set(node.name, {
            name: node.name,
            minY: node.y0,
            maxY: node.y1,
            x0: node.x0,
            x1: node.x1,
          });
        } else {
          const group = controlGroups.get(node.name);
          group.minY = Math.min(group.minY, node.y0);
          group.maxY = Math.max(group.maxY, node.y1);
        }
      }
    });

    // Draw group backgrounds
    svg
      .append('g')
      .attr('class', 'control-groups')
      .selectAll('rect')
      .data(Array.from(controlGroups.values()))
      .join('rect')
      .attr('x', (d) => d.x0 - 5)
      .attr('y', (d) => d.minY - 10)
      .attr('width', (d) => d.x1 - d.x0 + 10)
      .attr('height', (d) => d.maxY - d.minY + 20)
      .attr('fill', '#f0f0f0')
      .attr('stroke', '#ddd')
      .attr('rx', 8)
      .attr('ry', 8);

    // Draw group labels
    svg
      .select('g.control-groups')
      .selectAll('text')
      .data(Array.from(controlGroups.values()))
      .join('text')
      .attr('x', (d) => (d.x0 + d.x1) / 2)
      .attr('y', (d) => d.minY - 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text((d) => d.name);

    // Continue with existing node drawing code
    const nodeGroup = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    // Draw different shapes based on node type
    nodeGroup.each(function (d) {
      const node = d3.select(this);

      if (d.type === 'status') {
        // Calculate radius based on size
        const baseRadius = Math.min(d.y1 - d.y0, d.x1 - d.x0) / 2;
        const radius = baseRadius * Math.sqrt(d.size / 10); // Adjust scaling factor as needed

        // Draw circles for status nodes with dynamic size
        node
          .append('circle')
          .attr('r', radius)
          .attr('cx', (d.x1 - d.x0) / 2)
          .attr('cy', (d.y1 - d.y0) / 2)
          .attr('fill', d.category === 'completed' ? '#00cc44' : '#ff4444')
          .attr('opacity', 0.8);
      } else if (d.type === 'family') {
        // Draw rectangles for family nodes
        node
          .append('rect')
          .attr('height', d.y1 - d.y0)
          .attr('width', d.x1 - d.x0)
          .attr('fill', '#2c3e50')
          .attr('opacity', 0.8)
          .attr('rx', 4)
          .attr('ry', 4);
      } else {
        // Draw rectangles for control nodes
        node
          .append('rect')
          .attr('height', d.y1 - d.y0)
          .attr('width', d.x1 - d.x0)
          .attr('fill', '#4477aa')
          .attr('opacity', 0.8)
          .attr('rx', 4)
          .attr('ry', 4);
      }
    });
  }, [data]);

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        width: '1200px', // Increase the width
        height: '1000px', // Increase the height
        overflow: 'auto', // Add overflow to handle large content
      }}
    >
      <svg id='lineage' />
    </div>
  );
};

export default LineageDiagram;
