import axiosInstance from '../axios';

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  propertyType: string;
  listingType: 'sale' | 'rent' | 'lease';
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  lotSize?: number;
  yearBuilt?: number;
  features?: string[];
  amenities?: string[];
  images: Array<{
    url: string;
    publicId?: string;
    caption?: string;
  }>;
  virtualTour?: string;
  owner: any;
  agent?: any;
  views: number;
  parking?: string;
  heating?: string;
  cooling?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  propertyType?: string;
  listingType?: string;
  status?: string;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PropertyResponse {
  status: string;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Property[];
}

// Property APIs
export const propertyAPI = {
  // Get all properties with filters
  getProperties: async (filters?: PropertyFilters): Promise<PropertyResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await axiosInstance.get(`/properties?${params.toString()}`);
    return response.data;
  },

  // Get single property
  getProperty: async (id: string): Promise<Property> => {
    const response = await axiosInstance.get(`/properties/${id}`);
    return response.data.data;
  },

  // Get featured properties
  getFeaturedProperties: async (): Promise<Property[]> => {
    const response = await axiosInstance.get('/properties/featured');
    return response.data.data;
  },

  // Create property (requires auth)
  createProperty: async (data: Partial<Property>): Promise<Property> => {
    const response = await axiosInstance.post('/properties', data);
    return response.data.data;
  },

  // Update property (requires auth)
  updateProperty: async (id: string, data: Partial<Property>): Promise<Property> => {
    const response = await axiosInstance.put(`/properties/${id}`, data);
    return response.data.data;
  },

  // Delete property (requires auth)
  deleteProperty: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/properties/${id}`);
  },

  // Upload property images (requires auth)
  uploadImages: async (id: string, images: File[]): Promise<Property> => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await axiosInstance.post(`/properties/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
