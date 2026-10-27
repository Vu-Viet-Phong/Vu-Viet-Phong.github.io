import { useEffect, useRef, useState, useMemo } from 'react';
import cytoscape from 'cytoscape';
import { X, ExternalLink, Cpu, RotateCcw } from 'lucide-react';

interface GraphNodeData {
  id: string;
  label: string;
  category: string;
  targetId: string;
  desc: string;
}

const GRAPH_NODES: GraphNodeData[] = [
  { id: 'AI', label: 'Artificial Intelligence', category: 'Foundation', targetId: 'about', desc: 'Designing intelligent architectures bridging theoretical machine learning and production engineering.' },
  { id: 'ML', label: 'Machine Learning', category: 'Foundation', targetId: 'research', desc: 'Predictive modeling, representation learning, and statistical optimization across complex datasets.' },
  { id: 'RecSys', label: 'Recommendation Systems', category: 'Core Domain', targetId: 'projects', desc: 'Personalized candidate generation, latent collaborative filtering, and ranking models.' },
  { id: 'GNN', label: 'Graph Neural Networks', category: 'Core Domain', targetId: 'projects', desc: 'Message passing on relational topologies (NGCF, LightGCN) for high-order collaborative signals.' },
  { id: 'MM', label: 'Multimodal RecSys', category: 'Core Domain', targetId: 'projects', desc: 'Fusing visual features (VBPR) and structural embeddings into a unified latent preference space.' },
  { id: 'GraphRAG', label: 'GraphRAG Pipeline', category: 'Intelligence Lab', targetId: 'lab', desc: 'Combining vector similarity retrieval with multi-hop Knowledge Graph traversal for zero-hallucination grounding.' },
  { id: 'IR', label: 'Information Retrieval', category: 'Intelligence Lab', targetId: 'lab', desc: 'Dense vector search, hybrid retrieval, and Reciprocal Rank Fusion (RRF) scoring.' },
  { id: 'KG', label: 'Knowledge Graphs', category: 'Intelligence Lab', targetId: 'lab', desc: 'Entity-relation schemas modeling rich semantic connections between products and attributes.' },
  { id: 'Arena', label: 'Model Arena', category: 'Evaluation', targetId: 'lab', desc: 'Side-by-side benchmarking of Matrix Factorization vs GNN-based collaborative models.' },
  { id: 'Copilot', label: 'Fashion Copilot', category: 'Application', targetId: 'products', desc: 'Intent-driven attribute scoring and explainable recommendation with deterministic verification.' },
];

const GRAPH_EDGES = [
  { source: 'AI', target: 'ML' },
  { source: 'ML', target: 'RecSys' },
  { source: 'ML', target: 'GNN' },
  { source: 'RecSys', target: 'MM' },
  { source: 'GNN', target: 'MM' },
  { source: 'GNN', target: 'KG' },
  { source: 'KG', target: 'GraphRAG' },
  { source: 'IR', target: 'GraphRAG' },
  { source: 'RecSys', target: 'Arena' },
  { source: 'GraphRAG', target: 'Copilot' },
  { source: 'MM', target: 'Copilot' },
];

