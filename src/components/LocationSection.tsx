
import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { locations } from '../lib/data';

export function LocationSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore Properties by Location</h2>
          <p className="text-slate-600">Find your dream home in Nigeria's most sought-after cities and neighborhoods.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {locations.map((location, index) => (
            <Link 
              key={index} 
              to={`/properties?location=${encodeURIComponent(location)}`}
              className="group flex items-center justify-between p-6 bg-white rounded-lg shadow-sm hover:shadow-md border border-slate-100 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 group-hover:bg-[#E3B505]/20 group-hover:text-[#0F4C5C] transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="font-semibold text-slate-900">{location}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#0F4C5C] transition-colors" />
            </Link>
          ))}
             <Link 
              to="/properties"
              className="group flex items-center justify-center p-6 bg-[#0F4C5C] rounded-lg shadow-sm hover:shadow-md border border-[#0F4C5C] transition-all hover:-translate-y-1"
            >
              <span className="font-semibold text-white">View All Locations</span>
            </Link>
        </div>
      </div>
    </section>
  );
}
