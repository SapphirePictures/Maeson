import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { blogPosts } from '../lib/data';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">Article Not Found</h2>
        <p className="text-slate-600 mb-6">The article you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      {/* Hero Section */}
      <div className="bg-[#0F4C5C] text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
           <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="mb-8 text-slate-300 hover:text-white hover:bg-white/10 pl-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
          
          <div className="max-w-4xl">
            <div className="inline-block bg-[#E3B505] text-[#0F4C5C] text-xs font-bold px-3 py-1 rounded-full mb-4">
              {post.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 font-heading leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>5 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <ImageWithFallback 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-8 md:p-12">
                 {/* Content Injection */}
                 <div 
                  className="prose prose-slate prose-lg max-w-none 
                  prose-headings:font-heading prose-headings:text-[#0F4C5C] 
                  prose-a:text-[#E3B505] prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: post.content || '' }} 
                />
              </div>

              {/* Author Bio Section */}
              <div className="bg-slate-50 p-8 border-t border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-300 overflow-hidden flex-shrink-0">
                    {/* Placeholder Avatar */}
                    <div className="w-full h-full flex items-center justify-center bg-[#0F4C5C] text-white font-bold text-xl">
                      {post.author.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">About {post.author}</h3>
                    <p className="text-slate-600 text-sm">
                      Real estate market analyst and property consultant with over 10 years of experience in the Nigerian property sector.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Share Widget */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 lg:sticky lg:top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share this article
              </h3>
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full justify-start gap-3 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors">
                  <Facebook className="h-4 w-4" />
                  Share on Facebook
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors">
                  <Twitter className="h-4 w-4" />
                  Share on Twitter
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors">
                  <Linkedin className="h-4 w-4" />
                  Share on LinkedIn
                </Button>
              </div>
            </div>

            {/* Related Posts Widget */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4">More Insights</h3>
              <div className="space-y-4">
                {blogPosts
                  .filter(p => p.id !== post.id)
                  .slice(0, 3)
                  .map(related => (
                    <div 
                      key={related.id} 
                      className="group cursor-pointer flex gap-4 items-start"
                      onClick={() => navigate(`/blog/${related.id}`)}
                    >
                      <div className="h-16 w-16 rounded-md overflow-hidden bg-slate-200 flex-shrink-0">
                         <ImageWithFallback src={related.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-[#0F4C5C] line-clamp-2 leading-snug">
                          {related.title}
                        </h4>
                        <span className="text-xs text-slate-500 mt-1 block">{related.date}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
