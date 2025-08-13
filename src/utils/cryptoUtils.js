// Cryptographic and encoding utilities

const utf8enc = new TextEncoder();
const utf8dec = new TextDecoder();

export const generateUuid = () => {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  const rnds = crypto.getRandomValues(new Uint8Array(16));
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;
  const hex = [...rnds].map(b => b.toString(16).padStart(2, '0'));
  return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
};

export const base64Encode = (str) => {
  const bytes = utf8enc.encode(str);
  let bin = '';
  bytes.forEach(b => bin += String.fromCharCode(b));
  return btoa(bin);
};

export const base64Decode = (b64) => {
  try {
    const bin = atob(b64);
    const bytes = Uint8Array.from([...bin].map(ch => ch.charCodeAt(0)));
    return { success: true, result: utf8dec.decode(bytes) };
  } catch (e) {
    return { success: false, error: 'Invalid Base64' };
  }
};

export const sha256Hash = async (str) => {
  try {
    const data = utf8enc.encode(str);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const hash = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
    return { success: true, result: hash };
  } catch (e) {
    return { success: false, error: 'SHA-256 unavailable' };
  }
};

const base64urlToBase64 = (s) => 
  s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=');

export const decodeJwt = (token) => {
  try {
    const [h, p] = token.trim().split('.');
    const header = h ? JSON.parse(utf8dec.decode(Uint8Array.from(
      [...atob(base64urlToBase64(h))].map(ch => ch.charCodeAt(0))
    ))) : {};
    const payload = p ? JSON.parse(utf8dec.decode(Uint8Array.from(
      [...atob(base64urlToBase64(p))].map(ch => ch.charCodeAt(0))
    ))) : {};
    
    return {
      success: true,
      header: JSON.stringify(header, null, 2),
      payload: JSON.stringify(payload, null, 2)
    };
  } catch (e) {
    return {
      success: false,
      error: 'Invalid JWT: ' + e.message
    };
  }
};