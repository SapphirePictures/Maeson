import { supabase } from '../supabaseClient';

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

const mapProfileToUser = (profile: any): User => ({
  id: profile.id,
  firstName: profile.first_name,
  lastName: profile.last_name,
  email: profile.email,
  phone: profile.phone || undefined,
  role: profile.role || 'buyer',
  avatar: profile.avatar_url || undefined,
});

const getProfileById = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Authentication APIs
export const authAPI = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.session || !data.user) {
      throw error || new Error('Login failed');
    }

    const profile = await getProfileById(data.user.id);

    return {
      status: 'success',
      message: 'Login successful',
      token: data.session.access_token,
      user: mapProfileToUser(profile),
    };
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error || !authData.user) {
      throw error || new Error('Registration failed');
    }

    const profilePayload = {
      id: authData.user.id,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone || null,
      role: data.role || 'buyer',
    };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert(profilePayload)
      .select('*')
      .single();

    if (profileError || !profile) {
      throw profileError || new Error('Profile creation failed');
    }

    return {
      status: 'success',
      message: 'Registration successful',
      token: authData.session?.access_token || '',
      user: mapProfileToUser(profile),
    };
  },

  // Get current user
  getMe: async (): Promise<User> => {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      throw error || new Error('Not authenticated');
    }

    const profile = await getProfileById(data.user.id);
    return mapProfileToUser(profile);
  },

  // Update user details
  updateDetails: async (data: Partial<User>): Promise<User> => {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      throw authError || new Error('Not authenticated');
    }

    const updates: any = {};
    if (data.firstName !== undefined) updates.first_name = data.firstName;
    if (data.lastName !== undefined) updates.last_name = data.lastName;
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.role !== undefined) updates.role = data.role;
    if (data.avatar !== undefined) updates.avatar_url = data.avatar;

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', authData.user.id)
      .select('*')
      .single();

    if (error || !profile) {
      throw error || new Error('Update failed');
    }

    return mapProfileToUser(profile);
  },

  // Update password
  updatePassword: async (currentPassword: string, newPassword: string) => {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      throw authError || new Error('Not authenticated');
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    return { status: 'success', message: 'Password updated' };
  },
  // Logout
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },
};
