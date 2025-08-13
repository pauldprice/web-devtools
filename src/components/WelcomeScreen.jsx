import React from 'react';

export default function WelcomeScreen() {
  return (
    <div className="welcome">
      <div>
        <h2>Welcome to Developer Utilities</h2>
        <p>Select a tool from the sidebar to get started. All processing happens locally in your browser.</p>
        <div className="shortcuts">
          <h3>Keyboard Shortcuts</h3>
          <div className="shortcut-item">
            <span className="shortcut-key">⌘K</span>
            <span>Search tools</span>
          </div>
          <div className="shortcut-item">
            <span className="shortcut-key">↑↓</span>
            <span>Navigate tools</span>
          </div>
          <div className="shortcut-item">
            <span className="shortcut-key">Enter</span>
            <span>Select tool / Run action</span>
          </div>
          <div className="shortcut-item">
            <span className="shortcut-key">Esc</span>
            <span>Clear search</span>
          </div>
        </div>
      </div>
    </div>
  );
}