// API Client for secure communication with backend
class SecureAPI {
  constructor() {
    this.baseURL = '/api';
    this.token = null;
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }


  // Get headers (with auth if token exists)
  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }
    return headers;
  }

  // Handle API errors (no session logic)
  async handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  }

  // Check if user is admin
  isAdmin() {
    return this.user.role === 'admin';
  }

  // Check if user is regular user
  isUser() {
    return this.user.role === 'user';
  }


  // No logout needed
  async logout() {
    // Clear local/session storage and redirect to login
    if (typeof localStorage !== 'undefined') localStorage.clear();
    if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
    // Optionally clear cookies here if used for auth
    window.location.href = '/login.html';
  }

  // Get all data
  async getData(type = null, startDate = null, endDate = null) {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await fetch(
      `${this.baseURL}/data?${params.toString()}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  // Get single record
  async getRecord(id) {
    const response = await fetch(
      `${this.baseURL}/data/${id}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response);
  }

  // Create record
  async createRecord(data) {
    const response = await fetch(`${this.baseURL}/data`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  // Update record
  async updateRecord(id, data) {
    const response = await fetch(`${this.baseURL}/data/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  // Delete record
  async deleteRecord(id) {
    const response = await fetch(`${this.baseURL}/data/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }


  // No user info or password change needed
}

// Initialize API client
const api = new SecureAPI();

// Check authentication on page load
// if (!api.isAuthenticated()) {
//   window.location.href = '/';
// }
