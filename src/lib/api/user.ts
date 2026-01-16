import { supabase } from '../supabaseClient';

export interface Favorite {
  _id: string;
  user: string;
  property: any;
  notes?: string;
  createdAt: string;
}

export interface Inquiry {
  _id: string;
  property: any;
  sender: any;
  recipient: any;
  name: string;
  email: string;
  phone?: string;
  message: string;
  inquiryType: string;
  preferredContactMethod: string;
  status: string;
  response?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  property: any;
  user: any;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

const getCurrentUserId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw error || new Error('Not authenticated');
  }
  return data.user.id;
};

// Favorites API
export const favoritesAPI = {
  // Get user's favorites
  getFavorites: async (): Promise<Favorite[]> => {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('favorites')
      .select('id, notes, created_at, property:properties(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map((favorite: any) => ({
      _id: favorite.id,
      user: userId,
      property: favorite.property,
      notes: favorite.notes || undefined,
      createdAt: favorite.created_at,
    }));
  },

  // Add to favorites
  addFavorite: async (propertyId: string, notes?: string): Promise<Favorite> => {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        property_id: propertyId,
        notes: notes || null,
      })
      .select('id, notes, created_at, property:properties(*)')
      .single();

    if (error || !data) {
      throw error || new Error('Failed to add favorite');
    }

    return {
      _id: data.id,
      user: userId,
      property: data.property,
      notes: data.notes || undefined,
      createdAt: data.created_at,
    };
  },

  // Remove from favorites
  removeFavorite: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  // Update favorite notes
  updateFavorite: async (id: string, notes: string): Promise<Favorite> => {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('favorites')
      .update({ notes })
      .eq('id', id)
      .select('id, notes, created_at, property:properties(*)')
      .single();

    if (error || !data) {
      throw error || new Error('Failed to update favorite');
    }

    return {
      _id: data.id,
      user: userId,
      property: data.property,
      notes: data.notes || undefined,
      createdAt: data.created_at,
    };
  },

  // Check if property is favorited
  checkFavorite: async (propertyId: string): Promise<boolean> => {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .limit(1);

    if (error) {
      throw error;
    }

    return (data || []).length > 0;
  },
};

