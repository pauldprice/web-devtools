import React, { useState } from 'react';
import { encodeUriParams } from '../utils/textUtils';
import { copyToClipboard } from '../utils/clipboard';

export default function UriEncoder() {
  const [param, setParam] = useState('');
  const [value, setValue] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('');

  const handleEncode = () => {
    setOutput(encodeUriParams(param, value));
  };

  const handleCopy = async () => {
    const result = await copyToClipboard(output);
    setStatus(result.success ? 'Copied!' : result.error);
    setTimeout(() => setStatus(''), 2000);
  };

  const handleClear = () => {
    setParam('');
    setValue('');
    setOutput('');
  };

  return (
    <div className="tool-content">
      <div className="tool-header">
        <h2>URI Parameter Encoder</h2>
        <p className="tool-description">
          Safely encode URL parameters and values for use in query strings.
        </p>
        <div className="tool-docs">
          <h4>When to use</h4>
          <p>Use this when building URLs with query parameters that contain special characters like spaces, ampersands, or non-ASCII characters.</p>
          <p><strong>Example:</strong> <code>search term</code> + <code>coffee & cream</code> → <code>search%20term=coffee%20%26%20cream</code></p>
        </div>
      </div>
      
      <div>
        <div className="two">
          <div>
            <label htmlFor="uriParam">Parameter Name</label>
            <input 
              type="text" 
              id="uriParam"
              className="mono"
              value={param}
              onChange={(e) => setParam(e.target.value)}
              placeholder="e.g. search term"
            />
          </div>
          <div>
            <label htmlFor="uriVal">Value</label>
            <input 
              type="text" 
              id="uriVal"
              className="mono"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. coffee & cream"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEncode();
                }
              }}
            />
          </div>
        </div>
        
        <label>Encoded Result</label>
        <input 
          type="text" 
          className="mono" 
          value={output}
          readOnly
          placeholder="param=value"
        />
        
        <div className="toolbar">
          {status && <span className="status ok">{status}</span>}
          <button className="btn secondary small" onClick={handleClear}>Clear</button>
          <button className="btn small" onClick={handleCopy}>Copy</button>
          <button className="btn" onClick={handleEncode}>Encode</button>
        </div>
      </div>
    </div>
  );
}