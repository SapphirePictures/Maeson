import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Move } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PropertyProps {
  property: {
    id: number;
    title: string;
    location: string;
    price: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    image: string;
    isNew?: boolean;
  };
  layout?: 'grid' | 'horizontal';
}

export function PropertyCard({ property, layout = 'grid' }: PropertyProps) {
  if (layout === 'horizontal') {
    return (
      <Link 
        to={`/properties/${property.id}`}
        className="group relative flex min-w-[280px] w-[280px] md:w-[320px] flex-col overflow-hidden rounded-sm bg-white shadow-sm border border-slate-200 transition-all hover:shadow-md md:min-w-[320px]"
      >
        {/* Image Area */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <ImageWithFallback
            src={property.image}
            alt={property.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Top Left Badge */}
          <div className="absolute top-2 left-2">
             <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wide rounded-sm bg-white/90 text-slate-900 shadow-sm">
              {property.type === 'buy' ? 'For Sale' : 'For Rent'}
            </span>
          </div>

          {/* Heart Icon */}
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <Heart className="h-4 w-4" />
          </button>
          
          {/* New Badge - Bottom Left */}
          {property.isNew && (
             <div className="absolute bottom-2 left-2">
              <span className="bg-[#0F4C5C] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
                NEW
              </span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex flex-col p-3 gap-1">
             <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-900">{property.price}</span>
             </div>
             
             <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-1">
                  <span className="font-bold">{property.bedrooms}</span> <span className="font-normal text-slate-500">bed</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{property.bathrooms}</span> <span className="font-normal text-slate-500">bath</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{property.area}</span>
                </div>
              </div>

             <div className="mt-1 flex flex-col">
                <h3 className="line-clamp-1 text-sm font-semibold text-slate-900 group-hover:underline decoration-slate-400 underline-offset-2">
                  {property.title}
                </h3>
                <span className="line-clamp-1 text-xs text-slate-500">{property.location}</span>
              </div>
        </div>
      </Link>
    );
  }

  // Grid Layout (Main)
  return (
    <Link 
      to={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-sm bg-white shadow-sm border border-slate-200 transition-all hover:shadow-md"
    >
      
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <ImageWithFallback
          src={property.image}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
           <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm bg-white text-slate-900 shadow-sm border border-slate-100">
              {property.type === 'buy' ? 'For Sale' : 'For Rent'}
            </span>
        </div>

        {/* Heart/Save Button */}
        <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-[2px] transition-colors group-hover:bg-black/40"
        >
            <Heart className="h-5 w-5 stroke-[2.5px]" />
        </button>

         {/* Bottom Badges */}
         <div className="absolute bottom-3 left-3 flex gap-2">
            {property.isNew && (
                <span className="bg-[#0F4C5C] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm shadow-sm">
                  NEW
                </span>
            )}
         </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        
        {/* Price Row */}
        <div className="mb-2">
            <div className="text-2xl font-bold text-slate-900">
            {property.price}
            </div>
        </div>

        {/* Stats Row */}
        <div className="mb-3 flex items-center gap-4 text-sm text-slate-700">
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-slate-400" />
            <span className="font-bold">{property.bedrooms}</span> 
            <span className="text-slate-500">bed</span>
          </div>
          <span className="h-4 w-px bg-slate-200"></span>
          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-slate-400" />
            <span className="font-bold">{property.bathrooms}</span> 
            <span className="text-slate-500">bath</span>
          </div>
          <span className="h-4 w-px bg-slate-200"></span>
           <div className="flex items-center gap-1.5">
            <Move className="h-4 w-4 text-slate-400" />
            <span className="font-bold">{property.area}</span>
          </div>
        </div>

        {/* Address/Title Section */}
        <div className="flex flex-col gap-1">
             <h3 className="truncate text-base font-medium text-slate-900 group-hover:underline decoration-slate-400 underline-offset-4 decoration-1">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-slate-500">
               <MapPin className="h-3.5 w-3.5" />
               <span className="truncate">{property.location}</span>
            </div>
        </div>

        {/* Footer / Broker Info */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wide font-medium">
              <span className="h-2 w-2 rounded-full bg-[#E3B505]"></span>
              Maeson Realty
           </div>
           {/* Used asChild with a div to avoid button nesting inside link */}
           <Button asChild variant="ghost" size="sm" className="h-7 text-xs px-2 text-[#0F4C5C] hover:text-[#0F4C5C] hover:bg-slate-50">
             <div>View Details</div>
           </Button>
        </div>

      </div>
    </Link>
  );
}
