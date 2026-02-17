/**
 * API Configuration for Almeyo Frontend
 * All API requests are proxied through nginx to the backend
 */
const API_CONFIG = {
  // Base URLs (proxied through nginx)
  BASE_URL: '/api',
  IMAGE_URL: '/images',
  
  // API Endpoints
  ENDPOINTS: {
    // Menu
    MENU: '/menu',
    MENU_ITEMS: '/menu/items',
    MENU_ITEM: (id) => `/menu/items/${id}`,
    MENU_CATEGORIES: '/menu/categories',
    
    // Orders
    ORDERS: '/orders',
    ORDER_BY_ID: (id) => `/orders/${id}`,
    
    // Reservations
    RESERVATIONS: '/reservations',
    RESERVATION_BY_ID: (id) => `/reservations/${id}`,
    
    // Health
    HEALTH: '/health',
  }
};

/**
 * Build full API URL
 * @param {string} endpoint - Endpoint path
 * @returns {string} Full URL
 */
API_CONFIG.url = function(endpoint) {
  return this.BASE_URL + endpoint;
};

/**
 * Build image URL
 * @param {string} path - Image path (e.g., 'menu/dish.jpg')
 * @returns {string} Full image URL
 */
API_CONFIG.imageUrl = function(path) {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return this.IMAGE_URL + '/' + cleanPath;
};

/**
 * Make a fetch request with default options
 * @param {string} url - Request URL
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
API_CONFIG.fetch = async function(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for CORS
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  return response;
};

/**
 * GET request helper
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>}
 */
API_CONFIG.get = async function(endpoint) {
  const response = await this.fetch(this.url(endpoint));
  return response.json();
};

/**
 * POST request helper
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body
 * @returns {Promise<any>}
 */
API_CONFIG.post = async function(endpoint, data) {
  const response = await this.fetch(this.url(endpoint), {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
};

/**
 * PUT request helper
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body
 * @returns {Promise<any>}
 */
API_CONFIG.put = async function(endpoint, data) {
  const response = await this.fetch(this.url(endpoint), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
};

/**
 * DELETE request helper
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>}
 */
API_CONFIG.delete = async function(endpoint) {
  const response = await this.fetch(this.url(endpoint), {
    method: 'DELETE',
  });
  return response.json();
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG;
}
