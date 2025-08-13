import React, { useState } from 'react';
import { generateUuid } from '../utils/cryptoUtils';
import { copyToClipboard } from '../utils/clipboard';

export default function UuidGenerator() {
  const [uuid, setUuid] = useState('');
  const [status, setStatus] = useState('');

  const handleGenerate = () => {
    setUuid(generateUuid());
  };

  const handleCopy = async () => {
    const result = await copyToClipboard(uuid);
    setStatus(result.success ? 'Copied!' : result.error);
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <div className="tool-content">
      <div className="tool-header">
        <h2>UUID v4 Generator</h2>
        <p className="tool-description">
          Generate cryptographically secure UUID v4 identifiers.
        </p>
        <div className="tool-docs">
          <h4>Technical Details</h4>
          <p>• Uses <code>crypto.randomUUID()</code> when available</p>
          <p>• Falls back to secure random generation using <code>crypto.getRandomValues()</code></p>
          <p>• Generates RFC 4122 compliant version 4 UUIDs</p>
        </div>
      </div>
      
      <div>
        <label>Generated UUID</label>
        <input 
          type="text" 
          className="mono" 
          value={uuid}
          readOnly
          placeholder="Click Generate to create a new UUID"
        />
        
        <div className="toolbar">
          {status && <span className="status ok">{status}</span>}
          <button className="btn secondary small" onClick={handleCopy}>Copy</button>
          <button className="btn" onClick={handleGenerate}>Generate New UUID</button>
        </div>
      </div>
    </div>
  );
}