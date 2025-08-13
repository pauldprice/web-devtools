import React, { useState } from 'react';
import { decodeJwt } from '../utils/cryptoUtils';
import { copyToClipboard } from '../utils/clipboard';

export default function JwtDecoder() {
  const [jwtInput, setJwtInput] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  const handleDecode = () => {
    if (!jwtInput.trim()) {
      setHeader('');
      setPayload('');
      setStatus('Please enter a JWT token');
      setIsError(true);
      setTimeout(() => setStatus(''), 2000);
      return;
    }

    const result = decodeJwt(jwtInput);
    
    if (result.success) {
      setHeader(result.header);
      setPayload(result.payload);
      setStatus('Decoded successfully');
      setIsError(false);
    } else {
      setHeader('');
      setPayload(result.error);
      setStatus('Failed to decode');
      setIsError(true);
    }
    
    setTimeout(() => setStatus(''), 3000);
  };

  const handleCopy = async (text, type) => {
    const result = await copyToClipboard(text);
    setStatus(result.success ? `${type} copied!` : result.error);
    setIsError(!result.success);
    setTimeout(() => setStatus(''), 2000);
  };

  const handleClear = () => {
    setJwtInput('');
    setHeader('');
    setPayload('');
    setStatus('');
    setIsError(false);
  };

  // Auto-decode on input change
  React.useEffect(() => {
    if (jwtInput && jwtInput.split('.').length >= 2) {
      const timer = setTimeout(() => {
        handleDecode();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setHeader('');
      setPayload('');
    }
  }, [jwtInput]);

  return (
    <div className="tool-content">
      <div className="tool-header">
        <h2>JWT Decoder</h2>
        <p className="tool-description">
          Decode and inspect JSON Web Tokens (JWT) without signature verification.
        </p>
        <div className="tool-docs">
          <h4>Important Notes</h4>
          <p>⚠️ This tool is for inspection only and does NOT verify signatures</p>
          <p>• Decodes the header and payload sections of a JWT</p>
          <p>• Useful for debugging and inspecting token contents</p>
          <p>• Never trust decoded tokens without proper server-side verification</p>
          <p>• The signature portion is not decoded or verified</p>
        </div>
      </div>
      
      <div>
        <label htmlFor="jwtIn">JWT Token</label>
        <textarea 
          id="jwtIn"
          className="mono"
          value={jwtInput}
          onChange={(e) => setJwtInput(e.target.value)}
          placeholder="Paste a JWT token (header.payload.signature)"
          style={{ minHeight: '100px' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleDecode();
            }
          }}
        />
        
        <div className="two" style={{ marginTop: '16px' }}>
          <div>
            <label>Decoded Header</label>
            <textarea 
              className="output mono"
              value={header}
              readOnly
              placeholder="JWT header will appear here"
              style={{ minHeight: '150px' }}
            />
            <button 
              className="btn small" 
              onClick={() => handleCopy(header, 'Header')}
              disabled={!header || isError}
              style={{ marginTop: '8px' }}
            >
              Copy Header
            </button>
          </div>
          <div>
            <label>Decoded Payload</label>
            <textarea 
              className={`output mono ${isError && payload ? 'error' : ''}`}
              value={payload}
              readOnly
              placeholder="JWT payload will appear here"
              style={{ minHeight: '150px' }}
            />
            <button 
              className="btn small" 
              onClick={() => handleCopy(payload, 'Payload')}
              disabled={!payload || isError}
              style={{ marginTop: '8px' }}
            >
              Copy Payload
            </button>
          </div>
        </div>
        
        <div className="toolbar">
          {status && (
            <span className={`status ${isError ? 'err' : 'ok'}`}>{status}</span>
          )}
          <span className="tiny" style={{ marginRight: 'auto', color: 'var(--warn)' }}>
            ⚠️ For inspection only; does not validate signatures
          </span>
          <button className="btn secondary small" onClick={handleClear}>Clear</button>
          <button className="btn" onClick={handleDecode}>Decode Token</button>
        </div>
      </div>
    </div>
  );
}