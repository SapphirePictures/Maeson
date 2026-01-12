import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { properties } from '../lib/data';

export function AffordableHomes() {
  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
  };

  const affordableProperties = properties.filter(p => {
    const price = parsePrice(p.price);
    if (p.type === 'rent') {
      return price <= 10000000; // 10 million
    } else {
      return price <= 100000000; // 100 million
    }
  });

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Affordable Homes</h2>
            <p className="mt-2 text-slate-600">Great value properties under ₦100M</p>
          </div>
          <Link to="/properties?maxPrice=100000000" className="hidden md:flex items-center gap-2 font-semibold text-[#0F4C5C] hover:text-[#0a3641]">
            See All Listings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {affordableProperties.slice(0, 4).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        
        <div className="mt-4 flex justify-center md:hidden">
             <Link to="/properties?maxPrice=100000000" className="flex items-center gap-2 font-semibold text-[#0F4C5C]">
            See All Listings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
