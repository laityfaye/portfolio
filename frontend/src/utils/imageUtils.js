/**
 * URL des assets publics (dossier public/) - respecte base Vite en production (ex: /p/)
 * En contexte navigateur, retourne une URL absolue pour que les images s'affichent
 * correctement sur toutes les routes du dashboard (/p/dashboard, /p/dashboard/projects, etc.)
 */
export const getPublicImageUrl = (path) => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  const p = path.startsWith('/') ? path.slice(1) : path;
  const relative = `${base}${p}`;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return new URL(relative, window.location.origin).href;
  }
  return relative;
};

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
  
  // If it's already a full URL: use as is or rewrite origin if backend returned localhost (production)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    try {
      const imageUrlObj = new URL(imagePath);
      // Si l'API a renvoyé une URL localhost (APP_URL incorrect en prod ou port manquant en dev), réécrire avec baseUrl
      if (imageUrlObj.hostname === 'localhost' || imageUrlObj.hostname === '127.0.0.1') {
        const pathOnly = imageUrlObj.pathname + imageUrlObj.search;
        return `${baseUrl}${pathOnly}`;
      }
      return imagePath;
    } catch (e) {
      return imagePath;
    }
  }
  
  // If it's a path starting with /storage/, convert to full URL
  if (imagePath.startsWith('/storage/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // If it's a public asset (starts with / but not /storage), use public base
  if (imagePath.startsWith('/')) {
    return getPublicImageUrl(imagePath);
  }
  
  // Otherwise, it's a storage path (e.g. "profiles/1/xxx.jpg" or "storage/profiles/1/xxx.jpg")
  const pathWithoutStorage = imagePath.startsWith('storage/') ? imagePath.slice(8) : imagePath.trim();
  const imageUrl = `${baseUrl}/storage/${pathWithoutStorage}`;
  
  // Debug: log the constructed URL in development
  if (import.meta.env.DEV) {
    console.log('Image URL constructed:', imageUrl, 'from path:', imagePath);
  }
  
  return imageUrl;
};

/**
 * Get profile image URL with fallback
 */
export const getProfileImageUrl = (imagePath, fallback = null) => {
  const url = getImageUrl(imagePath);
  return url || fallback || getPublicImageUrl('images/profile.jpeg');
};
