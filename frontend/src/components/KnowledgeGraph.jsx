import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

export default function KnowledgeGraph({ document, entities = [] }) {
  const svgRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const [layoutMode, setLayoutMode] = useState('force') // 'force', 'circular', 'hierarchical'

  // Generate graph data from document and entities
  useEffect(() => {
    if (!document || !entities.length) {
      setGraphData({ nodes: [], links: [] })
      return
    }

    const nodes = []
    const links = []

    // Create central document node
    const docNode = {
      id: 'document',
      label: document.filename || 'Document',
      type: 'document',
      size: 20,
      color: '#3b82f6'
    }
    nodes.push(docNode)

    // Create entity nodes and group by type
    const entityGroups = {}
    entities.forEach((entity, index) => {
      const entityType = entity.type.toLowerCase()
      
      if (!entityGroups[entityType]) {
        entityGroups[entityType] = []
      }
      
      const entityNode = {
        id: `entity-${index}`,
        label: entity.value,
        type: entityType,
        size: 12,
        color: getEntityColor(entityType),
        fullData: entity
      }
      
      nodes.push(entityNode)
      entityGroups[entityType].push(entityNode)
      
      // Link entity to document
      links.push({
        source: 'document',
        target: `entity-${index}`,
        type: 'contains'
      })
    })

    // Create type group nodes
    Object.keys(entityGroups).forEach(type => {
      const typeNode = {
        id: `type-${type}`,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        type: 'category',
        size: 15,
        color: '#60a5fa'
      }
      nodes.push(typeNode)

      // Link type to document
      links.push({
        source: 'document',
        target: `type-${type}`,
        type: 'category'
      })

      // Link entities to their type
      entityGroups[type].forEach(entity => {
        links.push({
          source: `type-${type}`,
          target: entity.id,
          type: 'instance'
        })
      })
    })

    // Add summary nodes if available
    if (document.simplifiedText) {
      const summaryNode = {
        id: 'summary',
        label: 'Summary',
        type: 'summary',
        size: 16,
        color: '#10b981'
      }
      nodes.push(summaryNode)
      
      links.push({
        source: 'document',
        target: 'summary',
        type: 'summarizes'
      })
    }

    // Add key phrases from simplified text
    if (document.simplifiedText) {
      const keyPhrases = extractKeyPhrases(document.simplifiedText)
      keyPhrases.forEach((phrase, index) => {
        const phraseNode = {
          id: `phrase-${index}`,
          label: phrase,
          type: 'keyphrase',
          size: 10,
          color: '#a855f7'
        }
        nodes.push(phraseNode)
        
        links.push({
          source: 'summary',
          target: `phrase-${index}`,
          type: 'contains'
        })
      })
    }

    // Create relationships between entities of the same type
    Object.values(entityGroups).forEach(group => {
      if (group.length > 1) {
        for (let i = 0; i < group.length - 1; i++) {
          links.push({
            source: group[i].id,
            target: group[i + 1].id,
            type: 'related'
          })
        }
      }
    })

    setGraphData({ nodes, links })
  }, [document, entities])

  // D3 visualization
  useEffect(() => {
    if (!graphData.nodes.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 800
    const height = 600
    const margin = { top: 20, right: 20, bottom: 20, left: 20 }

    svg.attr('width', width).attr('height', height)

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create simulation based on layout mode
    let simulation
    
    if (layoutMode === 'circular') {
      // Circular layout
      const radius = Math.min(width, height) / 3
      graphData.nodes.forEach((node, i) => {
        if (node.id === 'document') {
          node.fx = width / 2
          node.fy = height / 2
        } else {
          const angle = (i * 2 * Math.PI) / (graphData.nodes.length - 1)
          node.fx = width / 2 + radius * Math.cos(angle)
          node.fy = height / 2 + radius * Math.sin(angle)
        }
      })
      
      simulation = d3.forceSimulation(graphData.nodes)
        .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(50))
        .force('collision', d3.forceCollide().radius(d => d.size + 5))
    } else if (layoutMode === 'hierarchical') {
      // Hierarchical layout
      const levels = {
        'document': 0,
        'category': 1,
        'summary': 1,
        'entity': 2
      }
      
      graphData.nodes.forEach(node => {
        const level = levels[node.type] || 2
        node.fx = width / 2 + (Math.random() - 0.5) * 200
        node.fy = 100 + level * 150
      })
      
      simulation = d3.forceSimulation(graphData.nodes)
        .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(80))
        .force('collision', d3.forceCollide().radius(d => d.size + 10))
        .force('y', d3.forceY(d => 100 + (levels[d.type] || 2) * 150).strength(0.5))
    } else {
      // Force-directed layout (default)
      simulation = d3.forceSimulation(graphData.nodes)
        .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(80))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => d.size + 5))
    }

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(graphData.links)
      .enter().append('line')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)

    // Create nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(graphData.nodes)
      .enter().append('circle')
      .attr('r', d => d.size)
      .attr('fill', d => d.color)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    // Add labels
    const label = g.append('g')
      .selectAll('text')
      .data(graphData.nodes)
      .enter().append('text')
      .text(d => d.label.length > 15 ? d.label.substring(0, 15) + '...' : d.label)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1e293b')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.size + 20)
      .style('pointer-events', 'none')

    // Add hover effects
    node
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d.size * 1.2)
          .attr('stroke-width', 3)
        
        // Highlight connected links
        link
          .attr('stroke-opacity', l => 
            l.source.id === d.id || l.target.id === d.id ? 1 : 0.2
          )
          .attr('stroke-width', l => 
            l.source.id === d.id || l.target.id === d.id ? 3 : 2
          )
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d.size)
          .attr('stroke-width', 2)
        
        // Reset links
        link
          .attr('stroke-opacity', 0.6)
          .attr('stroke-width', 2)
      })
      .on('click', function(event, d) {
        setSelectedNode(d)
      })

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y)
    })

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [graphData, layoutMode])

  // Extract key phrases from text
  function extractKeyPhrases(text) {
    if (!text) return []
    
    // Simple key phrase extraction - look for important legal terms
    const legalTerms = [
      'agreement', 'contract', 'party', 'parties', 'obligation', 'rights',
      'payment', 'term', 'condition', 'liability', 'breach', 'termination',
      'confidential', 'proprietary', 'intellectual property', 'damages',
      'indemnification', 'governing law', 'jurisdiction', 'dispute'
    ]
    
    const phrases = []
    const words = text.toLowerCase().split(/\s+/)
    
    legalTerms.forEach(term => {
      if (text.toLowerCase().includes(term)) {
        phrases.push(term)
      }
    })
    
    // Also extract phrases that appear multiple times
    const wordCount = {}
    words.forEach(word => {
      if (word.length > 4) {
        wordCount[word] = (wordCount[word] || 0) + 1
      }
    })
    
    Object.entries(wordCount)
      .filter(([word, count]) => count > 2 && !legalTerms.includes(word))
      .slice(0, 5)
      .forEach(([word]) => phrases.push(word))
    
    return phrases.slice(0, 8) // Limit to 8 key phrases
  }

  // Get color for entity type
  function getEntityColor(type) {
    const colors = {
      'person': '#ef4444',
      'organization': '#f59e0b',
      'location': '#10b981',
      'date': '#8b5cf6',
      'money': '#06b6d4',
      'percentage': '#84cc16',
      'time': '#f97316',
      'keyphrase': '#a855f7',
      'misc': '#6b7280'
    }
    return colors[type] || colors.misc
  }

  if (!document) {
    return (
      <div className="knowledge-graph-container">
        <div className="graph-header">
          <h3>📊 Knowledge Graph</h3>
          <p>Upload and process a document to see its knowledge graph representation</p>
        </div>
        <div className="graph-empty">
          <p>No document selected for graph visualization</p>
        </div>
      </div>
    )
  }

  return (
    <div className="knowledge-graph-container">
      <div className="graph-header">
        <h3>📊 Knowledge Graph</h3>
        <p>Interactive visualization of document entities and relationships</p>
        
        <div className="graph-controls">
          <button 
            className={`graph-control-btn ${layoutMode === 'force' ? 'active' : ''}`}
            onClick={() => setLayoutMode('force')}
          >
            Force Layout
          </button>
          <button 
            className={`graph-control-btn ${layoutMode === 'circular' ? 'active' : ''}`}
            onClick={() => setLayoutMode('circular')}
          >
            Circular Layout
          </button>
          <button 
            className={`graph-control-btn ${layoutMode === 'hierarchical' ? 'active' : ''}`}
            onClick={() => setLayoutMode('hierarchical')}
          >
            Hierarchical Layout
          </button>
        </div>
      </div>
      
      <div className="graph-content">
        <div className="graph-visualization">
          <svg ref={svgRef}></svg>
        </div>
        
        {selectedNode && (
          <div className="node-details">
            <h4>Node Details</h4>
            <div className="detail-item">
              <strong>Label:</strong> {selectedNode.label}
            </div>
            <div className="detail-item">
              <strong>Type:</strong> {selectedNode.type}
            </div>
            {selectedNode.fullData && (
              <div className="detail-item">
                <strong>Value:</strong> {selectedNode.fullData.value}
              </div>
            )}
            <button 
              className="btn secondary" 
              onClick={() => setSelectedNode(null)}
              style={{ marginTop: '12px', fontSize: '12px', padding: '6px 12px' }}
            >
              Close
            </button>
          </div>
        )}
      </div>

      <div className="graph-info">
        <div className="graph-stats">
          <h4>Graph Statistics</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{graphData.nodes.length}</span>
              <span className="stat-label">Nodes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{graphData.links.length}</span>
              <span className="stat-label">Connections</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{entities.length}</span>
              <span className="stat-label">Entities</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{new Set(entities.map(e => e.type)).size}</span>
              <span className="stat-label">Types</span>
            </div>
          </div>
        </div>

        <div className="graph-legend">
          <h4>Legend</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
              <span>Document</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#60a5fa' }}></div>
              <span>Category</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
              <span>Summary</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
              <span>Person</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
              <span>Organization</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
              <span>Date</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#a855f7' }}></div>
              <span>Key Phrase</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#06b6d4' }}></div>
              <span>Money</span>
            </div>
          </div>
        </div>
      </div>

      <div className="graph-hints">
        <strong>How to interact:</strong> 
        • Hover over nodes to highlight connections 
        • Click nodes to see details 
        • Drag nodes to reposition them 
        • Try different layouts to explore relationships
      </div>
    </div>
  )
}