import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { X, ExternalLink, Cpu } from 'lucide-react';

const graphData = [
  { data: { id: 'AI', label: 'Artificial Intelligence', desc: 'The overarching field of creating intelligent systems capable of autonomous reasoning.' } },
  { data: { id: 'ML', label: 'Machine Learning', desc: 'Algorithms that improve automatically through experience and data.' } },
  { data: { id: 'DS', label: 'Data Science', desc: 'Extracting knowledge and insights from structured and unstructured data.' } },
  { data: { id: 'RecSys', label: 'Recommendation Systems', desc: 'Predicting user preferences to deliver personalized content discovery.' } },
  { data: { id: 'GNN', label: 'Graph Neural Networks', desc: 'Deep learning methods operating on graph domains to capture relational structures.' } },
  { data: { id: 'MM', label: 'Multimodal Learning', desc: 'Fusing visual, textual, and structural representations into a single latent space.' } },
  { data: { id: 'GraphRAG', label: 'GraphRAG', desc: 'Combining Knowledge Graphs with Retrieval-Augmented Generation for zero-hallucination LLMs.' } },
  { data: { id: 'IR', label: 'Information Retrieval', desc: 'Designing hybrid vector-graph search pipelines for massive datasets.' } },
  { data: { id: 'KG', label: 'Knowledge Graphs', desc: 'Semantic networks representing real-world entities and their relationships.' } },
  { data: { id: 'Eval', label: 'Model Evaluation', desc: 'Rigorous benchmarking using offline metrics like NDCG and Recall@K.' } },
  
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
  const [selectedNode, setSelectedNode] = useState<{label: string, desc: string} | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: graphData,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#162338',
            'border-width': 2,
            'border-color': '#4BD5E8',
            'label': 'data(label)',
            'color': '#F3F6FC',
            'font-family': 'Inter, sans-serif',
            'font-size': '14px',
            'text-valign': 'center',
            'text-halign': 'right',
            'text-margin-x': 12,
            'text-outline-width': 3,
            'text-outline-color': '#080D16',
            'width': 28,
            'height': 28,
            'transition-property': 'background-color, border-color, width, height',
            'transition-duration': 0.2
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#21334f',
            'target-arrow-color': '#21334f',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.6,
            'transition-property': 'line-color, target-arrow-color, width, opacity',
            'transition-duration': 0.2
          }
        },
        {
          selector: 'node.highlight',
          style: {
            'background-color': '#4BD5E8',
            'border-color': '#9788EF',
            'border-width': 4,
            'width': 36,
            'height': 36,
            'color': '#4BD5E8'
          }
        },
        {
          selector: 'edge.highlight',
          style: {
            'width': 3,
            'line-color': '#9788EF',
            'target-arrow-color': '#9788EF',
            'opacity': 1
          }
        },
        {
          selector: 'node.dimmed',
          style: {
            'opacity': 0.3
          }
        },
        {
          selector: 'edge.dimmed',
          style: {
            'opacity': 0.1
          }
        }
      ],
      layout: {
        name: 'cose',
        idealEdgeLength: () => 120,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 60,
        randomize: true,
        componentSpacing: 100,
        nodeRepulsion: () => 400000,
        edgeElasticity: () => 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0,
        animate: false // run once on load to prevent jitter
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      minZoom: 0.5,
      maxZoom: 2.5
    });

    cy.on('mouseover', 'node', (e) => {
      const node = e.target;
      document.body.style.cursor = 'pointer';
      
      cy.elements().addClass('dimmed');
      node.removeClass('dimmed');
      node.addClass('highlight');
      
      const connectedEdges = node.connectedEdges();
      connectedEdges.removeClass('dimmed');
      connectedEdges.addClass('highlight');
      connectedEdges.connectedNodes().removeClass('dimmed');
    });

    cy.on('mouseout', 'node', () => {
      document.body.style.cursor = 'default';
      cy.elements().removeClass('dimmed highlight');
    });

    cy.on('click', 'node', (e) => {
      const node = e.target;
      setSelectedNode({
        label: node.data('label'),
        desc: node.data('desc')
      });
      cy.animate({
        center: { eles: node },
        zoom: 1.5
      }, { duration: 500 });
    });

    // Initial fit with padding
    cy.fit(undefined, 50);

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, []);

  return (
    <div className="w-full h-full relative group bg-secondaryBackground/50 rounded-2xl overflow-hidden border border-surfaceHighlight shadow-2xl">
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(75,213,232,0.1)_0%,transparent_60%)] pointer-events-none" />
      
      {/* Graph Container */}
      <div ref={containerRef} className="w-full h-full relative z-10" />

      {/* Inspector Panel */}
      {selectedNode && (
        <div className="absolute top-6 left-6 z-20 w-72 glass-panel border border-primary/30 p-5 rounded-xl shadow-2xl animate-fade-in-up">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-textMain text-sm">{selectedNode.label}</h4>
            </div>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-textMuted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-textMuted leading-relaxed mb-4">
            {selectedNode.desc}
          </p>
          <a href="#projects" className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase text-secondary hover:text-white transition-colors">
            View Related Projects <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => {
            cyRef.current?.fit(undefined, 50);
            setSelectedNode(null);
          }}
          className="px-3 py-1.5 rounded-md bg-surface border border-surfaceHighlight text-textMuted hover:text-primary transition-colors text-xs font-mono backdrop-blur-md"
        >
          [ Reset View ]
        </button>
      </div>
    </div>
  );
};
