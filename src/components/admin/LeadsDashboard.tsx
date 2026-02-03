'use client';

import React, { useMemo } from 'react';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { Loader2, AlertTriangle, Download, User, Mail, Phone, Calendar, Inbox, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CourseTimeline } from '@/components/CourseBuilder/CourseTimeline';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Lead {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  rtoCode: string;
  createdAt: Timestamp;
  timestamp?: string;
  curriculum?: any;
}

export function LeadsDashboard() {
  const firestore = useFirestore();

  const leadsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // We order by createdAt desc to show the newest leads first.
    return query(collection(firestore, 'leads'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: leads, loading, error } = useCollection<Lead>(leadsQuery);

  const handleDownload = () => {
    if (!leads) return;
    const dataStr = JSON.stringify(leads, (key, value) => {
      if (value && typeof value === 'object' && value.seconds && value.nanoseconds) {
        return new Timestamp(value.seconds, value.nanoseconds).toDate().toISOString();
      }
      return value;
    }, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `ScopeStack_Leads_${format(new Date(), 'yyyy-MM-dd')}.json`);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
            <Loader2 className="relative h-16 w-16 animate-spin text-blue-600" />
        </div>
        <p className="mt-6 text-slate-500 font-bold tracking-tight">Syncing Live Leads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-8 rounded-[2.5rem] flex items-start gap-6 max-w-2xl mx-auto shadow-xl">
        <AlertTriangle className="h-10 w-10 text-rose-500 shrink-0" />
        <div>
          <h4 className="font-black text-2xl tracking-tight">Sync Error</h4>
          <p className="mt-2 text-lg font-medium opacity-80 leading-relaxed">Could not establish a secure connection to the Leads database. Please ensure your admin permissions are correctly configured.</p>
          <div className="mt-4 p-4 bg-white/50 rounded-xl font-mono text-xs overflow-auto border border-rose-100">
            {error.message}
          </div>
        </div>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
        <Card className="mt-16 bg-white border-2 border-dashed border-slate-200 max-w-2xl mx-auto rounded-[3rem] shadow-xl">
          <CardContent className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Inbox className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Leads Captured</h3>
            <p className="mt-2 text-slate-500 font-medium text-lg">
              The pipeline is active, but no leads have been recorded yet.
            </p>
          </CardContent>
        </Card>
      );
  }

  return (
    <div className="container mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-black uppercase tracking-widest mb-4 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Live Database
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Leads Dashboard</h1>
            <p className="text-slate-500 text-xl font-medium mt-2">{leads.length} high-intent lead(s) identified.</p>
        </div>
        <Button 
          onClick={handleDownload} 
          className="bg-slate-950 text-white hover:bg-blue-600 font-black px-8 py-6 rounded-2xl shadow-2xl transition-all active:scale-95 text-lg"
        >
          <Download className="mr-2 h-5 w-5" />
          Export Dataset
        </Button>
      </div>

      <div className="space-y-8">
        {leads.map((lead) => (
          <Card key={lead.id} className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[3rem] border-slate-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] transition-all duration-500 border">
            <CardHeader className="p-10 bg-slate-50/50 border-b border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8 relative z-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-blue-600 border border-slate-100">
                            <User className="w-7 h-7" />
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">{lead.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="bg-white font-bold text-slate-600 border-slate-200">
                                    <Briefcase className="w-3 h-3 mr-1 text-blue-500" /> {lead.rtoCode || 'General Audit'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
                       <a href={`mailto:${lead.email}`} className="flex items-center gap-2 group">
                           <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                               <Mail className="h-4 w-4" />
                           </div>
                           <span className="font-bold text-slate-600 group-hover:text-blue-600 transition-colors">{lead.email}</span>
                       </a>
                       <a href={`tel:${lead.phoneNumber}`} className="flex items-center gap-2 group">
                           <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                               <Phone className="h-4 w-4" />
                           </div>
                           <span className="font-bold text-slate-600 group-hover:text-emerald-600 transition-colors">{lead.phoneNumber}</span>
                       </a>
                    </div>
                </div>
                
                <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="font-black text-slate-900 text-sm">{lead.createdAt ? format(lead.createdAt.toDate(), 'PPP p') : (lead.timestamp ? format(new Date(lead.timestamp), 'PPP p') : 'Timestamp Missing')}</span>
                    </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              {lead.curriculum ? (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-5 rounded-[1.5rem] hover:no-underline transition-all shadow-xl group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <Download className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="text-left">
                                <span className="block font-black text-lg">View Generated Curriculum</span>
                                <span className="block text-xs font-bold text-slate-400 group-hover:text-blue-100 uppercase tracking-widest">Powered by Gemini 2.5 Pro</span>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-10">
                      <div className="bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-inner">
                        <CourseTimeline data={lead.curriculum} isLoading={false} isUnlocked={true} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <div className="text-center py-10 px-8 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
                    <p className="text-lg font-bold text-slate-400">No AI Curriculum saved for this profile yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
