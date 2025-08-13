import React, { useState } from 'react';
import { timestampToIso, isoToTimestamp } from '../utils/dateUtils';
import { copyToClipboard } from '../utils/clipboard';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [isoDate, setIsoDate] = useState('');
  const [timestampToIsoResult, setTimestampToIsoResult] = useState('');
  const [isoToTimestampResult, setIsoToTimestampResult] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  const handleConvert = () => {
    let hasError = false;
    let errorMessages = [];

    // Convert timestamp to ISO
    if (timestamp) {
      const result = timestampToIso(timestamp);
      if (result.success) {
        setTimestampToIsoResult(result.result);
      } else {
        setTimestampToIsoResult('');
        errorMessages.push(result.error);
        hasError = true;
      }
    } else {
      setTimestampToIsoResult('');
    }

    // Convert ISO to timestamp
    if (isoDate) {
      const result = isoToTimestamp(isoDate);
      if (result.success) {
        setIsoToTimestampResult(result.result);
      } else {
        setIsoToTimestampResult('');
        errorMessages.push(result.error);
        hasError = true;
      }
    } else {
      setIsoToTimestampResult('');
    }

    // Set status
    if (hasError) {
      setStatus(errorMessages.join(' • '));
      setIsError(true);
    } else if (timestamp || isoDate) {
      setStatus('Converted');
      setIsError(false);
    } else {
      setStatus('');
      setIsError(false);
    }

    if (status) {
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleCopy = async (text, type) => {
    const result = await copyToClipboard(text);
    setStatus(result.success ? `${type} copied!` : result.error);
    setIsError(!result.success);
    setTimeout(() => setStatus(''), 2000);
  };

  const handleClear = () => {
    setTimestamp('');
    setIsoDate('');
    setTimestampToIsoResult('');
    setIsoToTimestampResult('');
    setStatus('');
    setIsError(false);
  };

  const handleNow = () => {
    const now = Date.now();
    setTimestamp(String(now));
    setIsoDate(new Date(now).toISOString());
    handleConvert();
  };

  // Auto-convert on input change
  React.useEffect(() => {
    if (timestamp || isoDate) {
      const timer = setTimeout(() => {
        handleConvert();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [timestamp, isoDate]);

  return (
    <div className="tool-content">
      <div className="tool-header">
        <h2>Unix Timestamp ⇄ ISO 8601</h2>
        <p className="tool-description">
          Convert between Unix timestamps and ISO 8601 date/time format.
        </p>
        <div className="tool-docs">
          <h4>Format Information</h4>
          <p>• <strong>Unix timestamp:</strong> Seconds or milliseconds since January 1, 1970 UTC</p>
          <p>• <strong>ISO 8601:</strong> International standard date format (e.g., 2025-08-11T12:34:56Z)</p>
          <p>• Automatically detects seconds vs milliseconds based on magnitude</p>
          <p>• Tip: Click "Use Current Time" to fill both fields with the current timestamp</p>
        </div>
      </div>
      
      <div>
        <div className="two">
          <div>
            <label>Unix Timestamp (seconds or ms)</label>
            <input 
              type="text" 
              className="mono"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="e.g. 1723333333 or 1723333333000"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConvert();
                }
              }}
            />
          </div>
          <div>
            <label>ISO 8601 Date</label>
            <input 
              type="text" 
              className="mono"
              value={isoDate}
              onChange={(e) => setIsoDate(e.target.value)}
              placeholder="e.g. 2025-08-11T12:34:56Z"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConvert();
                }
              }}
            />
          </div>
        </div>
        
        <div className="two" style={{ marginTop: '16px' }}>
          <div>
            <label>→ ISO 8601 Output</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input 
                type="text" 
                className="mono"
                value={timestampToIsoResult}
                readOnly
                placeholder="Converted ISO date will appear here"
                style={{ flex: 1 }}
              />
              <button 
                className="btn small" 
                onClick={() => handleCopy(timestampToIsoResult, 'ISO date')}
                disabled={!timestampToIsoResult}
              >
                Copy
              </button>
            </div>
          </div>
          <div>
            <label>→ Unix Timestamp (ms)</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input 
                type="text" 
                className="mono"
                value={isoToTimestampResult}
                readOnly
                placeholder="Converted timestamp will appear here"
                style={{ flex: 1 }}
              />
              <button 
                className="btn small" 
                onClick={() => handleCopy(isoToTimestampResult, 'Timestamp')}
                disabled={!isoToTimestampResult}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
        
        <div className="toolbar">
          {status && (
            <span className={`status ${isError ? 'err' : 'ok'}`}>{status}</span>
          )}
          <button className="btn secondary small" onClick={handleNow}>Use Current Time</button>
          <button className="btn secondary small" onClick={handleClear}>Clear</button>
          <button className="btn" onClick={handleConvert}>Convert</button>
        </div>
      </div>
    </div>
  );
}