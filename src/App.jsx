import React, { useState, useEffect, lazy, Suspense } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import { tools } from './tools';

function App() {
  const [currentTool, setCurrentTool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ToolComponent, setToolComponent] = useState(null);

  const handleSelectTool = async (toolId) => {
    setCurrentTool(toolId);
    const tool = tools.find(t => t.id === toolId);
    if (tool) {
      // Update URL hash
      window.location.hash = toolId;
      const module = await tool.component();
      setToolComponent(() => module.default);
    } else if (!toolId) {
      // Clear hash when no tool selected
      window.location.hash = '';
      setCurrentTool(null);
      setToolComponent(null);
    }
  };

  // Handle hash changes (browser back/forward, bookmarks, direct navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the #
      if (hash) {
        const tool = tools.find(t => t.id === hash);
        if (tool && hash !== currentTool) {
          handleSelectTool(hash);
        }
      } else if (currentTool) {
        // Hash was cleared, return to welcome screen
        setCurrentTool(null);
        setToolComponent(null);
      }
    };

    // Check initial hash on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentTool]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-input')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app">
      <Sidebar 
        tools={tools}
        currentTool={currentTool}
        onSelectTool={handleSelectTool}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="main">
        {!currentTool ? (
          <WelcomeScreen />
        ) : (
          <div className="tool-view">
            <Suspense fallback={<div>Loading...</div>}>
              {ToolComponent && <ToolComponent />}
            </Suspense>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;