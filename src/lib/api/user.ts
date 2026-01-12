import axiosInstance from '../axios';

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

// Favorites API
export const favoritesAPI = {
  // Get user's favorites
  getFavorites: async (): Promise<Favorite[]> => {
    const response = await axiosInstance.get('/favorites');
    return response.data.data;
  },

  // Add to favorites
  addFavorite: async (propertyId: string, notes?: string): Promise<Favorite> => {
    const response = await axiosInstance.post('/favorites', {
      property: propertyId,
      notes,
    });
    return response.data.data;
  },

  // Remove from favorites
  removeFavorite: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/favorites/${id}`);
  },

  // Update favorite notes
  updateFavorite: async (id: string, notes: string): Promise<Favorite> => {
    const response = await axiosInstance.put(`/favorites/${id}`, { notes });
    return response.data.data;
  },

  // Check if property is favorited
  checkFavorite: async (propertyId: string): Promise<boolean> => {
    const response = await axiosInstance.get(`/favorites/check/${propertyId}`);
    return response.data.isFavorite;
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
    const response = await axiosInstance.post('/inquiries', data);
    return response.data.data;
  },

  // Get sent inquiries
  getSentInquiries: async (): Promise<Inquiry[]> => {
    const response = await axiosInstance.get('/inquiries/sent');
    return response.data.data;
  },

  // Get received inquiries
  getReceivedInquiries: async (): Promise<Inquiry[]> => {
    const response = await axiosInstance.get('/inquiries/received');
    return response.data.data;
  },

  // Update inquiry status
  updateInquiryStatus: async (
    id: string,
    status: string,
    response?: string
  ): Promise<Inquiry> => {
    const res = await axiosInstance.put(`/inquiries/${id}/status`, {
      status,
      response,
    });
    return res.data.data;
  },

  // Delete inquiry
  deleteInquiry: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/inquiries/${id}`);
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
