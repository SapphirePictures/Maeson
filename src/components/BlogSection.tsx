import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { blogPosts } from '../lib/data';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function BlogSection() {
  // Only show the first 3 posts on the homepage
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Property Insights</h2>
            <p className="text-slate-600 max-w-xl">Stay updated with the latest trends, guides, and news from the Nigerian real estate market.</p>
          </div>
          <Link to="/blog" className="hidden md:flex items-center gap-2 font-semibold text-[#0F4C5C] hover:text-[#0a3641]">
            View All Articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {recentPosts.map((post) => (
            <Link 
              to={`/blog/${post.id}`} 
              key={post.id} 
              className="group flex flex-col overflow-hidden rounded-sm bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <ImageWithFallback 
                  src={post.image} 
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{post.date}</span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-[#0F4C5C] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="mb-6 text-sm text-slate-600 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="mt-auto">
                   <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#0F4C5C] hover:gap-2 transition-all">
                    Read Article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

         <div className="mt-8 flex justify-center md:hidden">
             <Link to="/blog" className="flex items-center gap-2 font-semibold text-[#0F4C5C]">
            View All Articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
