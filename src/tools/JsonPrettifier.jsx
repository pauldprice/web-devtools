import React, { useState } from 'react';
import { prettifyJson } from '../utils/textUtils';
import { copyToClipboard } from '../utils/clipboard';

export default function JsonPrettifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  const handlePrettify = () => {
    const result = prettifyJson(input);
    if (result.success) {
      setOutput(result.result);
      setStatus('Valid JSON');
      setIsError(false);
    } else {
      setOutput('');
      setStatus('Invalid JSON: ' + result.error);
      setIsError(true);
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
    setIsError(false);
  };

  return (
    <div className="tool-content">
      <div className="tool-header">
        <h2>JSON Prettifier</h2>
        <p className="tool-description">
          Format and beautify JSON data with proper indentation for better readability.
        </p>
        <div className="tool-docs">
          <h4>Features</h4>
          <p>• Validates JSON syntax and reports errors</p>
          <p>• Formats with 2-space indentation</p>
          <p>• Handles nested objects and arrays</p>
        </div>
      </div>
      
      <div>
        <label htmlFor="jsonPrettyIn">Input JSON</label>
        <textarea 
          id="jsonPrettyIn"
          className="mono"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name":"example","items":[1,2,3],"nested":{"key":"value"}}'
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handlePrettify();
            }
          }}
        />
        
        <label style={{ marginTop: '16px' }}>Formatted Output</label>
        <textarea 
          className="output mono" 
          value={output}
          readOnly
        />
        
        <div className="toolbar">
          {status && (
            <span className={`status ${isError ? 'err' : 'ok'}`}>{status}</span>
          )}
          <button className="btn secondary small" onClick={handleClear}>Clear</button>
          <button className="btn small" onClick={handleCopy}>Copy Output</button>
          <button className="btn" onClick={handlePrettify}>Prettify</button>
        </div>
      </div>
    </div>
  );
}