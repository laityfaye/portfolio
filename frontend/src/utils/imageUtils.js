/**
 * Helper function to construct image URLs
 * Handles different image path formats:
 * - Full URLs (http/https) - fixes port if needed
 * - Public assets (starting with /) - converts to full URL
 * - Storage paths - prepends API storage URL
 * 
 * Note: Laravel resources return full URLs via Storage::disk('public')->url()
 * but they might be missing the port number
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Get API base URL to extract port and domain
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  
  // Extract port and domain from API URL
  let apiUrl = API_BASE_URL;
  if (apiUrl.endsWith('/api')) {
    apiUrl = apiUrl.slice(0, -4);
  } else if (apiUrl.endsWith('/api/')) {
    apiUrl = apiUrl.slice(0, -5);
  }
  apiUrl = apiUrl.replace(/\/$/, '');
  
  // Parse the API URL to get protocol, hostname, and port
  const urlObj = new URL(apiUrl);
  const protocol = urlObj.protocol; // http: or https:
  const hostname = urlObj.hostname; // localhost
  const port = urlObj.port || (protocol === 'https:' ? '443' : '8000'); // Default port
  
  const baseUrl = `${protocol}//${hostname}${port && port !== '443' && port !== '80' ? `:${port}` : ''}`;
  
  // If it's already a full URL, fix the port if needed
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    try {
      const imageUrlObj = new URL(imagePath);
      // If the URL is localhost without port or with wrong port, fix it
      if (imageUrlObj.hostname === 'localhost' && (!imageUrlObj.port || imageUrlObj.port !== port)) {
        imageUrlObj.port = port;
        return imageUrlObj.toString();
      }
      return imagePath; // Return as is if port is correct or not localhost
    } catch (e) {
      // If URL parsing fails, return as is
      return imagePath;
    }
  }
  
  // If it's a path starting with /storage/, convert to full URL
  if (imagePath.startsWith('/storage/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // If it's a public asset (starts with / but not /storage), return as is
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Otherwise, it's a storage path - prepend the storage URL
  const imageUrl = `${baseUrl}/storage/${imagePath}`;
  
  // Debug: log the constructed URL in development
  if (import.meta.env.DEV) {
    console.log('Image URL constructed:', imageUrl, 'from path:', imagePath);
  }
  
  return imageUrl;
};

/**
 * Get profile image URL with fallback
 */
export const getProfileImageUrl = (imagePath, fallback = '/images/profile.jpeg') => {
  const url = getImageUrl(imagePath);
  return url || fallback;
};
