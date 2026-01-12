
import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { MapPin, Home, Banknote, Search, Users } from 'lucide-react';
import heroBg from 'figma:asset/ba59cf5d0c19e2b6f128d2586fb6ebb8669fbc3d.png';

export function Hero() {
  return (
    <section className="relative w-full bg-[#0F4C5C] pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg}
          alt="Modern Home" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
        
        {/* Trust Indicator */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm border border-white/20">
          <Users className="h-4 w-4 text-[#E3B505]" />
          <span>55k+ customers found properties with Maeson Realty</span>
        </div>

        {/* Headline */}
        <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
          Find Your Perfect Property <br className="hidden md:block" /> in <span className="text-[#E3B505]">Nigeria</span>
        </h1>

        {/* Subtext */}
        <p className="mb-12 max-w-2xl text-lg text-slate-200 md:text-xl">
          Buy, rent, or invest in verified properties across Lagos, Abuja, and major cities. 
          Experience seamless real estate transactions.
        </p>

        {/* Search Filter Card */}
        <div className="w-full max-w-5xl rounded-sm bg-white p-4 shadow-xl md:p-6 text-left">
          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="mb-6 bg-slate-100 p-1">
              <TabsTrigger value="buy" className="px-8 data-[state=active]:bg-white data-[state=active]:text-[#0F4C5C] data-[state=active]:shadow-sm">Buy</TabsTrigger>
              <TabsTrigger value="rent" className="px-8 data-[state=active]:bg-white data-[state=active]:text-[#0F4C5C] data-[state=active]:shadow-sm">Rent</TabsTrigger>
            </TabsList>
            
            <div className="grid gap-4 md:grid-cols-12">
              <div className="md:col-span-3">
                <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input placeholder="Lagos, Abuja..." className="pl-9 border-slate-200" />
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Property Type</label>
                <div className="relative">
                  <Select>
                    <SelectTrigger className="pl-9 border-slate-200">
                      <Home className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <SelectValue placeholder="Residence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Budget</label>
                <div className="relative">
                   <Select>
                    <SelectTrigger className="pl-9 border-slate-200">
                      <Banknote className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-50m">Under ₦50M</SelectItem>
                      <SelectItem value="50m-100m">₦50M - ₦100M</SelectItem>
                      <SelectItem value="100m-plus">₦100M+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

               <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Bedrooms</label>
                 <Select>
                    <SelectTrigger className="border-slate-200">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
              </div>

              <div className="md:col-span-2 flex items-end">
                <Button className="w-full bg-[#E3B505] text-[#0F4C5C] hover:bg-[#d4a804] font-bold h-10">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