// Inquiries API
export const inquiriesAPI = {
  // Create inquiry
  createInquiry: async (data: {
    property: string;
    message: string;
    inquiryType?: string;
    preferredContactMethod?: string;
    name?: string;
    email?: string;
    phone?: string;
  }): Promise<Inquiry> => {
    const userId = await getCurrentUserId();
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, agent_id')
      .eq('id', data.property)
      .single();

    if (propertyError || !property) {
      throw propertyError || new Error('Property not found');
    }

    const { data: created, error } = await supabase
      .from('inquiries')
      .insert({
        property_id: data.property,
        sender_id: userId,
        recipient_id: property.agent_id,
        name: data.name || null,
        email: data.email || null,
        phone: data.phone || null,
        message: data.message,
        inquiry_type: data.inquiryType || 'general',
        preferred_contact_method: data.preferredContactMethod || 'email',
        status: 'new',
      })
      .select('id, name, email, phone, message, inquiry_type, preferred_contact_method, status, response, responded_at, created_at, property:properties(*), recipient:profiles!inquiries_recipient_id_fkey(id, first_name, last_name, email)')
      .single();

    if (error || !created) {
      throw error || new Error('Failed to create inquiry');
    }

    return {
      _id: created.id,
      property: created.property,
      sender: { id: userId },
      recipient: created.recipient,
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || undefined,
      message: created.message,
      inquiryType: created.inquiry_type,
      preferredContactMethod: created.preferred_contact_method,
      status: created.status,
      response: created.response || undefined,
      respondedAt: created.responded_at || undefined,
      createdAt: created.created_at,
    };
  },

  // Get sent inquiries
  getSentInquiries: async (): Promise<Inquiry[]> => {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('inquiries')
      .select('id, name, email, phone, message, inquiry_type, preferred_contact_method, status, response, responded_at, created_at, property:properties(*), recipient:profiles!inquiries_recipient_id_fkey(id, first_name, last_name, email)')
      .eq('sender_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map((inquiry: any) => ({
      _id: inquiry.id,
      property: inquiry.property,
      sender: { id: userId },
      recipient: inquiry.recipient,
      name: inquiry.name || '',
      email: inquiry.email || '',
      phone: inquiry.phone || undefined,
      message: inquiry.message,
      inquiryType: inquiry.inquiry_type,
      preferredContactMethod: inquiry.preferred_contact_method,
      status: inquiry.status,
      response: inquiry.response || undefined,
      respondedAt: inquiry.responded_at || undefined,
      createdAt: inquiry.created_at,
    }));
  },

  // Get received inquiries
  getReceivedInquiries: async (): Promise<Inquiry[]> => {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('inquiries')
      .select('id, name, email, phone, message, inquiry_type, preferred_contact_method, status, response, responded_at, created_at, property:properties(*), sender:profiles!inquiries_sender_id_fkey(id, first_name, last_name, email)')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map((inquiry: any) => ({
      _id: inquiry.id,
      property: inquiry.property,
      sender: inquiry.sender,
      recipient: { id: userId },
      name: inquiry.name || '',
      email: inquiry.email || '',
      phone: inquiry.phone || undefined,
      message: inquiry.message,
      inquiryType: inquiry.inquiry_type,
      preferredContactMethod: inquiry.preferred_contact_method,
      status: inquiry.status,
      response: inquiry.response || undefined,
      respondedAt: inquiry.responded_at || undefined,
      createdAt: inquiry.created_at,
    }));
  },

  // Update inquiry status
  updateInquiryStatus: async (
    id: string,
    status: string,
    response?: string
  ): Promise<Inquiry> => {
    const { data, error } = await supabase
      .from('inquiries')
      .update({
        status,
        response: response || null,
        responded_at: response ? new Date().toISOString() : null,
      })
      .eq('id', id)
      .select('id, name, email, phone, message, inquiry_type, preferred_contact_method, status, response, responded_at, created_at, property:properties(*), recipient:profiles!inquiries_recipient_id_fkey(id, first_name, last_name, email)')
      .single();

    if (error || !data) {
      throw error || new Error('Failed to update inquiry');
    }

    return {
      _id: data.id,
      property: data.property,
      sender: data.sender || null,
      recipient: data.recipient,
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || undefined,
      message: data.message,
      inquiryType: data.inquiry_type,
      preferredContactMethod: data.preferred_contact_method,
      status: data.status,
      response: data.response || undefined,
      respondedAt: data.responded_at || undefined,
      createdAt: data.created_at,
    };
  },

  // Delete inquiry
  deleteInquiry: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },
};

// Reviews API
export const reviewsAPI = {
  // Get property reviews
  getPropertyReviews: async (propertyId: string): Promise<{
    reviews: Review[];
    averageRating: number;
    count: number;
  }> => {
    const response = await axiosInstance.get(`/reviews/property/${propertyId}`);
    return {
      reviews: response.data.data,
      averageRating: parseFloat(response.data.averageRating),
      count: response.data.count,
    };
  },

  // Create review
  createReview: async (data: {
    property: string;
    rating: number;
    title: string;
    comment: string;
  }): Promise<Review> => {
    const response = await axiosInstance.post('/reviews', data);
    return response.data.data;
  },

  // Get user's reviews
  getUserReviews: async (): Promise<Review[]> => {
    const response = await axiosInstance.get('/reviews/user');
    return response.data.data;
  },

  // Update review
  updateReview: async (
    id: string,
    data: { rating: number; title: string; comment: string }
  ): Promise<Review> => {
    const response = await axiosInstance.put(`/reviews/${id}`, data);
    return response.data.data;
  },

  // Delete review
  deleteReview: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/reviews/${id}`);
  },
};
