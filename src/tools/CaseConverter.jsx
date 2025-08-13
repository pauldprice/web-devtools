import React, { useState } from 'react';
import { toCamelCase, toSnakeCase, toKebabCase, toTitleCase } from '../utils/textUtils';
import { copyToClipboard } from '../utils/clipboard';

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [camelCase, setCamelCase] = useState('');
  const [snakeCase, setSnakeCase] = useState('');
  const [kebabCase, setKebabCase] = useState('');
  const [titleCase, setTitleCase] = useState('');
  const [status, setStatus] = useState('');

  const handleConvert = () => {
    setCamelCase(toCamelCase(input));
    setSnakeCase(toSnakeCase(input));
    setKebabCase(toKebabCase(input));
    setTitleCase(toTitleCase(input));
  };

  const handleCopy = async (text, caseName) => {
    const result = await copyToClipboard(text);
    setStatus(result.success ? `${caseName} copied!` : result.error);
    setTimeout(() => setStatus(''), 2000);
  };

  const handleClear = () => {
    setInput('');
    setCamelCase('');
    setSnakeCase('');
    setKebabCase('');
    setTitleCase('');
    setStatus('');
  };

  // Auto-convert on input change
  React.useEffect(() => {
    if (input) {
      handleConvert();
    } else {
      setCamelCase('');
      setSnakeCase('');
      setKebabCase('');
      setTitleCase('');
    }
  }, [input]);

  return (
    <div className="tool-content">
      <div className="tool-header">
        <h2>Case Converters</h2>
        <p className="tool-description">
          Convert text between different naming conventions and case styles.
        </p>
        <div className="tool-docs">
          <h4>Supported Formats</h4>
          <p>• <strong>camelCase:</strong> variableName, getUserData</p>
          <p>• <strong>snake_case:</strong> variable_name, get_user_data</p>
          <p>• <strong>kebab-case:</strong> variable-name, get-user-data</p>
          <p>• <strong>Title Case:</strong> Variable Name, Get User Data</p>
        </div>
      </div>
      
      <div>
        <label htmlFor="caseIn">Input Text</label>
        <textarea 
          id="caseIn"
          placeholder="Enter text in any format (e.g., Hello world, convert_me, some-text)"
          className="mono"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleConvert();
            }
          }}
        />
        
        <div style={{ marginTop: '16px' }}>
          <div className="two">
            <div>
              <label>camelCase</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="mono" 
                  value={camelCase}
                  readOnly
                  style={{ flex: 1 }}
                />
                <button 
                  className="btn small" 
                  onClick={() => handleCopy(camelCase, 'camelCase')}
                  disabled={!camelCase}
                >
                  Copy
                </button>
              </div>
            </div>
            <div>
              <label>snake_case</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="mono" 
                  value={snakeCase}
                  readOnly
                  style={{ flex: 1 }}
                />
                <button 
                  className="btn small" 
                  onClick={() => handleCopy(snakeCase, 'snake_case')}
                  disabled={!snakeCase}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
          <div className="two" style={{ marginTop: '16px' }}>
            <div>
              <label>kebab-case</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="mono" 
                  value={kebabCase}
                  readOnly
                  style={{ flex: 1 }}
                />
                <button 
                  className="btn small" 
                  onClick={() => handleCopy(kebabCase, 'kebab-case')}
                  disabled={!kebabCase}
                >
                  Copy
                </button>
              </div>
            </div>
            <div>
              <label>Title Case</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="mono" 
                  value={titleCase}
                  readOnly
                  style={{ flex: 1 }}
                />
                <button 
                  className="btn small" 
                  onClick={() => handleCopy(titleCase, 'Title Case')}
                  disabled={!titleCase}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="toolbar">
          {status && <span className="status ok">{status}</span>}
          <button className="btn secondary small" onClick={handleClear}>Clear All</button>
          <button className="btn" onClick={handleConvert}>Convert All</button>
        </div>
      </div>
    </div>
  );
}