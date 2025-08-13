// Text and string manipulation utilities

export const tokenize = (str) => {
  return (str || '')
    .replace(/[_\-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim()
    .split(/\s+/);
};

export const toCamelCase = (str) => {
  const parts = tokenize(str).map(p => p.toLowerCase());
  return parts.map((p, i) => i ? p.charAt(0).toUpperCase() + p.slice(1) : p).join('');
};

export const toSnakeCase = (str) => tokenize(str).map(p => p.toLowerCase()).join('_');

export const toKebabCase = (str) => tokenize(str).map(p => p.toLowerCase()).join('-');

export const toTitleCase = (str) => 
  tokenize(str).map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');

export const toJsString = (input) => JSON.stringify(input);

export const prettifyJson = (jsonString) => {
  try {
    const obj = JSON.parse(jsonString);
    return { 
      success: true, 
      result: JSON.stringify(obj, null, 2) 
    };
  } catch (err) {
    return { 
      success: false, 
      error: err.message 
    };
  }
};

export const encodeUriParams = (key, value) => {
  return encodeURIComponent(key) + '=' + encodeURIComponent(value);
};