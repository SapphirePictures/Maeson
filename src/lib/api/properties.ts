import { supabase } from '../supabaseClient';

export interface Property {
  id: string;
  title: string;
  description: string | null;
  price: number;
  property_type: string;
  listing_type: 'sale' | 'rent' | 'lease';
  status: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  square_feet?: number | null;
  lot_size?: number | null;
  year_built?: number | null;
  features?: string[] | null;
  amenities?: string[] | null;
  images: string[];
  virtual_tour?: string | null;
  agent_id?: string | null;
  views: number | null;
  parking?: string | null;
  heating?: string | null;
  cooling?: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
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
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('is_published', true);

    if (filters?.listingType) {
      query = query.eq('listing_type', filters.listingType);
    }

    if (filters?.propertyType) {
      query = query.eq('property_type', filters.propertyType);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    if (filters?.state) {
      query = query.ilike('state', `%${filters.state}%`);
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters?.bedrooms !== undefined) {
      query = query.gte('bedrooms', filters.bedrooms);
    }

    if (filters?.bathrooms !== undefined) {
      query = query.gte('bathrooms', filters.bathrooms);
    }

    if (filters?.search) {
      const search = filters.search;
      query = query.or(
        `title.ilike.%${search}%,city.ilike.%${search}%,state.ilike.%${search}%`
      );
    }

    if (filters?.sort) {
      if (filters.sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (filters.sort === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else {
        const [column, direction] = filters.sort.split(':');
        query = query.order(column, { ascending: direction !== 'desc' });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw error;
    }

    const total = count || 0;
    const pages = Math.max(1, Math.ceil(total / limit));

    return {
      status: 'success',
      count: data?.length || 0,
      total,
      page,
      pages,
      data: data || [],
    };
  },

  // Get single property
  getProperty: async (id: string): Promise<Property> => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw error || new Error('Property not found');
    }

    return data;
  },

  // Get featured properties
  getFeaturedProperties: async (): Promise<Property[]> => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('is_featured', true)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  // Create property (requires auth)
  createProperty: async (data: Partial<Property>): Promise<Property> => {
    const { data: created, error } = await supabase
      .from('properties')
      .insert(data)
      .select('*')
      .single();

    if (error || !created) {
      throw error || new Error('Failed to create property');
    }

    return created;
  },

  // Update property (requires auth)
  updateProperty: async (id: string, data: Partial<Property>): Promise<Property> => {
    const { data: updated, error } = await supabase
      .from('properties')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !updated) {
      throw error || new Error('Failed to update property');
    }

    return updated;
  },

  // Delete property (requires auth)
  deleteProperty: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  // Upload property images (requires auth)
  uploadImages: async (id: string, images: File[]): Promise<Property> => {
    const imageUrls = images.map((file) => URL.createObjectURL(file));

    const { data: updated, error } = await supabase
      .from('properties')
      .update({ images: imageUrls })
      .eq('id', id)
      .select('*')
      .single();

    if (error || !updated) {
      throw error || new Error('Failed to upload images');
    }

    return updated;
  },
};
