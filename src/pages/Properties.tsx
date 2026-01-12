import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PropertyCard } from '../components/PropertyCard';
import { propertyAPI, PropertyFilters } from '../lib/api/properties';
import { Button } from '../components/ui/button';
import { Search, Filter, ArrowLeft, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '../components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function Properties() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationParam = searchParams.get('location');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState(locationParam || '');
  const [page, setPage] = useState(1);
  
  // Advanced filters state
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');

  // Update searchTerm when URL parameter changes
  useEffect(() => {
    if (locationParam) {
      setSearchTerm(locationParam);
    }
  }, [locationParam]);

  // Build API filters
  const apiFilters: PropertyFilters = {
    page,
    limit: 12,
  };

  if (filter === 'buy') apiFilters.listingType = 'sale';
  if (filter === 'rent') apiFilters.listingType = 'rent';
  if (searchTerm) apiFilters.search = searchTerm;
  if (priceRange.min) apiFilters.minPrice = parseInt(priceRange.min);
  if (priceRange.max) apiFilters.maxPrice = parseInt(priceRange.max);
  if (bedrooms !== 'any') apiFilters.bedrooms = parseInt(bedrooms);
  if (bathrooms !== 'any') apiFilters.bathrooms = parseInt(bathrooms);

  // Fetch properties from API
  const { data, isLoading, isError } = useQuery({
    queryKey: ['properties', apiFilters],
    queryFn: () => propertyAPI.getProperties(apiFilters),
  });

  const properties = data?.data || [];
  const totalPages = data?.pages || 1;

  const clearFilters = () => {
    setSearchTerm(''); 
    setFilter('all');
    setPriceRange({ min: '', max: '' });
    setBedrooms('any');
    setBathrooms('any');
    setPage(1);
    window.history.pushState({}, '', '/properties');
  };

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
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 pl-0 hover:bg-transparent hover:text-[#0F4C5C] text-slate-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0F4C5C] mb-2 font-heading">
              {locationParam ? `Properties in ${locationParam}` : 'Our Properties'}
            </h1>
            <p className="text-slate-600 max-w-xl">
              {locationParam 
                ? `Explore our available real estate listings in ${locationParam}.` 
                : 'Discover our exclusive selection of properties across Nigeria. From luxury apartments in Lagos to serenity in Abuja.'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search location, price..." 
                className="pl-9 bg-white" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 border-slate-300">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Properties</SheetTitle>
                  <SheetDescription>
                    Narrow down your search results.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 px-4 py-6">
                  {/* Price Range */}
                  <div className="space-y-2">
                    <Label>Price Range (₦)</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        placeholder="Min" 
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      />
                      <span className="text-slate-400">-</span>
                      <Input 
                        type="number" 
                        placeholder="Max" 
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div className="space-y-2">
                    <Label>Min Bedrooms</Label>
                    <Select value={bedrooms} onValueChange={setBedrooms}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bathrooms */}
                  <div className="space-y-2">
                    <Label>Min Bathrooms</Label>
                    <Select value={bathrooms} onValueChange={setBathrooms}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit" className="bg-[#0F4C5C] hover:bg-[#0a3844] w-full">Apply Filters</Button>
                  </SheetClose>
                  <Button variant="ghost" onClick={clearFilters} className="w-full mt-2">
                    Reset All
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            className={filter === 'all' ? "bg-[#0F4C5C] hover:bg-[#0a3844] rounded-full px-6" : "rounded-full px-6 whitespace-nowrap"}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'buy' ? 'default' : 'outline'} 
            className={filter === 'buy' ? "bg-[#0F4C5C] hover:bg-[#0a3844] rounded-full px-6" : "rounded-full px-6 whitespace-nowrap"}
            onClick={() => setFilter('buy')}
          >
            For Sale
          </Button>
          <Button 
             variant={filter === 'rent' ? 'default' : 'outline'} 
             className={filter === 'rent' ? "bg-[#0F4C5C] hover:bg-[#0a3844] rounded-full px-6" : "rounded-full px-6 whitespace-nowrap"}
             onClick={() => setFilter('rent')}
          >
            For Rent
          </Button>
        </div>
      </div>

      {/* Property Grid */}
      <div>
        {isLoading ? (
          <div className="text-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[#0F4C5C] mx-auto mb-4" />
            <p className="text-slate-600">Loading properties...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-white rounded-lg border border-slate-100 shadow-sm">
            <div className="flex justify-center mb-4">
              <Search className="h-12 w-12 text-red-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Error loading properties</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Something went wrong. Please try again later.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="border-[#0F4C5C] text-[#0F4C5C]"
            >
              Retry
            </Button>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-slate-100 shadow-sm">
            <div className="flex justify-center mb-4">
              <Search className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No properties found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              We couldn't find any properties matching your criteria. 
              Try adjusting your filters or search terms.
            </p>
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="border-[#0F4C5C] text-[#0F4C5C]"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-slate-600">
              Showing {properties.length} of {data?.total || 0} properties
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    isNew: false,
                  }} 
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-[#0F4C5C] text-[#0F4C5C]"
                >
                  Previous
                </Button>
                <div className="flex items-center px-4 text-sm text-slate-600">
                  Page {page} of {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="border-[#0F4C5C] text-[#0F4C5C]"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
