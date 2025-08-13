import React, { useState } from 'react';
import { sha256Hash } from '../utils/cryptoUtils';
import { copyToClipboard } from '../utils/clipboard';

export default function Sha256Tool() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleHash = async () => {
    setIsLoading(true);
    setStatus('Hashing...');
    
    const result = await sha256Hash(input);
    
    if (result.success) {
      setHash(result.result);
      setStatus('Done');
      setIsError(false);
    } else {
      setHash('');
      setStatus(result.error);
      setIsError(true);
    }
    
    setIsLoading(false);
    setTimeout(() => setStatus(''), 2000);
  };

  const handleCopy = async () => {
    const result = await copyToClipboard(hash);
    setStatus(result.success ? 'Copied!' : result.error);
    setIsError(!result.success);
    setTimeout(() => setStatus(''), 2000);
  };

  const handleClear = () => {
    setInput('');
    setHash('');
    setStatus('');
    setIsError(false);
  };

  return (
    <div className="tool-content">
      <div className="tool-header">
        <h2>SHA-256 Hash Generator</h2>
        <p className="tool-description">
          Generate SHA-256 cryptographic hashes from any text input.
        </p>
        <div className="tool-docs">
          <h4>About SHA-256</h4>
          <p>• Produces a 256-bit (64 hexadecimal character) hash</p>
          <p>• One-way function - cannot be reversed to get original input</p>
          <p>• Uses browser's native SubtleCrypto API for secure hashing</p>
          <p>• Commonly used for checksums, password storage, and data integrity</p>
        </div>
      </div>
      
      <div>
        <label htmlFor="shaIn">Input Text</label>
        <textarea 
          id="shaIn"
          className="mono"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleHash();
            }
          }}
        />
        
        <label style={{ marginTop: '16px' }}>SHA-256 Hash (Hex)</label>
        <input 
          type="text" 
          className="mono"
          value={hash}
          readOnly
          placeholder="Hash will appear here"
        />
        
        <div className="toolbar">
          {status && (
            <span className={`status ${isError ? 'err' : 'ok'}`}>{status}</span>
          )}
          <button className="btn secondary small" onClick={handleClear}>Clear</button>
          <button className="btn small" onClick={handleCopy} disabled={!hash}>Copy</button>
          <button className="btn" onClick={handleHash} disabled={isLoading}>
            {isLoading ? 'Hashing...' : 'Generate Hash'}
          </button>
        </div>
      </div>
    </div>
  );
}