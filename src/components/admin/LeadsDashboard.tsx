'use client';

import React, { useMemo } from 'react';
import { useFirestore } from '@/firebase';
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

  const leadsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'leads'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: leads, loading, error } = useCollection<Lead>(leadsQuery);

  const handleDownload = () => {
    if (!leads) return;
    const dataStr = JSON.stringify(leads, (key, value) => {
      // Convert Firestore Timestamps to ISO strings
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
          <h4 className="font-bold text-lg">Failed to Load Leads</h4>
          <p className="mt-1">Could not fetch data from the database. This is likely due to Firestore Security Rules. Ensure the rules allow read access to the 'leads' collection for this dashboard to function.</p>
          <p className="mt-1 text-xs font-mono">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
        <Card className="mt-16 bg-white border-2 border-dashed border-slate-200 max-w-2xl mx-auto">
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
            <p className="text-slate-500">{leads.length} lead(s) found.</p>
        </div>
        <Button onClick={handleDownload} disabled={!leads || leads.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Download JSON
        </Button>
      </div>

      <div className="space-y-6">
        {leads.map((lead) => (
          <Card key={lead.id} className="bg-white shadow-md rounded-2xl">
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold">{lead.name}</CardTitle>
                <div className="text-sm text-slate-500 flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 mt-2">
                   <div className="flex items-center gap-2">
                       <Mail className="h-4 w-4" />
                       <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                   </div>
                   <div className="flex items-center gap-2">
                       <Phone className="h-4 w-4" />
                       <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                   </div>
                </div>
              </div>
              <div className="text-sm text-slate-500 text-right shrink-0">
                  <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{lead.createdAt ? format(lead.createdAt.toDate(), 'PPpp') : 'No date'}</span>
                  </div>
              </div>
            </CardHeader>
            <CardContent>
              {lead.curriculum ? (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="bg-slate-50 hover:bg-slate-100 px-4 rounded-md">View Saved Curriculum</AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <CourseTimeline data={lead.curriculum} isLoading={false} isUnlocked={true} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <div className="text-center py-4 px-4 bg-slate-50 rounded-md">
                    <p className="text-sm font-medium text-slate-500">No curriculum has been saved for this lead.</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
