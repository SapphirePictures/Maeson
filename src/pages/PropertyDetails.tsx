import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Bed, Bath, Move, Phone, Mail, Calendar, Check, Share2, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { properties } from '../lib/data';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find(p => p.id === Number(id));

  // Initialize state only if property exists to avoid errors on initial render if null
  const [activeImage, setActiveImage] = useState(property?.image);

  // Use property.images if available, otherwise fall back to just the main image
  const galleryImages = property?.images || (property?.image ? [property.image] : []);

  useEffect(() => {
    if (property) {
      setActiveImage(property.image);
    }
  }, [property]);

  if (!property) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Property Not Found</h2>
        <p className="text-slate-600 mb-6">The property you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate('/properties')}>Back to Properties</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="pl-0 hover:bg-transparent hover:text-[#0F4C5C] text-slate-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Images + Details) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Section (Mobile only, for layout hierarchy) */}
            <div className="lg:hidden">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-slate-600 mb-4">
                <MapPin className="h-4 w-4 mr-1 text-[#0F4C5C]" />
                {property.location}
              </div>
            </div>

            {/* Gallery Section */}
            <div className="space-y-4">
              {/* Main Active Image */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 shadow-md group">
                <ImageWithFallback 
                  src={activeImage || ''} 
                  alt={property.title} 
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                
                {/* Image Navigation Overlay - Only show if more than 1 image */}
                {galleryImages.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                     <Button 
                      variant="secondary" 
                      size="icon" 
                      className="pointer-events-auto h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-sm"
                      onClick={() => {
                        const currentIndex = galleryImages.indexOf(activeImage || '');
                        const prevIndex = currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1;
                        setActiveImage(galleryImages[prevIndex]);
                      }}
                     >
                       <ChevronLeft className="h-5 w-5 text-slate-900" />
                     </Button>
                     <Button 
                      variant="secondary" 
                      size="icon" 
                      className="pointer-events-auto h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-sm"
                      onClick={() => {
                        const currentIndex = galleryImages.indexOf(activeImage || '');
                        const nextIndex = currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0;
                        setActiveImage(galleryImages[nextIndex]);
                      }}
                     >
                       <ChevronRight className="h-5 w-5 text-slate-900" />
                     </Button>
                  </div>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${property.type === 'buy' ? 'bg-[#0F4C5C] text-white' : 'bg-[#E3B505] text-[#0F4C5C]'}`}>
                    {property.type === 'buy' ? 'For Sale' : 'For Rent'}
                  </span>
                  {property.isNew && (
                    <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      New
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails Grid - Only show if more than 1 image */}
              {galleryImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2 md:gap-4">
                  {galleryImages.map((img, index) => (
                    <button 
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`relative aspect-[4/3] rounded-md overflow-hidden transition-all ${
                        activeImage === img 
                          ? 'ring-2 ring-[#0F4C5C] ring-offset-2 opacity-100' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <ImageWithFallback 
                        src={img} 
                        alt={`View ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Overview */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="hidden lg:block mb-6">
                 <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900 mb-2">{property.title}</h1>
                      <div className="flex items-center text-slate-600">
                        <MapPin className="h-5 w-5 mr-1.5 text-[#0F4C5C]" />
                        {property.location}
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-3xl font-bold text-[#0F4C5C]">{property.price}</div>
                    </div>
                 </div>
              </div>
              
              <div className="lg:hidden mb-6 border-b border-slate-100 pb-6">
                 <div className="text-3xl font-bold text-[#0F4C5C]">{property.price}</div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-4">Overview</h3>
              <div className="grid grid-cols-3 gap-4 mb-8">
                 <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <Bed className="h-6 w-6 text-slate-400 mb-2" />
                    <span className="font-bold text-slate-900 text-lg">{property.bedrooms}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wide">Bedrooms</span>
                 </div>
                 <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <Bath className="h-6 w-6 text-slate-400 mb-2" />
                    <span className="font-bold text-slate-900 text-lg">{property.bathrooms}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wide">Bathrooms</span>
                 </div>
                 <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <Move className="h-6 w-6 text-slate-400 mb-2" />
                    <span className="font-bold text-slate-900 text-lg">{property.area}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wide">Area</span>
                 </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-4">Description</h3>
              <div className="prose prose-slate max-w-none text-slate-600">
                <p>
                  Welcome to this stunning property located in the heart of {property.location.split(',')[0]}. 
                  This exquisite {property.bedrooms > 0 ? `${property.bedrooms}-bedroom` : ''} home offers a perfect blend of modern luxury and comfort.
                </p>
                <p className="mt-4">
                  Featuring spacious living areas, high-end finishes, and ample natural light, this property is designed for those who appreciate quality.
                  The {property.area} layout ensures plenty of room for relaxation and entertainment.
                </p>
                <p className="mt-4">
                  Don't miss the opportunity to own this piece of paradise in one of Nigeria's most sought-after locations.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                  {['24/7 Security', 'Power Supply', 'Parking Space', 'Water Treatment', 'CCTV', 'Fitted Kitchen'].map((item) => (
                    <div key={item} className="flex items-center text-slate-600">
                      <Check className="h-4 w-4 text-[#E3B505] mr-2" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Agent Contact) */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Agent</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-slate-200 overflow-hidden">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80" alt="Agent" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">David Okeke</h4>
                  <p className="text-slate-500 text-sm">Senior Sales Associate</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Button className="w-full bg-[#0F4C5C] hover:bg-[#0a3844] gap-2">
                  <Phone className="h-4 w-4" />
                  Call Agent
                </Button>
                <Button variant="outline" className="w-full border-slate-300 gap-2">
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full border-slate-300 gap-2">
                   <Calendar className="h-4 w-4" />
                   Schedule Tour
                </Button>
              </div>

              <div className="flex gap-2">
                 <Button variant="ghost" className="flex-1 text-slate-500 gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                 </Button>
                 <Button variant="ghost" className="flex-1 text-slate-500 gap-2">
                    <Heart className="h-4 w-4" />
                    Save
                 </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
