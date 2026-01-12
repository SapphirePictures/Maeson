
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Summary */}
          <div>
             <Link to="/" className="mb-6 inline-block">
               <span className="text-2xl font-bold tracking-tight text-white">Maeson Realty</span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Your trusted partner for buying, renting, and investing in Nigerian real estate. Verified properties, secure transactions, and peace of mind.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/properties" className="hover:text-white transition-colors">Properties</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/properties" className="hover:text-white transition-colors">Buy Property</Link></li>
              <li><Link to="/properties" className="hover:text-white transition-colors">Rent Property</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Sell Property</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Property Management</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Real Estate Investment</Link></li>
            </ul>
          </div>

           {/* Contact Info */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-[#E3B505]" />
                <span>14B Victoria Arobieke Street,<br />Lekki Phase 1, Lagos</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-[#E3B505]" />
                <span>+234 800 MAESON NG</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-[#E3B505]" />
                <span>hello@maesonrealty.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Maeson Realty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
