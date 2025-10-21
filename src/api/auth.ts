import api from './config';

// Types for authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

// Backend API response wrapper
interface BackendAuthResponse {
  success: boolean;
  message: string;
  data: AuthResponse;
}

// Account response from /account endpoint
export interface UserAccount {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_number: string;
  status_id: number;
  status: {
    id: number;
    short_code: string;
    group: string;
    name: string;
    is_active: boolean;
  };
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface BackendAccountResponse {
  success: boolean;
  data: {
    user: UserAccount;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Authentication API functions
export const authAPI = {
  // Register new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<BackendAuthResponse>('/auth/register', data);
      
      // Extract the nested data
      const authData = response.data.data;
      
      // Store token in localStorage
      if (authData.token) {
        localStorage.setItem('authToken', authData.token);
      }
      
      return authData;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || {},
      } as ApiError;
    }
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<BackendAuthResponse>('/auth/login', data);
      
      // Extract the nested data
      const authData = response.data.data;
      
      // Store token in localStorage
      if (authData.token) {
        localStorage.setItem('authToken', authData.token);
      }
      
      return authData;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Login failed',
        errors: error.response?.data?.errors || {},
      } as ApiError;
    }
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem('authToken');
  },

  // Get current user token
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Fetch current user account data
  fetchAccount: async (): Promise<UserAccount> => {
    try {
      const response = await api.get<BackendAccountResponse>('/account');
      return response.data.data.user;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Failed to fetch account data',
        errors: error.response?.data?.errors || {},
      } as ApiError;
    }
  },
};

export default authAPI;