import React, { useState } from 'react';
import { copyToClipboard } from '../utils/clipboard';

export default function HmacSha256Tool() {
  const [message, setMessage] = useState('');
  const [secretKey, setSecretKey] = useState('BBB');
  const [signature, setSignature] = useState('');
  const [verifySignature, setVerifySignature] = useState('');
  const [verifyResult, setVerifyResult] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [mode, setMode] = useState('sign'); // 'sign' or 'verify'

  const generateHmac = async () => {
    if (!message) {
      setStatus('Please enter a message');
      setIsError(true);
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    if (!secretKey) {
      setStatus('Please enter a secret key');
      setIsError(true);
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    try {
      // Convert strings to ArrayBuffer
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secretKey);
      const msgData = encoder.encode(message);

      // Import the key for HMAC
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      // Generate the HMAC signature
      const signatureBuffer = await crypto.subtle.sign('HMAC', key, msgData);
      
      // Convert to hex string
      const hashArray = Array.from(new Uint8Array(signatureBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setSignature(hashHex);
      setStatus('HMAC generated successfully');
      setIsError(false);
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('Error generating HMAC: ' + error.message);
      setIsError(true);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const verifyHmac = async () => {
    if (!message || !secretKey || !verifySignature) {
      setStatus('Please enter message, key, and signature to verify');
      setIsError(true);
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    try {
      // Generate HMAC for the message with the provided key
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secretKey);
      const msgData = encoder.encode(message);

      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signatureBuffer = await crypto.subtle.sign('HMAC', key, msgData);
      const hashArray = Array.from(new Uint8Array(signatureBuffer));
      const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Compare with provided signature (case insensitive)
      const isValid = computedHash.toLowerCase() === verifySignature.toLowerCase().trim();
      
      if (isValid) {
        setVerifyResult('✅ Valid signature - Message is authentic');
        setStatus('Signature verified successfully');
        setIsError(false);
      } else {
        setVerifyResult('❌ Invalid signature - Message or key does not match');
        setStatus('Signature verification failed');
        setIsError(true);
      }
      
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('Error verifying HMAC: ' + error.message);
      setIsError(true);
      setVerifyResult('');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleCopy = async () => {
    const result = await copyToClipboard(signature);
    setStatus(result.success ? 'Copied!' : result.error);
    setIsError(!result.success);
    setTimeout(() => setStatus(''), 2000);
  };

  const handleClear = () => {
    setMessage('');
    setSecretKey('BBB');
    setSignature('');
    setVerifySignature('');
    setVerifyResult('');
    setStatus('');
    setIsError(false);
  };

  return (
    <div className="tool-content">
      <div className="tool-header">
        <h2>HMAC-SHA256 Generator & Verifier</h2>
        <p className="tool-description">
          Generate and verify HMAC-SHA256 signatures for message authentication.
        </p>
        <div className="tool-docs">
          <h4>What is HMAC-SHA256?</h4>
          <p>• <strong>HMAC</strong>: Hash-based Message Authentication Code</p>
          <p>• Provides data integrity and authentication using a secret key</p>
          <p>• Used for API authentication, webhooks, and secure messaging</p>
          <p>• One-way function - cannot decrypt, only verify</p>
          <div style={{ padding: '10px', background: '#fff3cd', borderRadius: '4px', marginTop: '10px' }}>
            <strong>⚠️ Security Note:</strong> Never share your secret key. HMAC is for authentication, not encryption.
          </div>
        </div>
      </div>
      
      <div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
            <button 
              className={mode === 'sign' ? 'btn' : 'btn secondary'}
              onClick={() => setMode('sign')}
              style={{ flex: 1 }}
            >
              Generate Signature
            </button>
            <button 
              className={mode === 'verify' ? 'btn' : 'btn secondary'}
              onClick={() => setMode('verify')}
              style={{ flex: 1 }}
            >
              Verify Signature
            </button>
          </label>
        </div>

        <div>
          <label htmlFor="hmacMessage">Message</label>
          <textarea 
            id="hmacMessage"
            className="mono"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter the message to sign or verify"
            style={{ minHeight: '100px' }}
          />
        </div>

        <div style={{ marginTop: '16px' }}>
          <label htmlFor="hmacKey">Secret Key</label>
          <input 
            type="text"
            id="hmacKey"
            className="mono"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Enter your secret key (default: BBB)"
            style={{ background: '#fff9e6' }}
          />
        </div>

        {mode === 'sign' ? (
          <>
            <div style={{ marginTop: '16px' }}>
              <label>HMAC-SHA256 Signature (Hex)</label>
              <textarea 
                className="output mono" 
                value={signature}
                readOnly
                placeholder="Signature will appear here..."
                style={{ minHeight: '80px' }}
              />
            </div>
            
            <div className="toolbar">
              {status && (
                <span className={`status ${isError ? 'err' : 'ok'}`}>
                  {status}
                </span>
              )}
              <button className="btn secondary small" onClick={handleClear}>Clear</button>
              <button 
                className="btn small" 
                onClick={handleCopy}
                disabled={!signature}
              >
                Copy Signature
              </button>
              <button className="btn" onClick={generateHmac}>Generate HMAC</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginTop: '16px' }}>
              <label htmlFor="hmacVerify">Signature to Verify</label>
              <input 
                type="text"
                id="hmacVerify"
                className="mono"
                value={verifySignature}
                onChange={(e) => setVerifySignature(e.target.value)}
                placeholder="Paste the HMAC signature to verify"
              />
            </div>

            {verifyResult && (
              <div style={{ 
                marginTop: '16px', 
                padding: '15px', 
                background: verifyResult.includes('✅') ? '#d4edda' : '#f8d7da',
                borderRadius: '4px',
                border: `1px solid ${verifyResult.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
              }}>
                <strong>{verifyResult}</strong>
              </div>
            )}
            
            <div className="toolbar">
              {status && (
                <span className={`status ${isError ? 'err' : 'ok'}`}>
                  {status}
                </span>
              )}
              <button className="btn secondary small" onClick={handleClear}>Clear</button>
              <button className="btn" onClick={verifyHmac}>Verify Signature</button>
            </div>
          </>
        )}

        <div style={{ marginTop: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
          <h4>Common Use Cases</h4>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li>API request signing (e.g., AWS, webhooks)</li>
            <li>JWT token signing</li>
            <li>Message integrity verification</li>
            <li>Password-based authentication</li>
          </ul>
          <div style={{ marginTop: '15px' }}>
            <strong>Example:</strong>
            <pre style={{ marginTop: '5px', padding: '10px', background: 'white', borderRadius: '4px' }}>
{`Message: {"user":"john","action":"login"}
Key: mySecretKey123
HMAC: 7f3b2c1a9e8d5f4b2a1c3e5d7f9b1a3c...`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}