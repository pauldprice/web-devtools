// SQL Formatter utility
// Formats SQL queries with proper indentation and keyword highlighting

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL',
  'ON', 'AS', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL',
  'ORDER', 'BY', 'GROUP', 'HAVING', 'UNION', 'ALL', 'DISTINCT', 'TOP', 'LIMIT',
  'OFFSET', 'FETCH', 'WITH', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW', 'PROCEDURE', 'FUNCTION',
  'IF', 'ELSE', 'CASE', 'WHEN', 'THEN', 'END', 'BEGIN', 'COMMIT', 'ROLLBACK',
  'TRANSACTION', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'UNIQUE', 'DEFAULT',
  'CHECK', 'CONSTRAINT', 'CASCADE', 'RESTRICT', 'GRANT', 'REVOKE', 'EXECUTE'
];

const NEWLINE_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
  'OUTER JOIN', 'FULL JOIN', 'ORDER BY', 'GROUP BY', 'HAVING', 'UNION',
  'INSERT INTO', 'UPDATE', 'DELETE FROM', 'SET', 'VALUES', 'WITH', 'JOIN'
];

export const formatSql = (sql) => {
  if (!sql || !sql.trim()) {
    return { success: true, result: '' };
  }

  try {
    let formatted = sql.trim();
    
    // Remove extra spaces and normalize whitespace
    formatted = formatted.replace(/\s+/g, ' ');
    
    // First, protect compound keywords by replacing them with placeholders
    const compoundKeywords = NEWLINE_KEYWORDS.filter(k => k.includes(' ')).sort((a, b) => b.length - a.length);
    const placeholders = {};
    let placeholderIndex = 0;
    
    compoundKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.replace(' ', '\\s+')}\\b`, 'gi');
      formatted = formatted.replace(regex, (match) => {
        const placeholder = `__PLACEHOLDER_${placeholderIndex}__`;
        placeholders[placeholder] = match.toUpperCase();
        placeholderIndex++;
        return placeholder;
      });
    });
    
    // Then handle single keywords
    const singleKeywords = NEWLINE_KEYWORDS.filter(k => !k.includes(' '));
    singleKeywords.forEach(keyword => {
      const regex = new RegExp(`\\s+(${keyword})\\s+`, 'gi');
      formatted = formatted.replace(regex, '\n$1 ');
    });
    
    // Restore compound keywords with newlines
    Object.keys(placeholders).forEach(placeholder => {
      formatted = formatted.replace(placeholder, '\n' + placeholders[placeholder]);
    });
    
    // Uppercase keywords
    SQL_KEYWORDS.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, keyword);
    });
    
    // Handle parentheses in subqueries
    formatted = formatted.replace(/\(\s*SELECT/gi, '(\n  SELECT');
    formatted = formatted.replace(/\)\s*([A-Z])/g, ')\n$1');
    
    // Indent lines
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indentedLines = lines.map(line => {
      const trimmed = line.trim();
      
      // Decrease indent for closing parenthesis
      if (trimmed.startsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indented = '  '.repeat(indentLevel) + trimmed;
      
      // Increase indent after opening parenthesis
      if (trimmed.includes('(') && !trimmed.includes(')')) {
        indentLevel++;
      }
      
      // Handle WHERE clauses - indent conditions
      if (trimmed.startsWith('WHERE') || trimmed.startsWith('AND') || trimmed.startsWith('OR')) {
        if (trimmed.startsWith('WHERE')) {
          return indented;
        }
        return '  ' + indented;
      }
      
      return indented;
    });
    
    formatted = indentedLines.join('\n');
    
    // Clean up any double newlines
    formatted = formatted.replace(/\n\n+/g, '\n\n');
    
    return { success: true, result: formatted };
  } catch (error) {
    return { success: false, error: `Formatting error: ${error.message}` };
  }
};

export const minifySql = (sql) => {
  if (!sql || !sql.trim()) {
    return { success: true, result: '' };
  }
  
  try {
    // Remove comments
    let minified = sql.replace(/--.*$/gm, '');
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove extra whitespace
    minified = minified.replace(/\s+/g, ' ');
    
    // Remove leading/trailing whitespace
    minified = minified.trim();
    
    return { success: true, result: minified };
  } catch (error) {
    return { success: false, error: `Minification error: ${error.message}` };
  }
};