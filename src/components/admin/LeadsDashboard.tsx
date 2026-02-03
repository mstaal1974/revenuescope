'use client';

import React, { useMemo } from 'react';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { Loader2, AlertTriangle, Download, User, Mail, Phone, Calendar, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CourseTimeline } from '@/components/CourseBuilder/CourseTimeline';
import { format } from 'date-fns';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Timestamp;
  curriculum?: any;
}

export function LeadsDashboard() {
  const firestore = useFirestore();

  const leadsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'leads'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: leads, loading, error } = useCollection<Lead>(leadsQuery);

  const handleDownload = () => {
    if (!leads) return;
    const dataStr = JSON.stringify(leads, (key, value) => {
      // Convert Firestore Timestamps to ISO strings for export
      if (value && typeof value === 'object' && value.seconds && value.nanoseconds) {
        return new Timestamp(value.seconds, value.nanoseconds).toDate().toISOString();
      }
      return value;
    }, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'leads.json');
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-4 text-slate-500 font-medium">Loading Leads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl flex items-start gap-4 max-w-2xl mx-auto">
        <AlertTriangle className="h-6 w-6 text-rose-500 shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-lg">Access Restriction</h4>
          <p className="mt-1">Could not fetch data from the database. This prototype uses a client-side password, but Firestore rules may still be restricting access based on your auth state.</p>
          <p className="mt-1 text-xs font-mono">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
        <Card className="mt-16 bg-white border-2 border-dashed border-slate-200 max-w-2xl mx-auto rounded-[2rem]">
          <CardContent className="p-12 text-center">
            <Inbox className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-bold text-slate-800">No Leads Found</h3>
            <p className="mt-1 text-sm text-slate-500">
              There are currently no leads in the database.
            </p>
          </CardContent>
        </Card>
      );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Leads Dashboard</h1>
            <p className="text-slate-500">{leads.length} lead(s) found in real-time.</p>
        </div>
        <Button 
          onClick={handleDownload} 
          className="bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 font-bold px-6 py-2 rounded-xl shadow-sm"
        >
          <Download className="mr-2 h-4 w-4" />
          Download JSON
        </Button>
      </div>

      <div className="space-y-6">
        {leads.map((lead) => (
          <Card key={lead.id} className="bg-white shadow-md rounded-[2rem] border-slate-200 overflow-hidden">
            <CardHeader className="flex flex-row justify-between items-start p-8 bg-white border-b border-slate-100">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <User className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900">{lead.name}</CardTitle>
                </div>
                <div className="text-sm text-slate-500 flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 pl-1">
                   <div className="flex items-center gap-2">
                       <Mail className="h-4 w-4 text-slate-400" />
                       <a href={`mailto:${lead.email}`} className="hover:text-blue-600 font-medium transition-colors">{lead.email}</a>
                   </div>
                   <div className="flex items-center gap-2">
                       <Phone className="h-4 w-4 text-slate-400" />
                       <a href={`tel:${lead.phone}`} className="hover:text-blue-600 font-medium transition-colors">{lead.phone}</a>
                   </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-wider">
                      <Calendar className="h-3 w-3" />
                      <span>{lead.createdAt ? format(lead.createdAt.toDate(), 'PPpp') : 'No date'}</span>
                  </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {lead.curriculum ? (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="bg-slate-50 hover:bg-slate-100 px-6 py-4 rounded-2xl hover:no-underline transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                                <Download className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-700">View Saved Curriculum</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-8">
                      <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                        <CourseTimeline data={lead.curriculum} isLoading={false} isUnlocked={true} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <div className="text-center py-6 px-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-sm font-bold text-slate-400">No AI Curriculum saved for this lead.</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
