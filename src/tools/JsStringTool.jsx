import React, { useState } from 'react';
import { toJsString } from '../utils/textUtils';
import { copyToClipboard } from '../utils/clipboard';

export default function JsStringTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('');

  const handleConvert = () => {
    setOutput(toJsString(input));
  };

  const handleCopy = async () => {
    const result = await copyToClipboard(output);
    setStatus(result.success ? 'Copied!' : result.error);
    setTimeout(() => setStatus(''), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="tool-content">
      <div className="tool-header">
        <h2>Text → JavaScript String Literal</h2>
        <p className="tool-description">
          Convert any text into a properly escaped JavaScript string literal. 
          Handles newlines, quotes, backslashes, and special characters automatically.
        </p>
        <div className="tool-docs">
          <h4>How it works</h4>
          <p>Uses <code>JSON.stringify()</code> to produce a valid double-quoted JavaScript string literal that can be safely pasted into your code.</p>
          <p><strong>Example:</strong> Text with "quotes" and newlines becomes <code>"Text with \"quotes\" and\nnewlines"</code></p>
        </div>
      </div>
      
      <div>
        <label htmlFor="jsStrIn">Input Text</label>
        <textarea 
          id="jsStrIn"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste any text here (newlines, quotes, special characters, etc.)"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleConvert();
            }
          }}
        />
        
        <label style={{ marginTop: '16px' }}>Output (JavaScript String Literal)</label>
        <pre className="output mono">{output}</pre>
        
        <div className="toolbar">
          {status && <span className="status ok">{status}</span>}
          <button className="btn secondary small" onClick={handleClear}>Clear</button>
          <button className="btn small" onClick={handleCopy}>Copy Output</button>
          <button className="btn" onClick={handleConvert}>Convert</button>
        </div>
      </div>
    </div>
  );
}