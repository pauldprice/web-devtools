import React from 'react';

export default function Sidebar({ tools, currentTool, onSelectTool, searchQuery, onSearchChange }) {
  const filteredTools = searchQuery
    ? tools.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
      )
    : tools;

  return (
    <aside className="sidebar">
      <div className="sidebar-header" 
           style={{ cursor: 'pointer' }}
           onClick={() => onSelectTool(null)}
           title="Return to home">
        <h1>Developer Utilities</h1>
        <div className="sub">Quick text & data transformations • All in-browser</div>
      </div>
      
      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search tools... (⌘K)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />
        <span className="search-icon">🔍</span>
      </div>
      
      <div className="tool-list">
        {filteredTools.map((tool) => (
          <div 
            key={tool.id}
            className={`tool-item ${tool.id === currentTool ? 'active' : ''}`}
            onClick={() => onSelectTool(tool.id)}
          >
            <h3>{tool.name}</h3>
            <div className="desc">{tool.description}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}