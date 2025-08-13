import React, { useState, useEffect } from 'react';
import { copyToClipboard } from '../utils/clipboard';

export default function TextDiff() {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [diffView, setDiffView] = useState('split');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [diffResult, setDiffResult] = useState(null);
  const [stats, setStats] = useState({ added: 0, removed: 0, unchanged: 0 });

  useEffect(() => {
    computeDiff();
  }, [leftText, rightText, ignoreCase, ignoreWhitespace]);

  const normalizeText = (text) => {
    let normalized = text;
    if (ignoreCase) {
      normalized = normalized.toLowerCase();
    }
    if (ignoreWhitespace) {
      normalized = normalized.replace(/\s+/g, ' ').trim();
    }
    return normalized;
  };

  const computeDiff = () => {
    if (!leftText && !rightText) {
      setDiffResult(null);
      setStats({ added: 0, removed: 0, unchanged: 0 });
      return;
    }

    const leftLines = leftText.split('\n');
    const rightLines = rightText.split('\n');
    
    // Simple line-by-line diff algorithm
    const diff = [];
    const maxLines = Math.max(leftLines.length, rightLines.length);
    let added = 0, removed = 0, unchanged = 0;
    
    for (let i = 0; i < maxLines; i++) {
      const leftLine = leftLines[i] !== undefined ? leftLines[i] : '';
      const rightLine = rightLines[i] !== undefined ? rightLines[i] : '';
      
      const normalizedLeft = normalizeText(leftLine);
      const normalizedRight = normalizeText(rightLine);
      
      if (i >= leftLines.length) {
        // Line only exists in right
        diff.push({ type: 'added', left: '', right: rightLine, lineNum: i + 1 });
        added++;
      } else if (i >= rightLines.length) {
        // Line only exists in left
        diff.push({ type: 'removed', left: leftLine, right: '', lineNum: i + 1 });
        removed++;
      } else if (normalizedLeft === normalizedRight) {
        // Lines are the same
        diff.push({ type: 'unchanged', left: leftLine, right: rightLine, lineNum: i + 1 });
        unchanged++;
      } else {
        // Lines are different
        diff.push({ type: 'modified', left: leftLine, right: rightLine, lineNum: i + 1 });
        added++;
        removed++;
      }
    }
    
    setDiffResult(diff);
    setStats({ added, removed, unchanged });
  };

  const getLineClass = (type) => {
    switch (type) {
      case 'added': return 'diff-added';
      case 'removed': return 'diff-removed';
      case 'modified': return 'diff-modified';
      default: return 'diff-unchanged';
    }
  };

  const handleCopyDiff = async () => {
    if (!diffResult) return;
    
    let diffText = '';
    diffResult.forEach(line => {
      const prefix = line.type === 'added' ? '+' : 
                    line.type === 'removed' ? '-' : 
                    line.type === 'modified' ? '~' : ' ';
      if (line.type === 'modified') {
        diffText += `- ${line.left}\n`;
        diffText += `+ ${line.right}\n`;
      } else {
        const text = line.left || line.right;
        diffText += `${prefix} ${text}\n`;
      }
    });
    
    await copyToClipboard(diffText);
  };

  const handleSwap = () => {
    setLeftText(rightText);
    setRightText(leftText);
  };

  const handleClear = () => {
    setLeftText('');
    setRightText('');
  };

  return (
    <div className="tool-content">
      <div className="tool-header">
        <h2>Text Diff Viewer</h2>
        <p className="tool-description">
          Compare two texts and visualize the differences with highlighted changes.
        </p>
        <div className="tool-docs">
          <h4>Features</h4>
          <p>• Line-by-line comparison</p>
          <p>• Ignore case and whitespace options</p>
          <p>• Split and unified view modes</p>
          <p>• Copy diff in standard format</p>
          <p>• Real-time difference statistics</p>
        </div>
      </div>
      
      <div>
        <div style={{ marginBottom: '15px' }}>
          <label>Comparison Options</label>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <label style={{ fontWeight: 'normal' }}>
              <input 
                type="checkbox"
                checked={ignoreCase}
                onChange={(e) => setIgnoreCase(e.target.checked)}
              /> Ignore case
            </label>
            <label style={{ fontWeight: 'normal' }}>
              <input 
                type="checkbox"
                checked={ignoreWhitespace}
                onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              /> Ignore whitespace
            </label>
            <label style={{ fontWeight: 'normal' }}>
              <input 
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => setShowLineNumbers(e.target.checked)}
              /> Show line numbers
            </label>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label>Original Text</label>
            <textarea 
              className="mono"
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              placeholder="Paste or type your original text here..."
              style={{ minHeight: '200px' }}
            />
          </div>
          <div>
            <label>Modified Text</label>
            <textarea 
              className="mono"
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              placeholder="Paste or type your modified text here..."
              style={{ minHeight: '200px' }}
            />
          </div>
        </div>
        
        {stats && (stats.added > 0 || stats.removed > 0 || stats.unchanged > 0) && (
          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            background: '#f5f5f5', 
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-around'
          }}>
            <span style={{ color: '#4caf50' }}>
              <strong>+{stats.added}</strong> added
            </span>
            <span style={{ color: '#f44336' }}>
              <strong>-{stats.removed}</strong> removed
            </span>
            <span style={{ color: '#666' }}>
              <strong>{stats.unchanged}</strong> unchanged
            </span>
          </div>
        )}
        
        {diffResult && diffResult.length > 0 && (
          <>
            <label style={{ marginTop: '20px' }}>Differences</label>
            <div className="diff-container" style={{ 
              maxHeight: '400px', 
              overflow: 'auto',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              {diffView === 'split' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <div style={{ borderRight: '1px solid #ddd' }}>
                    {diffResult.map((line, i) => (
                      <div 
                        key={i}
                        className={`diff-line ${getLineClass(line.type === 'added' ? 'unchanged' : line.type)}`}
                        style={{ 
                          padding: '2px 10px',
                          fontFamily: 'monospace',
                          fontSize: '13px',
                          minHeight: '20px',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all'
                        }}
                      >
                        {showLineNumbers && (
                          <span style={{ color: '#999', marginRight: '10px', display: 'inline-block', width: '30px' }}>
                            {line.type !== 'added' ? line.lineNum : ''}
                          </span>
                        )}
                        {line.left}
                      </div>
                    ))}
                  </div>
                  <div>
                    {diffResult.map((line, i) => (
                      <div 
                        key={i}
                        className={`diff-line ${getLineClass(line.type === 'removed' ? 'unchanged' : line.type)}`}
                        style={{ 
                          padding: '2px 10px',
                          fontFamily: 'monospace',
                          fontSize: '13px',
                          minHeight: '20px',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all'
                        }}
                      >
                        {showLineNumbers && (
                          <span style={{ color: '#999', marginRight: '10px', display: 'inline-block', width: '30px' }}>
                            {line.type !== 'removed' ? line.lineNum : ''}
                          </span>
                        )}
                        {line.right}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  {diffResult.map((line, i) => (
                    <div key={i}>
                      {line.type === 'modified' ? (
                        <>
                          <div 
                            className="diff-line diff-removed"
                            style={{ 
                              padding: '2px 10px',
                              fontFamily: 'monospace',
                              fontSize: '13px'
                            }}
                          >
                            {showLineNumbers && (
                              <span style={{ color: '#999', marginRight: '10px' }}>
                                {line.lineNum}
                              </span>
                            )}
                            - {line.left}
                          </div>
                          <div 
                            className="diff-line diff-added"
                            style={{ 
                              padding: '2px 10px',
                              fontFamily: 'monospace',
                              fontSize: '13px'
                            }}
                          >
                            {showLineNumbers && (
                              <span style={{ color: '#999', marginRight: '10px' }}>
                                {line.lineNum}
                              </span>
                            )}
                            + {line.right}
                          </div>
                        </>
                      ) : (
                        <div 
                          className={`diff-line ${getLineClass(line.type)}`}
                          style={{ 
                            padding: '2px 10px',
                            fontFamily: 'monospace',
                            fontSize: '13px'
                          }}
                        >
                          {showLineNumbers && (
                            <span style={{ color: '#999', marginRight: '10px' }}>
                              {line.lineNum}
                            </span>
                          )}
                          {line.type === 'added' && '+ '}
                          {line.type === 'removed' && '- '}
                          {line.type === 'unchanged' && '  '}
                          {line.left || line.right}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        
        <div className="toolbar">
          <button className="btn secondary small" onClick={handleClear}>Clear</button>
          <button className="btn secondary small" onClick={handleSwap}>Swap Texts</button>
          <button 
            className="btn secondary small" 
            onClick={() => setDiffView(diffView === 'split' ? 'unified' : 'split')}
          >
            {diffView === 'split' ? 'Unified View' : 'Split View'}
          </button>
          <button className="btn" onClick={handleCopyDiff} disabled={!diffResult}>
            Copy Diff
          </button>
        </div>
      </div>

      <style jsx>{`
        .diff-added {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        .diff-removed {
          background-color: #ffebee;
          color: #c62828;
        }
        .diff-modified {
          background-color: #fff3e0;
          color: #e65100;
        }
        .diff-unchanged {
          background-color: transparent;
          color: #666;
        }
        .diff-line:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
}