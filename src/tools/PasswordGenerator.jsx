import React, { useState, useEffect } from 'react';
import { copyToClipboard } from '../utils/clipboard';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [includeCustom, setIncludeCustom] = useState('');
  const [excludeCustom, setExcludeCustom] = useState('');
  const [status, setStatus] = useState('');
  const [strength, setStrength] = useState({ score: 0, text: '', color: '' });
  const [history, setHistory] = useState([]);

  const charSets = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O'
  };

  useEffect(() => {
    generatePassword();
  }, []);

  useEffect(() => {
    if (password) {
      calculateStrength();
    }
  }, [password]);

  const generatePassword = () => {
    let charset = '';
    
    if (includeLowercase) charset += charSets.lowercase;
    if (includeUppercase) charset += charSets.uppercase;
    if (includeNumbers) charset += charSets.numbers;
    if (includeSymbols) charset += charSets.symbols;
    if (includeCustom) charset += includeCustom;
    
    // Remove excluded characters
    if (excludeSimilar) {
      charSets.similar.split('').forEach(char => {
        charset = charset.replace(new RegExp(char, 'g'), '');
      });
    }
    if (excludeCustom) {
      excludeCustom.split('').forEach(char => {
        charset = charset.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
      });
    }
    
    if (!charset) {
      setStatus('Please select at least one character type');
      return;
    }
    
    // Generate cryptographically secure random password
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset[array[i] % charset.length];
    }
    
    // Ensure at least one character from each selected type
    const requiredChars = [];
    if (includeLowercase) requiredChars.push(getRandomChar(charSets.lowercase));
    if (includeUppercase) requiredChars.push(getRandomChar(charSets.uppercase));
    if (includeNumbers) requiredChars.push(getRandomChar(charSets.numbers));
    if (includeSymbols) requiredChars.push(getRandomChar(charSets.symbols));
    
    // Replace random positions with required characters
    requiredChars.forEach((char, index) => {
      if (index < length) {
        const randomPos = Math.floor(Math.random() * length);
        newPassword = newPassword.substring(0, randomPos) + char + newPassword.substring(randomPos + 1);
      }
    });
    
    setPassword(newPassword);
    setStatus('');
    
    // Add to history (keep last 5)
    setHistory(prev => [newPassword, ...prev.filter(p => p !== newPassword)].slice(0, 5));
  };

  const getRandomChar = (charset) => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return charset[array[0] % charset.length];
  };

  const calculateStrength = () => {
    let score = 0;
    const checks = {
      length: password.length >= 12,
      veryLong: password.length >= 16,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^a-zA-Z0-9]/.test(password),
      noRepeats: !/(.)\1{2,}/.test(password),
      noCommon: !/(password|123456|qwerty|admin|letmein)/i.test(password)
    };
    
    // Calculate score
    if (checks.length) score += 20;
    if (checks.veryLong) score += 10;
    if (checks.lowercase) score += 15;
    if (checks.uppercase) score += 15;
    if (checks.numbers) score += 15;
    if (checks.symbols) score += 20;
    if (checks.noRepeats) score += 5;
    if (checks.noCommon) score += 0;
    
    // Determine strength level
    let text, color;
    if (score < 30) {
      text = 'Very Weak';
      color = '#f44336';
    } else if (score < 50) {
      text = 'Weak';
      color = '#ff9800';
    } else if (score < 70) {
      text = 'Fair';
      color = '#ffc107';
    } else if (score < 90) {
      text = 'Strong';
      color = '#8bc34a';
    } else {
      text = 'Very Strong';
      color = '#4caf50';
    }
    
    setStrength({ score, text, color });
  };

  const handleCopy = async () => {
    const result = await copyToClipboard(password);
    setStatus(result.success ? 'Copied to clipboard!' : result.error);
    setTimeout(() => setStatus(''), 2000);
  };

  const handleHistoryCopy = async (pwd) => {
    const result = await copyToClipboard(pwd);
    setStatus(result.success ? 'Copied from history!' : result.error);
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <div className="tool-content">
      <div className="tool-header">
        <h2>Password Generator</h2>
        <p className="tool-description">
          Generate cryptographically secure passwords with customizable complexity.
        </p>
        <div className="tool-docs">
          <h4>Security Features</h4>
          <p>• Uses Web Crypto API for true randomness</p>
          <p>• Passwords never leave your browser</p>
          <p>• Strength meter with real-time feedback</p>
          <p>• History kept locally only</p>
        </div>
      </div>
      
      <div>
        <label>Generated Password</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
          <input 
            type="text"
            className="mono"
            value={password}
            readOnly
            style={{ flex: 1, fontSize: '16px', padding: '12px' }}
          />
          <button className="btn" onClick={handleCopy}>Copy</button>
          <button className="btn secondary" onClick={generatePassword}>Regenerate</button>
        </div>
        
        {password && (
          <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Strength: <strong style={{ color: strength.color }}>{strength.text}</strong></span>
              <div style={{ flex: 1, maxWidth: '200px', height: '8px', background: '#ddd', borderRadius: '4px', marginLeft: '20px' }}>
                <div style={{ 
                  width: `${strength.score}%`, 
                  height: '100%', 
                  background: strength.color, 
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          </div>
        )}
        
        <div style={{ marginTop: '20px' }}>
          <label>Password Length: {length}</label>
          <input 
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
            <span>4</span>
            <span>16</span>
            <span>32</span>
            <span>48</span>
            <span>64</span>
          </div>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <label>Character Types</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <label style={{ fontWeight: 'normal' }}>
              <input 
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
              /> Lowercase (a-z)
            </label>
            <label style={{ fontWeight: 'normal' }}>
              <input 
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
              /> Uppercase (A-Z)
            </label>
            <label style={{ fontWeight: 'normal' }}>
              <input 
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
              /> Numbers (0-9)
            </label>
            <label style={{ fontWeight: 'normal' }}>
              <input 
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
              /> Symbols (!@#$%...)
            </label>
          </div>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <label>Advanced Options</label>
          <label style={{ fontWeight: 'normal', display: 'block', marginBottom: '10px' }}>
            <input 
              type="checkbox"
              checked={excludeSimilar}
              onChange={(e) => setExcludeSimilar(e.target.checked)}
            /> Exclude similar characters (il1Lo0O)
          </label>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '13px' }}>Include specific characters</label>
              <input 
                type="text"
                value={includeCustom}
                onChange={(e) => setIncludeCustom(e.target.value)}
                placeholder="e.g., @#$"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px' }}>Exclude specific characters</label>
              <input 
                type="text"
                value={excludeCustom}
                onChange={(e) => setExcludeCustom(e.target.value)}
                placeholder="e.g., <>/"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
        
        {history.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <label>Recent Passwords</label>
            <div className="output" style={{ fontSize: '13px' }}>
              {history.map((pwd, i) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '5px 10px',
                  borderBottom: i < history.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <span className="mono" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {pwd}
                  </span>
                  <button 
                    className="btn secondary small" 
                    onClick={() => handleHistoryCopy(pwd)}
                    style={{ marginLeft: '10px' }}
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {status && (
          <div className="toolbar">
            <span className="status ok">{status}</span>
          </div>
        )}
      </div>
    </div>
  );
}