export const InteractiveGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNodeData | null>(null);

  const elements = useMemo(() => [
    ...GRAPH_NODES.map((n) => ({
      data: { ...n },
    })),
    ...GRAPH_EDGES.map((e) => ({
      data: { source: e.source, target: e.target },
    })),
  ], []);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#111B2E',
            'border-width': 2,
            'border-color': '#22D3EE',
            'label': 'data(label)',
            'color': '#F8FAFC',
            'font-family': 'Space Grotesk, Inter, sans-serif',
            'font-size': '11px',
            'font-weight': 600,
            'text-valign': 'center',
            'text-halign': 'right',
            'text-margin-x': 8,
            'text-outline-width': 2,
            'text-outline-color': '#090F1C',
            'width': 24,
            'height': 24,
            'transition-property': 'background-color, border-color, width, height, border-width',
            'transition-duration': 0.2,
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#1E293B',
            'target-arrow-color': '#1E293B',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.7,
            'transition-property': 'line-color, target-arrow-color, width, opacity',
            'transition-duration': 0.2,
          },
        },
        {
          selector: 'node.highlight',
          style: {
            'background-color': '#22D3EE',
            'border-color': '#8B5CF6',
            'border-width': 3,
            'width': 30,
            'height': 30,
            'color': '#22D3EE',
          },
        },
        {
          selector: 'edge.highlight',
          style: {
            'width': 2.5,
            'line-color': '#8B5CF6',
            'target-arrow-color': '#8B5CF6',
            'opacity': 1,
          },
        },
        {
          selector: 'node.dimmed',
          style: {
            'opacity': 0.25,
          },
        },
        {
          selector: 'edge.dimmed',
          style: {
            'opacity': 0.08,
          },
        },
      ],
      layout: {
        name: 'cose',
        idealEdgeLength: () => 90,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 40,
        randomize: false,
        componentSpacing: 80,
        nodeRepulsion: () => 350000,
        edgeElasticity: () => 80,
        nestingFactor: 5,
        gravity: 70,
        numIter: 800,
        initialTemp: 150,
        coolingFactor: 0.95,
        minTemp: 1.0,
        animate: false,
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      minZoom: 0.5,
      maxZoom: 2.2,
    });

    cy.on('mouseover', 'node', (e) => {
      const node = e.target;
      if (containerRef.current) containerRef.current.style.cursor = 'pointer';

      cy.elements().addClass('dimmed');
      node.removeClass('dimmed').addClass('highlight');

      const connectedEdges = node.connectedEdges();
      connectedEdges.removeClass('dimmed').addClass('highlight');
      connectedEdges.connectedNodes().removeClass('dimmed');
    });

    cy.on('mouseout', 'node', () => {
      if (containerRef.current) containerRef.current.style.cursor = 'default';
      cy.elements().removeClass('dimmed highlight');
    });

    cy.on('click', 'node', (e) => {
      const node = e.target;
      const data = node.data();
      setSelectedNode({
        id: data.id,
        label: data.label,
        category: data.category,
        targetId: data.targetId,
        desc: data.desc,
      });

      cy.animate(
        {
          center: { eles: node },
          zoom: 1.4,
        },
        { duration: 400 }
      );
    });

    cy.fit(undefined, 35);
    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [elements]);

  const handleReset = () => {
    if (cyRef.current) {
      cyRef.current.fit(undefined, 35);
      setSelectedNode(null);
    }
  };

  return (
    <div className="w-full h-full relative group bg-[#0B1324]/80 rounded-2xl overflow-hidden border border-surfaceHighlight shadow-2xl backdrop-blur-sm">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08)_0%,transparent_65%)] pointer-events-none" />

      {/* Graph Canvas Container */}
      <div 
        ref={containerRef} 
        aria-label="Interactive Knowledge Graph"
        role="region"
        className="w-full h-full relative z-10" 
      />

      {/* Selected Node Inspector Panel */}
      {selectedNode && (
        <div className="absolute top-4 left-4 right-4 sm:right-auto z-20 sm:w-80 bg-surface/90 border border-primary/40 p-4 rounded-xl shadow-2xl backdrop-blur-xl animate-fade-in-up">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-secondary">
                  {selectedNode.category}
                </span>
                <h4 className="font-display font-semibold text-white text-sm leading-tight">
                  {selectedNode.label}
                </h4>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              aria-label="Close inspector"
              className="text-textMuted hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-textMuted leading-relaxed mb-3">
            {selectedNode.desc}
          </p>

          <a
            href={`#${selectedNode.targetId}`}
            onClick={() => setSelectedNode(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-semibold font-mono tracking-wide transition-all"
          >
            <span>Jump to {selectedNode.targetId.toUpperCase()}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Top Status Tag */}
      <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-surface/80 border border-surfaceHighlight text-[10px] font-mono text-slate-300 backdrop-blur-sm pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span>Graph Topology • 10 Nodes / 11 Relations</span>
      </div>

      {/* Floating Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface/80 border border-surfaceHighlight text-textMuted hover:text-primary hover:border-primary/40 transition-all text-xs font-mono backdrop-blur-md"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset View</span>
        </button>
      </div>

      {/* Accessible Screen-Reader Fallback */}
      <div className="sr-only">
        <h4>Knowledge Graph Nodes:</h4>
        <ul>
          {GRAPH_NODES.map((n) => (
            <li key={n.id}>
              <a href={`#${n.targetId}`}>{n.label}: {n.desc}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
