import React, { useState, useEffect } from 'react';
import { formatSql, minifySql } from '../utils/sqlFormatter';
import { copyToClipboard } from '../utils/clipboard';

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('');
  const [autoFormat, setAutoFormat] = useState(true);

  useEffect(() => {
    if (autoFormat && input) {
      handleFormat();
    }
  }, [input, autoFormat]);

  const handleFormat = () => {
    const result = formatSql(input);
    if (result.success) {
      setOutput(result.result);
      setStatus('');
    } else {
      setOutput('');
      setStatus(result.error);
    }
  };

  const handleMinify = () => {
    const result = minifySql(input);
    if (result.success) {
      setOutput(result.result);
      setStatus('Minified');
    } else {
      setOutput('');
      setStatus(result.error);
    }
  };

  const handleCopy = async () => {
    const result = await copyToClipboard(output);
    setStatus(result.success ? 'Copied!' : result.error);
    setTimeout(() => setStatus(''), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setStatus('');
  };

  const exampleQuery = `select u.id, u.name, u.email, count(o.id) as order_count from users u left join orders o on u.id = o.user_id where u.created_at > '2024-01-01' and u.status = 'active' group by u.id, u.name, u.email having count(o.id) > 5 order by order_count desc limit 10`;

  return (
    <div className="tool-content">
      <div className="tool-header">
        <h2>SQL Formatter</h2>
        <p className="tool-description">
          Format and beautify SQL queries with proper indentation and keyword highlighting.
        </p>
        <div className="tool-docs">
          <h4>Features</h4>
          <p>• Automatic keyword capitalization</p>
          <p>• Smart indentation for readability</p>
          <p>• Handles complex nested queries</p>
          <p>• Minify option for compact queries</p>
          <p>• Preserves your table and column names</p>
        </div>
      </div>
      
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label htmlFor="sqlInput">SQL Query</label>
          <label style={{ fontWeight: 'normal', fontSize: '14px' }}>
            <input 
              type="checkbox" 
              checked={autoFormat}
              onChange={(e) => setAutoFormat(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Auto-format
          </label>
        </div>
        <textarea 
          id="sqlInput"
          className="mono"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter your SQL query here, or try this example:\n\n${exampleQuery}`}
          style={{ minHeight: '200px' }}
        />
        
        <label style={{ marginTop: '16px' }}>Formatted SQL</label>
        <textarea 
          className="output mono" 
          value={output}
          readOnly
          style={{ minHeight: '200px' }}
          placeholder="Formatted SQL will appear here..."
        />
        
        <div className="toolbar">
          {status && (
            <span className={`status ${status.includes('error') ? 'err' : 'ok'}`}>
              {status}
            </span>
          )}
          <button className="btn secondary small" onClick={handleClear}>Clear</button>
          <button className="btn secondary small" onClick={handleMinify}>Minify</button>
          <button className="btn small" onClick={handleCopy}>Copy Output</button>
          <button className="btn" onClick={handleFormat}>Format SQL</button>
        </div>
      </div>
    </div>
  );
}