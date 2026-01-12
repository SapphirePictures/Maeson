
import React from 'react';
import { ShieldCheck, Users, Lock, FileCheck } from 'lucide-react';

export function TrustSection() {
  const features = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-[#E3B505]" />,
      title: "Verified Properties",
      description: "Every property listed on Maeson Realty undergoes a rigorous verification process to ensure authenticity and legal standing."
    },
    {
      icon: <Users className="h-8 w-8 text-[#E3B505]" />,
      title: "Trusted Local Agents",
      description: "Connect with experienced real estate professionals who understand the local market and guide you every step of the way."
    },
    {
      icon: <Lock className="h-8 w-8 text-[#E3B505]" />,
      title: "Secure Transactions",
      description: "We provide a secure platform and guidance for safe financial transactions, protecting your investment from start to finish."
    }
  ];

  return (
    <section className="py-24 bg-[#0F4C5C] text-white">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold md:text-4xl mb-4">Why Choose Maeson Realty</h2>
          <p className="mx-auto max-w-2xl text-slate-300">
            We are redefining the real estate experience in Nigeria with trust, transparency, and technology.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group rounded-sm bg-white/5 p-8 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-sm bg-[#0F4C5C] shadow-lg border border-white/10 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
              <p className="text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
