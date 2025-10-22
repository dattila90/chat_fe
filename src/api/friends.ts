import axios from 'axios';

// Configure axios base URL
const API_BASE_URL = 'http://localhost:8000/api';
axios.defaults.baseURL = API_BASE_URL;

// Add request interceptor to include auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Friend {
  id: number;
  user_id: number;
  friend_id: number;
  status: 'accepted' | 'pending' | 'blocked';
  created_at: string;
  updated_at: string;
  friend: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface FriendRequest {
  id: number;
  sender_id: number;
  receiver_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  sender: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  receiver?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface SendFriendRequestData {
  receiver_email: string;
}

export interface FriendRequestResponse {
  id: number;
  sender_id: number;
  receiver_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export const friendsAPI = {
  // Get current user's friends
  getFriends: async (): Promise<Friend[]> => {
    try {
      const response = await axios.get('/friends');
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Get friends error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch friends');
    }
  },

  // Get pending friend requests from /friends/pending
  getPendingFriendRequests: async (): Promise<FriendRequest[]> => {
    try {
      const response = await axios.get('/friends/pending');
      console.log('Friends pending API response:', response.data);
      const result = response.data.data || response.data;
      console.log('Processed result:', result, 'Type:', typeof result, 'IsArray:', Array.isArray(result));
      
      // Ensure we always return an array
      return Array.isArray(result) ? result : [];
    } catch (error: any) {
      console.error('Get pending friend requests error:', error);
      
      // If the endpoint doesn't exist (404), return empty array as fallback
      if (error.response?.status === 404) {
        console.warn('Friends pending endpoint not found, returning empty array');
        return [];
      }
      
      throw new Error(error.response?.data?.message || `Failed to fetch pending friend requests (${error.response?.status || 'Network Error'})`);
    }
  },

  // Send friend request
  sendFriendRequest: async (data: SendFriendRequestData): Promise<FriendRequestResponse> => {
    try {
      const response = await axios.post('/friend-requests', data);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Send friend request error:', error);
      throw new Error(error.response?.data?.message || 'Failed to send friend request');
    }
  },

  // Accept friend request
  acceptFriendRequest: async (requestId: number): Promise<void> => {
    try {
      await axios.put(`/friend-requests/${requestId}/accept`);
    } catch (error: any) {
      console.error('Accept friend request error:', error);
      throw new Error(error.response?.data?.message || 'Failed to accept friend request');
    }
  },

  // Reject friend request
  rejectFriendRequest: async (requestId: number): Promise<void> => {
    try {
      await axios.put(`/friend-requests/${requestId}/reject`);
    } catch (error: any) {
      console.error('Reject friend request error:', error);
      throw new Error(error.response?.data?.message || 'Failed to reject friend request');
    }
  },

  // Remove friend
  removeFriend: async (friendId: number): Promise<void> => {
    try {
      await axios.delete(`/friends/${friendId}`);
    } catch (error: any) {
      console.error('Remove friend error:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove friend');
    }
  },

  // Search users by email or name
  searchUsers: async (query: string): Promise<any[]> => {
    try {
      const response = await axios.get(`/users/search?q=${encodeURIComponent(query)}`);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Search users error:', error);
      throw new Error(error.response?.data?.message || 'Failed to search users');
    }
  },

  // Search active users for friend requests
  searchActiveUsers: async (searchTerm: string): Promise<any[]> => {
    try {
      const response = await axios.get(`/friends/search?query=${encodeURIComponent(searchTerm)}`);
      console.log('Active users search response:', response.data);
      
      // Handle nested response structure: {success: true, data: {users: [...]}}
      const data = response.data.data || response.data;
      const users = data.users || data;
      
      return Array.isArray(users) ? users : [];
    } catch (error: any) {
      console.error('Search active users error:', error);
      throw new Error(error.response?.data?.message || 'Failed to search active users');
    }
  }
};