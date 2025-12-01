// API client for self-hosted backend
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || 'http://localhost:3001/api';
  }
  
  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${error.message}`);
      throw error;
    }
  }
  
  // Authentication methods
  async telegramAuth(initData) {
    return this.request('/auth/telegram', {
      method: 'POST',
      body: JSON.stringify({ initData })
    });
  }
  
  // Track methods
  async getTracks() {
    return this.request('/tracks');
  }
  
  async getTrack(id) {
    return this.request(`/tracks/${id}`);
  }
  
  async incrementPlayCount(id) {
    return this.request(`/tracks/${id}/play`, {
      method: 'POST'
    });
  }
}

// Create and export singleton instance
const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL);

export default apiClient;