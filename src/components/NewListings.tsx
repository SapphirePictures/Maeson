
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Loader2 } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { propertyAPI } from '../lib/api/properties';

export function NewListings() {
  const { data, isLoading } = useQuery({
    queryKey: ['properties', 'new'],
    queryFn: () => propertyAPI.getProperties({ limit: 4, sort: 'newest' }),
  });

  const properties = data?.data || [];

  // Format price for display
  const formatPrice = (price: number, listingType: string) => {
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
    
    return listingType === 'rent' ? `${formatted}/yr` : formatted;
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">New Listings</h2>
            <p className="mt-2 text-slate-600">Fresh properties just added to our portfolio</p>
          </div>
          <Link to="/properties" className="hidden md:flex items-center gap-2 font-semibold text-[#0F4C5C] hover:text-[#0a3641]">
            See All Listings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#0F4C5C]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard 
                key={property._id} 
                property={{
                  id: property._id,
                  title: property.title,
                  location: `${property.address.city}, ${property.address.state}`,
                  price: formatPrice(property.price, property.listingType),
                  type: property.listingType === 'sale' ? 'buy' : 'rent',
                  bedrooms: property.bedrooms || 0,
                  bathrooms: property.bathrooms || 0,
                  area: property.squareFeet ? `${property.squareFeet} sqft` : '',
                  image: property.images[0]?.url || '',
                  images: property.images.map(img => img.url),
                  isNew: true,
                }} 
              />
            ))}
          </div>
        )}
        
        <div className="mt-4 flex justify-center md:hidden">
             <Link to="/properties" className="flex items-center gap-2 font-semibold text-[#0F4C5C]">
            See All Listings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
