import React from 'react';
import { TrustSection } from '../components/TrustSection';
import { Button } from '../components/ui/button';

export function About() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-[#0F4C5C] text-white py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading">About Maeson Realty</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Redefining the real estate experience in Nigeria with integrity, innovation, and a commitment to excellence.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden bg-slate-200">
               {/* Placeholder for an office image */}
               <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop" 
                alt="Modern Office" 
                className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-[#0F4C5C]/10 mix-blend-multiply"></div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#0F4C5C] mb-6 font-heading">Our Mission</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                At Maeson Realty, our mission is to simplify the property acquisition process in Nigeria. 
                We believe that finding a home or investment property should be an exciting journey, not a stressful one.
                By combining cutting-edge technology with deep local market knowledge, we provide our clients with 
                unparalleled insights and opportunities.
              </p>
              <h2 className="text-3xl font-bold text-[#0F4C5C] mb-6 font-heading">Why Choose Us?</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#E3B505] flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-[#0F4C5C] font-bold text-xs">✓</span>
                  </div>
                  <span className="text-slate-700">Deep understanding of the Lagos, Abuja, and Port Harcourt markets.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#E3B505] flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-[#0F4C5C] font-bold text-xs">✓</span>
                  </div>
                  <span className="text-slate-700">Transparent documentation and verification processes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#E3B505] flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-[#0F4C5C] font-bold text-xs">✓</span>
                  </div>
                  <span className="text-slate-700">Dedicated property management and advisory services.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <TrustSection />

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F4C5C] mb-4 font-heading">Meet Our Leadership</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Guided by industry veterans with decades of combined experience in Nigerian real estate.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-64 bg-slate-200 w-full overflow-hidden">
                   {/* Placeholder avatars */}
                   <img 
                    src={`https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop`}
                    alt="Team Member"
                    className="w-full h-full object-cover"
                   />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-[#0F4C5C] mb-1 font-heading">Chinedu Okeke</h3>
                  <p className="text-[#E3B505] font-medium text-sm mb-3">Managing Partner</p>
                  <p className="text-slate-600 text-sm">
                    Over 15 years transforming the real estate landscape in Lekki and Victoria Island.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-[#0F4C5C] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6 font-heading">Ready to find your dream property?</h2>
          <Button size="lg" className="bg-[#E3B505] text-[#0F4C5C] hover:bg-[#d4a804] font-semibold text-lg px-8">
            Contact Us Today
          </Button>
        </div>
      </section>
    </div>
  );
}
