
import React from 'react';
import { Button } from './ui/button';
import { MessageCircle } from 'lucide-react';

export function CTABanner() {
  return (
    <section className="bg-[#0F4C5C] py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-8 text-3xl font-bold text-white md:text-5xl">
          Ready to Find Your Next Property?
        </h2>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="h-14 bg-[#E3B505] px-8 text-lg font-bold text-[#0F4C5C] hover:bg-[#d4a804]">
            Browse Properties
          </Button>
          <Button size="lg" variant="outline" className="h-14 gap-2 border-white px-8 text-lg font-bold text-[#0F4C5C] hover:bg-white/10 hover:text-white">
            <MessageCircle className="h-5 w-5" />
            Talk to an Agent
          </Button>
        </div>
      </div>
    </section>
  );
}
