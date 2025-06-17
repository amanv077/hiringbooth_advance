// Utility function to strip HTML tags from rich text content
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  
  // Replace common HTML tags with appropriate text formatting
  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p>/gi, '')
    .replace(/<\/div>/gi, '\n')
    .replace(/<div>/gi, '')
    .replace(/<strong>/gi, '**')
    .replace(/<\/strong>/gi, '**')
    .replace(/<b>/gi, '**')
    .replace(/<\/b>/gi, '**')
    .replace(/<em>/gi, '*')
    .replace(/<\/em>/gi, '*')
    .replace(/<i>/gi, '*')
    .replace(/<\/i>/gi, '*')
    .replace(/<ul>/gi, '')
    .replace(/<\/ul>/gi, '')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<ol>/gi, '')
    .replace(/<\/ol>/gi, '')
    .replace(/<[^>]*>/gi, '') // Remove any remaining HTML tags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim();
  
  // Clean up multiple newlines
  text = text.replace(/\n\s*\n/g, '\n\n');
  
  return text;
}

// Utility function to convert HTML to JSX safely
export function htmlToText(html: string): string {
  if (!html) return '';
  
  // Create a temporary div element to parse HTML
  if (typeof window !== 'undefined') {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  }
  
  // Fallback for server-side rendering
  return stripHtmlTags(html);
}
