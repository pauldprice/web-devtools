import React, { useState } from 'react';
import { base64Encode, base64Decode } from '../utils/cryptoUtils';
import { copyToClipboard } from '../utils/clipboard';

export default function Base64Tool() {
  const [plainText, setPlainText] = useState('');
  const [base64Text, setBase64Text] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  const handleEncode = () => {
    try {
      const encoded = base64Encode(plainText);
      setBase64Text(encoded);
      setStatus('Encoded successfully');
      setIsError(false);
    } catch (e) {
      setStatus('Error encoding');
      setIsError(true);
    }
    setTimeout(() => setStatus(''), 2000);
  };

  const handleDecode = () => {
    const result = base64Decode(base64Text);
    if (result.success) {
      setPlainText(result.result);
      setStatus('Decoded successfully');
      setIsError(false);
    } else {
      setStatus(result.error);
      setIsError(true);
    }
    setTimeout(() => setStatus(''), 2000);
  };

  const handleCopyBase64 = async () => {
    const result = await copyToClipboard(base64Text);
    setStatus(result.success ? 'Copied!' : result.error);
    setTimeout(() => setStatus(''), 2000);
  };

  const handleClearText = () => {
    setPlainText('');
  };

  const handleClearBase64 = () => {
    setBase64Text('');
  };

  return (
    <div className="tool-content">
      <div className="tool-header">
        <h2>Base64 Encoder / Decoder</h2>
        <p className="tool-description">
          Convert between text and Base64 encoding. UTF-8 safe for international characters.
        </p>
        <div className="tool-docs">
          <h4>Features</h4>
          <p>• Handles multi-byte UTF-8 characters correctly</p>
          <p>• Bidirectional conversion between text and Base64</p>
          <p>• Commonly used for encoding binary data in text format</p>
        </div>
      </div>
      
      <div>
        <div className="two">
          <div>
            <label htmlFor="b64Text">Plain Text</label>
            <textarea 
              id="b64Text"
              className="mono"
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              placeholder="Enter text to encode"
            />
            <div className="toolbar">
              <button className="btn secondary small" onClick={handleClearText}>Clear</button>
              <button className="btn" onClick={handleEncode}>Encode →</button>
            </div>
          </div>
          <div>
            <label htmlFor="b64Out">Base64</label>
            <textarea 
              id="b64Out"
              className="output mono"
              value={base64Text}
              onChange={(e) => setBase64Text(e.target.value)}
              placeholder="Base64 encoded result"
            />
            <div className="toolbar">
              <button className="btn secondary small" onClick={handleDecode}>← Decode</button>
              <button className="btn small" onClick={handleCopyBase64}>Copy</button>
            </div>
          </div>
        </div>
        {status && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span className={`status ${isError ? 'err' : 'ok'}`}>{status}</span>
          </div>
        )}
      </div>
    </div>
  );
}