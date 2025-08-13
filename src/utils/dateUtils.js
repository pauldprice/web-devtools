// Date and timestamp conversion utilities

export const timestampToIso = (timestamp) => {
  const n = Number(timestamp);
  if (!Number.isFinite(n)) {
    return { success: false, error: 'Invalid timestamp' };
  }
  
  // Detect seconds vs milliseconds
  const ms = n > 1e12 ? n : n * 1000;
  const date = new Date(ms);
  
  if (isNaN(date.getTime())) {
    return { success: false, error: 'Invalid timestamp' };
  }
  
  return { success: true, result: date.toISOString() };
};

export const isoToTimestamp = (isoString) => {
  const date = new Date(isoString);
  
  if (isNaN(date.getTime())) {
    return { success: false, error: 'Invalid date' };
  }
  
  return { success: true, result: String(date.getTime()) };
};