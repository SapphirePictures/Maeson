import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { favoritesAPI } from '../lib/api/user';
import { Button } from '../components/ui/button';
import { Heart, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { toast } from 'sonner';

export function Favorites() {
  const { isAuthenticated, loading } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesAPI.getFavorites,
    enabled: isAuthenticated,
  });

  const removeMutation = useMutation({
    mutationFn: favoritesAPI.removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success('Removed from favorites');
    },
    onError: () => {
      toast.error('Failed to remove from favorites');
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0F4C5C]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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
        <Link to="/">
          <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-[#0F4C5C] text-slate-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F4C5C] mb-2 font-heading flex items-center gap-2">
            <Heart className="h-8 w-8" />
            My Favorites
          </h1>
          <p className="text-slate-600">
            Properties you've saved for later
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[#0F4C5C] mx-auto mb-4" />
            <p className="text-slate-600">Loading your favorites...</p>
          </div>
        ) : !favorites || favorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-slate-100 shadow-sm">
            <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No favorites yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Start exploring properties and save your favorites to view them here.
            </p>
            <Link to="/properties">
              <Button className="bg-[#0F4C5C] hover:bg-[#0a3844]">
                Browse Properties
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-slate-600">
              {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((favorite) => (
                <div key={favorite._id} className="relative">
                  <PropertyCard
                    property={{
                      id: favorite.property._id,
                      title: favorite.property.title,
                      location: `${favorite.property.address.city}, ${favorite.property.address.state}`,
                      price: formatPrice(favorite.property.price, favorite.property.listingType),
                      type: favorite.property.listingType === 'sale' ? 'buy' : 'rent',
                      bedrooms: favorite.property.bedrooms || 0,
                      bathrooms: favorite.property.bathrooms || 0,
                      area: favorite.property.squareFeet ? `${favorite.property.squareFeet} sqft` : '',
                      image: favorite.property.images[0]?.url || '',
                      images: favorite.property.images.map((img: any) => img.url),
                      isNew: false,
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => removeMutation.mutate(favorite._id)}
                    disabled={removeMutation.isPending}
                  >
                    {removeMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                  {favorite.notes && (
                    <div className="mt-2 p-3 bg-white rounded-lg border border-slate-200">
                      <p className="text-sm text-slate-600">
                        <strong>Notes:</strong> {favorite.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
