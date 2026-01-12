import React from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function Contact() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Header */}
      <section className="bg-[#0F4C5C] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Contact Us</h1>
          <p className="text-lg text-slate-200 max-w-xl mx-auto">
            We are here to assist you with all your real estate needs. Reach out to us today.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-[#0F4C5C] mb-8 font-heading">Get in Touch</h2>
            <p className="text-slate-600 mb-8">
              Whether you are looking to buy, sell, or rent, our team of experts is ready to provide you with professional guidance.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#E3B505]/20 p-3 rounded-lg text-[#0F4C5C]">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F4C5C] mb-1">Head Office</h3>
                  <p className="text-slate-600">14B Victoria Arobieke Street,<br/>Lekki Phase 1, Lagos, Nigeria</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#E3B505]/20 p-3 rounded-lg text-[#0F4C5C]">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F4C5C] mb-1">Phone</h3>
                  <p className="text-slate-600">+234 800 MAESON NG</p>
                  <p className="text-slate-600">+234 700 123 4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#E3B505]/20 p-3 rounded-lg text-[#0F4C5C]">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F4C5C] mb-1">Email</h3>
                  <p className="text-slate-600">hello@maesonrealty.com</p>
                  <p className="text-slate-600">support@maesonrealty.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#E3B505]/20 p-3 rounded-lg text-[#0F4C5C]">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F4C5C] mb-1">Business Hours</h3>
                  <p className="text-slate-600">Mon - Fri: 8:00 AM - 6:00 PM</p>
                  <p className="text-slate-600">Sat: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-bold text-[#0F4C5C] mb-6 font-heading">Send us a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-slate-700">First Name</label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-slate-700">Last Name</label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</label>
                <Input id="phone" type="tel" placeholder="+234..." />
              </div>

              <div className="space-y-2">
                <label htmlFor="inquiryType" className="text-sm font-medium text-slate-700">Inquiry Type</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>Buying Property</option>
                  <option>Selling Property</option>
                  <option>Renting</option>
                  <option>Property Management</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
                <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px]" />
              </div>

              <Button className="w-full bg-[#E3B505] text-[#0F4C5C] hover:bg-[#d4a804] font-bold text-lg h-12">
                Send Message
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
