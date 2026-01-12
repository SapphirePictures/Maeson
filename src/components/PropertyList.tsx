
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { PropertyCard } from './PropertyCard';
import { properties } from '../lib/data';

export function PropertyList() {
  const [visibleCount, setVisibleCount] = React.useState(6);
  const forSale = properties.filter(p => p.type === 'buy');
  const forRent = properties.filter(p => p.type === 'rent');

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Properties</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Browse our handpicked selection of properties for sale and rent across Nigeria's most desirable locations.</p>
        </div>

        <Tabs defaultValue="buy" className="w-full" onValueChange={() => setVisibleCount(6)}>
          <div className="flex justify-center mb-10 px-[0px] py-[22px]">
            <TabsList className="bg-slate-100 p-1 rounded-full h-auto">
              <TabsTrigger value="buy" className="rounded-full px-12 py-4 text-lg font-medium data-[state=active]:bg-[#0F4C5C] data-[state=active]:text-white transition-all">Buy Property</TabsTrigger>
              <TabsTrigger value="rent" className="rounded-full px-12 py-4 text-lg font-medium data-[state=active]:bg-[#0F4C5C] data-[state=active]:text-white transition-all">Rent Property</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="buy">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {forSale.slice(0, visibleCount).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
             {visibleCount < forSale.length && (
               <div className="mt-12 text-center">
                   <button onClick={loadMore} className="border border-slate-300 text-slate-700 px-8 py-3 rounded-full font-semibold hover:bg-slate-50 transition-colors">Load More Properties</button>
               </div>
             )}
          </TabsContent>

          <TabsContent value="rent">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {forRent.slice(0, visibleCount).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
             {visibleCount < forRent.length && (
               <div className="mt-12 text-center">
                   <button onClick={loadMore} className="border border-slate-300 text-slate-700 px-8 py-3 rounded-full font-semibold hover:bg-slate-50 transition-colors">Load More Properties</button>
               </div>
             )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
