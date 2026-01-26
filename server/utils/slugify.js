
// Simple Arabic to Latin transliteration map for common characters
// This is not exhaustive but handles major characters to produce readable slugs
const arabicToLatin = {
  'ا': 'a', 'أ': 'a', 'إ': 'e', 'آ': 'a', 'ء': 'a',
  'ب': 'b', 'ت': 't', 'ث': 'th',
  'ج': 'j', 'ح': 'h', 'خ': 'kh',
  'د': 'd', 'ذ': 'th',
  'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'sh',
  'ص': 's', 'ض': 'd',
  'ط': 't', 'ظ': 'z',
  'ع': 'a', 'غ': 'gh',
  'ف': 'f', 'ق': 'q',
  'ك': 'k', 'ل': 'l',
  'م': 'm', 'ن': 'n',
  'ه': 'h', 'ة': 'a',
  'و': 'w', 'ي': 'y', 'ى': 'a',
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
};

export function slugify(text) {
  if (!text) return '';
  
  // 1. Transliterate Arabic to Latin
  let processed = text.split('').map(char => arabicToLatin[char] || char).join('');
  
  // 2. Convert to lowercase
  processed = processed.toLowerCase();
  
  // 3. Replace spaces and non-alphanumeric chars with dashes
  // Keep English letters, numbers, and dashes
  processed = processed.replace(/[^a-z0-9]+/g, '-');
  
  // 4. Remove leading/trailing dashes
  processed = processed.replace(/^-+|-+$/g, '');
  
  return processed || 'upload-' + Date.now();
}
