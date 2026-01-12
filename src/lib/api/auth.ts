import axiosInstance from '../axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'buyer' | 'seller' | 'agent';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  token: string;
  user: User;
}

// Authentication APIs
export const authAPI = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  // Get current user
  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get('/auth/me');
    return response.data.data;
  },

  // Update user details
  updateDetails: async (data: Partial<User>): Promise<User> => {
    const response = await axiosInstance.put('/auth/updatedetails', data);
    return response.data.data;
  },

  // Update password
  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await axiosInstance.put('/auth/updatepassword', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
