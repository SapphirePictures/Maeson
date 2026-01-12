import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Calendar, User } from 'lucide-react';
import { blogPosts } from '../lib/data';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Blog() {
  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50">
      <div className="bg-[#0F4C5C] text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Market Insights</h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto">
            Stay updated with the latest trends, news, and expert advice on the Nigerian real estate market.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link 
              to={`/blog/${post.id}`} 
              key={post.id} 
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-slate-100 flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-[#E3B505] text-[#0F4C5C] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author}
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-[#0F4C5C] mb-3 line-clamp-2 font-heading group-hover:underline decoration-2 underline-offset-4 decoration-[#E3B505]">
                  {post.title}
                </h2>
                
                <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">
                  {post.excerpt}
                </p>
                
                <div className="self-start mt-auto">
                  <span className="text-[#0F4C5C] font-semibold text-sm group-hover:text-[#E3B505] flex items-center gap-1 transition-colors">
                    Read Article <span>→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center gap-2">
           <Button variant="outline" disabled>Previous</Button>
           <Button variant="outline" className="bg-[#0F4C5C] text-white border-[#0F4C5C]">1</Button>
           <Button variant="outline">2</Button>
           <Button variant="outline">3</Button>
           <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  );
}
