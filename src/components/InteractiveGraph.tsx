import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

const elements = [
  { data: { id: 'AI', label: 'Artificial Intelligence' }, position: { x: 400, y: 300 } },
  { data: { id: 'ML', label: 'Machine Learning' }, position: { x: 250, y: 200 } },
  { data: { id: 'DS', label: 'Data Science' }, position: { x: 550, y: 200 } },
  { data: { id: 'RecSys', label: 'Recommendation Systems' }, position: { x: 150, y: 350 } },
  { data: { id: 'GNN', label: 'Graph Neural Networks' }, position: { x: 400, y: 150 } },
  { data: { id: 'MM', label: 'Multimodal Learning' }, position: { x: 650, y: 350 } },
  { data: { id: 'GraphRAG', label: 'GraphRAG' }, position: { x: 250, y: 450 } },
  { data: { id: 'IR', label: 'Information Retrieval' }, position: { x: 550, y: 450 } },
  { data: { id: 'KG', label: 'Knowledge Graphs' }, position: { x: 400, y: 500 } },
  { data: { id: 'Eval', label: 'Model Evaluation' }, position: { x: 100, y: 200 } },
  
  { data: { source: 'AI', target: 'ML' } },
  { data: { source: 'AI', target: 'DS' } },
  { data: { source: 'ML', target: 'RecSys' } },
  { data: { source: 'ML', target: 'GNN' } },
  { data: { source: 'DS', target: 'IR' } },
  { data: { source: 'RecSys', target: 'MM' } },
  { data: { source: 'GNN', target: 'KG' } },
  { data: { source: 'KG', target: 'GraphRAG' } },
  { data: { source: 'IR', target: 'GraphRAG' } },
  { data: { source: 'ML', target: 'Eval' } },
];

export const InteractiveGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#111C2D',
            'border-width': 2,
            'border-color': '#4BD5E8',
            'label': 'data(label)',
            'color': '#F3F6FC',
            'font-family': 'Inter, sans-serif',
            'font-size': '12px',
            'text-valign': 'center',
            'text-halign': 'right',
            'text-margin-x': 8,
            'width': 20,
            'height': 20,
            'ghost': 'yes',
            'ghost-opacity': 0.3,
            'ghost-offset-x': 0,
            'ghost-offset-y': 2,
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#30415d',
            'target-arrow-color': '#30415d',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.6
          }
        },
        {
          selector: 'node:hover',
          style: {
            'background-color': '#4BD5E8',
            'border-color': '#F3F6FC',
            'color': '#4BD5E8'
          }
        }
      ],
      layout: {
        name: 'preset',
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
    });

    cy.on('mouseover', 'node', (e) => {
      const node = e.target;
      document.body.style.cursor = 'pointer';
      node.connectedEdges().animate({
        style: { 'line-color': '#9788EF', 'target-arrow-color': '#9788EF', 'opacity': 1, 'width': 2 }
      }, { duration: 200 });
    });

    cy.on('mouseout', 'node', (e) => {
      const node = e.target;
      document.body.style.cursor = 'default';
      node.connectedEdges().animate({
        style: { 'line-color': '#30415d', 'target-arrow-color': '#30415d', 'opacity': 0.6, 'width': 1.5 }
      }, { duration: 200 });
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, []);

  return (
    <div className="w-full h-full relative group">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(75,213,232,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div ref={containerRef} className="w-full h-full" />
      <button 
        onClick={() => cyRef.current?.fit()}
        className="absolute bottom-4 right-4 z-10 p-2 rounded-lg bg-surface border border-surfaceHighlight text-textMuted hover:text-primary transition-colors text-xs font-mono opacity-0 group-hover:opacity-100"
      >
        [ Reset View ]
      </button>
    </div>
  );
};
