const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/api';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle ApiResponse wrapper format { success, message, data }
    if (data && typeof data === 'object' && 'data' in data && data.data !== undefined) {
      return data.data;
    }
    
    // Handle direct array/object responses
    if (Array.isArray(data) || (typeof data === 'object' && data !== null && !('success' in data))) {
      return data;
    }
    
    // Return the data as-is if it's the response itself
    return data;
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ username, password }),
    });
    return this.handleResponse(response);
  }

  async register(userData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async getProfile(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  // Stall endpoints
  async getAllStalls(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/stalls`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<any[]>(response);
  }

  async getStallById(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/stalls/${id}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async createStall(stallData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/stalls`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(stallData),
    });
    return this.handleResponse(response);
  }

  async updateStall(id: number, stallData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/stalls/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(stallData),
    });
    return this.handleResponse(response);
  }

  async deleteStall(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/stalls/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    if (!response.ok) {
      throw new Error('Failed to delete stall');
    }
  }

  async getAvailableStalls(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/stalls/available`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<any[]>(response);
  }

  // Reservation endpoints
  async getAllReservations(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<any[]>(response);
  }

  async getReservationById(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async confirmReservation(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}/confirm`, {
      method: 'PUT',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async cancelReservation(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}/cancel`, {
      method: 'PUT',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  // Genre endpoints
  async getAllGenres(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/genres`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<any[]>(response);
  }

  async createGenre(genreData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/genres`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(genreData),
    });
    return this.handleResponse(response);
  }

  async updateGenre(id: number, genreData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/genres/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(genreData),
    });
    return this.handleResponse(response);
  }

  async deleteGenre(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/genres/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    if (!response.ok) {
      throw new Error('Failed to delete genre');
    }
  }

  // User endpoints (for vendor management)
  // Note: There's no "get all users" endpoint, so we'll need to work around this
  // For now, we'll create a method that can fetch users by ID if needed
  async getUserById(userId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();

