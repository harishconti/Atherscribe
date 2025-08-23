import React, { useEffect, useRef, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Network } from 'vis-network/standalone/esm/vis-network.min.js';
import type { Options } from 'vis-network/standalone/esm/vis-network.min.js';

export default function GraphView() {
  const {
    documentsForActiveProject,
    handleSelectDocument,
    handleBackToMainView,
    theme
  } = useAppContext();

  const graphContainerRef = useRef<HTMLDivElement>(null);

  const graphData = useMemo(() => {
    const nodes = documentsForActiveProject.map(doc => ({
      id: doc.id,
      label: doc.content.title,
      title: `Template: ${doc.templateId}`, // Tooltip
      group: doc.templateId.startsWith('custom_') ? 'custom' : doc.templateId, // Group custom templates
    }));

    const edges: { from: string, to: string }[] = [];
    const titleToIdMap = new Map(documentsForActiveProject.map(doc => [doc.content.title, doc.id]));

    for (const doc of documentsForActiveProject) {
      let contentToScan = '';

      if (doc.content.sections) { // Text documents
        contentToScan = doc.content.sections.map(s => s.content).join(' ');
      } else if (doc.content.imageUrl) { // Visual documents
        contentToScan = `${doc.content.prompt || ''} ${doc.content.context || ''}`;
      }

      let match;
      const linkRegex = /@\[([^\]]+)\]/g;
      while ((match = linkRegex.exec(contentToScan)) !== null) {
        const linkedTitle = match[1];
        const targetId = titleToIdMap.get(linkedTitle);
        if (targetId && targetId !== doc.id) {
          if (!edges.some(edge => edge.from === doc.id && edge.to === targetId)) {
            edges.push({ from: doc.id, to: targetId });
          }
        }
      }
    }

    return { nodes, edges };
  }, [documentsForActiveProject]);

  useEffect(() => {
    if (graphContainerRef.current && graphData.nodes.length > 0) {

      const isDark = theme === 'dark';

      const colorPalette: Record<string, { light: { bg: string, border: string }, dark: { bg: string, border: string }}> = {
        character:      { light: { bg: '#E0F2FE', border: '#38BDF8' }, dark: { bg: '#0C4A6E', border: '#7DD3FC' } },
        location:       { light: { bg: '#D1FAE5', border: '#34D399' }, dark: { bg: '#065F46', border: '#6EE7B7' } },
        magic_system:   { light: { bg: '#F3E8FF', border: '#A855F7' }, dark: { bg: '#581C87', border: '#C084FC' } },
        organization:   { light: { bg: '#FFF7ED', border: '#FB923C' }, dark: { bg: '#7C2D12', border: '#FDBA74' } },
        historical_event: { light: { bg: '#FEE2E2', border: '#EF4444' }, dark: { bg: '#7F1D1D', border: '#F87171' } },
        creature:       { light: { bg: '#FEF9C3', border: '#FACC15' }, dark: { bg: '#713F12', border: '#FDE047' } },
        item:           { light: { bg: '#CFFAFE', border: '#22D3EE' }, dark: { bg: '#164E63', border: '#67E8F9' } },
        visual:         { light: { bg: '#FCE7F3', border: '#EC4899' }, dark: { bg: '#831843', border: '#F472B6' } },
        custom:         { light: { bg: '#F1F5F9', border: '#64748B' }, dark: { bg: '#334155', border: '#94A3B8' } },
      };

      const groups: Record<string, any> = {};
      for (const key in colorPalette) {
          const themeColors = isDark ? colorPalette[key as keyof typeof colorPalette].dark : colorPalette[key as keyof typeof colorPalette].light;
          groups[key] = {
              color: {
                  background: themeColors.bg,
                  border: themeColors.border,
                  highlight: {
                      background: themeColors.bg,
                      border: themeColors.border
                  },
                  hover: {
                    background: themeColors.bg,
                    border: themeColors.border,
                  }
              },
              font: {
                  color: isDark ? '#E2E8F0' : '#1E293B'
              }
          };
      }

      const options: Options = {
        nodes: {
          shape: 'box',
          margin: {
            top: 10,
            right: 15,
            bottom: 10,
            left: 15,
          },
          widthConstraint: {
            maximum: 200,
          },
          font: {
            size: 14,
          },
          borderWidth: 2,
        },
        edges: {
          arrows: { to: { enabled: true, scaleFactor: 0.7 } },
          color: isDark ? '#475569' : '#94A3B8',
          smooth: {
            enabled: true,
            type: 'cubicBezier',
            forceDirection: 'vertical',
            roundness: 0.4,
          },
        },
        physics: {
          barnesHut: {
            gravitationalConstant: -30000,
            springConstant: 0.04,
            springLength: 200,
          },
        },
        interaction: {
          tooltipDelay: 200,
          hideEdgesOnDrag: true,
          hover: true,
        },
        layout: {
          hierarchical: false,
        },
        groups: groups,
      };

      const network = new Network(graphContainerRef.current, graphData, options);

      network.on('selectNode', function(params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          handleSelectDocument(nodeId);
        }
      });

      return () => {
        network.destroy();
      };
    }
  }, [graphData, handleSelectDocument, theme]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Document Graph</h1>
          <p className="text-slate-500 dark:text-slate-400">Visualizing the connections in your world.</p>
        </div>
        <button onClick={handleBackToMainView} className="flex items-center text-sm bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Editor
        </button>
      </div>

      <div className="flex-grow bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 relative overflow-hidden">
        {graphData.nodes.length > 0 ? (
          <div ref={graphContainerRef} className="w-full h-full" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No documents to display.</p>
              <p className="text-slate-500 dark:text-slate-400">Create some documents and link them with @[Document Name] to see the graph.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}