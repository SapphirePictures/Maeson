import React, { useEffect, useState } from 'react';
import { healthCheck } from '../lib/api/health';
import { Hero } from '../components/Hero';
import { NewListings } from '../components/NewListings';
import { AffordableHomes } from '../components/AffordableHomes';
import { PropertyList } from '../components/PropertyList';
import { TrustSection } from '../components/TrustSection';
import { LocationSection } from '../components/LocationSection';
import { BlogSection } from '../components/BlogSection';
import { CTABanner } from '../components/CTABanner';

export function Home() {
  const [apiStatus, setApiStatus] = useState<string>('');

  useEffect(() => {
    healthCheck().then((data) => {
      setApiStatus(data.status === 'success' ? 'Backend API Connected' : `Error: ${data.message}`);
    });
  }, []);

  return (
    <main>
      <div style={{ background: '#e6f7ff', padding: '8px', marginBottom: '12px', borderRadius: '4px', textAlign: 'center' }}>
        {apiStatus}
      </div>
      <Hero />
      <NewListings />
      <AffordableHomes />
      <PropertyList />
      <TrustSection />
      <LocationSection />
      <BlogSection />
      <CTABanner />
    </main>
  );
}
