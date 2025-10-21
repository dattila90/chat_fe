import api from './config';

// Types for conversations
export interface Conversation {
  id: number;
  name?: string;
  type: 'private' | 'group';
  participants: Participant[];
  last_message?: Message;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  status?: string;
}

export interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender?: Participant;
  created_at: string;
  updated_at: string;
}

// Backend API response for conversations
interface BackendConversationsResponse {
  success: boolean;
  message: string;
  data: Conversation[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Conversations API functions
export const conversationsAPI = {
  // Get all conversations for the authenticated user
  getConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await api.get<BackendConversationsResponse>('/messages/conversations');
      return response.data.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Failed to fetch conversations',
        errors: error.response?.data?.errors || {},
      } as ApiError;
    }
  },
};

export default conversationsAPI;