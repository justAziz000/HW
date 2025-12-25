// Link validation utilities for homework submissions

export const isValidHomeworkLink = (link) => {
  if (!link || typeof link !== 'string') return false;
  
  const trimmedLink = link.trim().toLowerCase();
  
  // Check if link starts with GitHub or Vercel URLs
  const validDomains = [
    'github.com',
    'vercel.com',
    'vercel.app',
    'netlify.com',
    'netlify.app'
  ];
  
  return validDomains.some(domain => {
    try {
      const url = new URL(trimmedLink.startsWith('http') ? trimmedLink : `https://${trimmedLink}`);
      return url.hostname.includes(domain);
    } catch {
      return false;
    }
  });
};

export const getValidationError = (link) => {
  if (!link || link.trim() === '') {
    return 'Link talab qilinadi';
  }
  
  const trimmedLink = link.trim().toLowerCase();
  
  try {
    // Try to parse as URL
    const urlToCheck = trimmedLink.startsWith('http') ? trimmedLink : `https://${trimmedLink}`;
    new URL(urlToCheck);
    
    // If valid URL, check domain
    if (!isValidHomeworkLink(link)) {
      return 'Faqat GitHub, Vercel yoki Netlify dan linkni qoʻyish mumkin';
    }
  } catch {
    return 'Notoʻgʻri URL formati. https:// bilan boshlang';
  }
  
  return null;
};

export const getValidationWarning = (link) => {
  const error = getValidationError(link);
  if (error) return error;
  
  const warnings = [];
  
  // Warn if using netlify but not vercel/github as primary
  if (link.includes('netlify') && !link.includes('github') && !link.includes('vercel')) {
    warnings.push('💡 Netlify qabul qilinadi, lekin GitHub/Vercel tavsiya qilinadi');
  }
  
  return warnings.length > 0 ? warnings[0] : null;
};
