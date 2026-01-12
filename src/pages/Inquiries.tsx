import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { inquiriesAPI } from '../lib/api/user';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { MessageSquare, Send, Inbox, Loader2, ArrowLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function Inquiries() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('sent');

  const { data: sentInquiries, isLoading: loadingSent } = useQuery({
    queryKey: ['inquiries', 'sent'],
    queryFn: inquiriesAPI.getSentInquiries,
    enabled: isAuthenticated,
  });

  const { data: receivedInquiries, isLoading: loadingReceived } = useQuery({
    queryKey: ['inquiries', 'received'],
    queryFn: inquiriesAPI.getReceivedInquiries,
    enabled: isAuthenticated,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0F4C5C]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500';
      case 'read':
        return 'bg-yellow-500';
      case 'responded':
        return 'bg-green-500';
      case 'closed':
        return 'bg-slate-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <Link to="/">
          <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-[#0F4C5C] text-slate-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F4C5C] mb-2 font-heading flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            My Inquiries
          </h1>
          <p className="text-slate-600">
            Manage your property inquiries
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Sent ({sentInquiries?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="received" className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              Received ({receivedInquiries?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sent" className="mt-6">
            {loadingSent ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#0F4C5C] mx-auto" />
              </div>
            ) : !sentInquiries || sentInquiries.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Send className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No inquiries sent</h3>
                  <p className="text-slate-500 mb-4">
                    You haven't sent any inquiries yet.
                  </p>
                  <Link to="/properties">
                    <Button className="bg-[#0F4C5C] hover:bg-[#0a3844]">
                      Browse Properties
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {sentInquiries.map((inquiry) => (
                  <Card key={inquiry._id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            <Link 
                              to={`/properties/${inquiry.property._id}`}
                              className="hover:text-[#0F4C5C]"
                            >
                              {inquiry.property.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(inquiry.createdAt), 'PPP')}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(inquiry.status)}>
                          {inquiry.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-slate-700">Your Message:</p>
                          <p className="text-sm text-slate-600 mt-1">{inquiry.message}</p>
                        </div>
                        
                        {inquiry.response && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm font-medium text-green-800">Response:</p>
                            <p className="text-sm text-green-700 mt-1">{inquiry.response}</p>
                            {inquiry.respondedAt && (
                              <p className="text-xs text-green-600 mt-2">
                                Responded on {format(new Date(inquiry.respondedAt), 'PPP')}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>To: {inquiry.recipient.firstName} {inquiry.recipient.lastName}</span>
                          <span>•</span>
                          <span>Type: {inquiry.inquiryType}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="received" className="mt-6">
            {loadingReceived ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#0F4C5C] mx-auto" />
              </div>
            ) : !receivedInquiries || receivedInquiries.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Inbox className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No inquiries received</h3>
                  <p className="text-slate-500">
                    You haven't received any inquiries yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {receivedInquiries.map((inquiry) => (
                  <Card key={inquiry._id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            <Link 
                              to={`/properties/${inquiry.property._id}`}
                              className="hover:text-[#0F4C5C]"
                            >
                              {inquiry.property.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(inquiry.createdAt), 'PPP')}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(inquiry.status)}>
                          {inquiry.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            From: {inquiry.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {inquiry.email} • {inquiry.phone || 'No phone'}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-700">Message:</p>
                          <p className="text-sm text-slate-600 mt-1">{inquiry.message}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Type: {inquiry.inquiryType}</span>
                          <span>•</span>
                          <span>Preferred: {inquiry.preferredContactMethod}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
