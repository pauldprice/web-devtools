import React, { useState, useEffect } from 'react';
import { copyToClipboard } from '../utils/clipboard';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState([]);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const [highlightedText, setHighlightedText] = useState('');

  useEffect(() => {
    testRegex();
  }, [pattern, flags, testString]);

  const testRegex = () => {
    if (!pattern) {
      setMatches([]);
      setGroups([]);
      setHighlightedText(testString);
      setError('');
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const allMatches = [];
      const captureGroups = [];
      let highlighted = testString;
      
      if (flags.includes('g')) {
        // Global flag - find all matches
        let match;
        const matchPositions = [];
        
        while ((match = regex.exec(testString)) !== null) {
          allMatches.push({
            match: match[0],
            index: match.index,
            length: match[0].length
          });
          
          if (match.length > 1) {
            // Capture groups
            const groups = [];
            for (let i = 1; i < match.length; i++) {
              groups.push({
                group: i,
                value: match[i] || '(undefined)'
              });
            }
            captureGroups.push({
              match: match[0],
              groups
            });
          }
          
          matchPositions.push({
            start: match.index,
            end: match.index + match[0].length
          });
        }
        
        // Highlight matches in text
        if (matchPositions.length > 0) {
          let result = '';
          let lastIndex = 0;
          
          matchPositions.forEach(pos => {
            result += testString.slice(lastIndex, pos.start);
            result += `<mark>${testString.slice(pos.start, pos.end)}</mark>`;
            lastIndex = pos.end;
          });
          result += testString.slice(lastIndex);
          highlighted = result;
        }
      } else {
        // No global flag - find first match
        const match = regex.exec(testString);
        if (match) {
          allMatches.push({
            match: match[0],
            index: match.index,
            length: match[0].length
          });
          
          if (match.length > 1) {
            const groups = [];
            for (let i = 1; i < match.length; i++) {
              groups.push({
                group: i,
                value: match[i] || '(undefined)'
              });
            }
            captureGroups.push({
              match: match[0],
              groups
            });
          }
          
          // Highlight the match
          highlighted = testString.slice(0, match.index) + 
                       `<mark>${match[0]}</mark>` + 
                       testString.slice(match.index + match[0].length);
        }
      }
      
      setMatches(allMatches);
      setGroups(captureGroups);
      setHighlightedText(highlighted);
      setError('');
    } catch (err) {
      setError(`Invalid regex: ${err.message}`);
      setMatches([]);
      setGroups([]);
      setHighlightedText(testString);
    }
  };

  const handleCopyRegex = async () => {
    const fullRegex = `/${pattern}/${flags}`;
    await copyToClipboard(fullRegex);
  };

  const handleCopyMatches = async () => {
    const matchText = matches.map(m => m.match).join('\n');
    await copyToClipboard(matchText);
  };

  const commonPatterns = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { name: 'URL', pattern: 'https?://[^\\s]+' },
    { name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}' },
    { name: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
    { name: 'Hex Color', pattern: '#[0-9A-Fa-f]{6}\\b' },
    { name: 'UUID', pattern: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' }
  ];

  return (
    <div className="tool-content">
      <div className="tool-header">
        <h2>Regex Tester & Debugger</h2>
        <p className="tool-description">
          Test regular expressions with real-time matching, capture groups, and visual highlighting.
        </p>
        <div className="tool-docs">
          <h4>Features</h4>
          <p>• Real-time pattern matching</p>
          <p>• Visual match highlighting</p>
          <p>• Capture group extraction</p>
          <p>• Common pattern library</p>
          <p>• Support for all JavaScript regex flags</p>
        </div>
      </div>
      
      <div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="regexPattern">Regular Expression</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="mono">/</span>
              <input 
                id="regexPattern"
                type="text"
                className="mono"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="[a-z]+@[a-z]+\.[a-z]+"
                style={{ flex: 1 }}
              />
              <span className="mono">/</span>
              <input 
                type="text"
                className="mono"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="gim"
                style={{ width: '60px' }}
                title="Flags: g=global, i=case-insensitive, m=multiline, s=dotall, u=unicode, y=sticky"
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Common Patterns</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {commonPatterns.map(p => (
              <button 
                key={p.name}
                className="btn secondary small"
                onClick={() => setPattern(p.pattern)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
        
        <label htmlFor="testString">Test String</label>
        <textarea 
          id="testString"
          className="mono"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test your regex pattern against..."
          style={{ minHeight: '100px' }}
        />
        
        {error && (
          <div className="status err" style={{ marginTop: '10px' }}>
            {error}
          </div>
        )}
        
        {!error && testString && (
          <>
            <label style={{ marginTop: '16px' }}>Highlighted Matches</label>
            <div 
              className="output mono" 
              style={{ 
                padding: '10px', 
                minHeight: '50px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                lineHeight: '1.5'
              }}
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
              <div style={{ flex: 1 }}>
                <label>Matches ({matches.length})</label>
                <div className="output mono" style={{ minHeight: '100px', fontSize: '13px' }}>
                  {matches.length === 0 ? (
                    <span style={{ color: '#999' }}>No matches found</span>
                  ) : (
                    matches.map((m, i) => (
                      <div key={i}>
                        Match {i + 1}: "{m.match}" at index {m.index}
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {groups.length > 0 && (
                <div style={{ flex: 1 }}>
                  <label>Capture Groups</label>
                  <div className="output mono" style={{ minHeight: '100px', fontSize: '13px' }}>
                    {groups.map((g, i) => (
                      <div key={i} style={{ marginBottom: '5px' }}>
                        <div>Match: "{g.match}"</div>
                        {g.groups.map((group, j) => (
                          <div key={j} style={{ paddingLeft: '15px' }}>
                            Group {group.group}: "{group.value}"
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        
        <div className="toolbar">
          <button className="btn secondary small" onClick={() => {
            setPattern('');
            setTestString('');
            setFlags('g');
          }}>Clear</button>
          <button className="btn small" onClick={handleCopyMatches} disabled={matches.length === 0}>
            Copy Matches
          </button>
          <button className="btn" onClick={handleCopyRegex} disabled={!pattern}>
            Copy Regex
          </button>
        </div>
      </div>

      <style jsx>{`
        mark {
          background-color: #ffeb3b;
          color: #000;
          padding: 2px 0;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}