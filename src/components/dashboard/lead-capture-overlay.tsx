
'use client';

import React, { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Phone, User, Download, ShieldCheck } from 'lucide-react';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface LeadCaptureOverlayProps {
  rtoCode: string;
  onUnlock: () => void;
}

/**
 * LeadCaptureOverlay captures user contact info before revealing the dashboard.
 * It saves data to Firestore and stores the leadId in localStorage.
 */
export function LeadCaptureOverlay({ rtoCode, onUnlock }: LeadCaptureOverlayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const db = useFirestore();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!db) {
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Could not connect to the database. Please refresh and try again.'
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create a document reference with a generated ID immediately
      const leadsCollection = collection(db, 'leads');
      const docRef = doc(leadsCollection);
      const leadId = docRef.id;

      // Prepare lead data matching the standardized schema
      const leadData = {
        id: leadId,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        rtoCode: rtoCode || 'N/A',
        createdAt: serverTimestamp(), // For reliable server-side ordering
        timestamp: new Date().toISOString() // For instant client-side reading
      };

      // Perform the write using the non-blocking helper
      setDocumentNonBlocking(docRef, leadData, {});

      // Store leadId in local storage for session persistence
      localStorage.setItem('leadId', leadId);
      
      // Unlock the dashboard immediately (optimistic UI)
      onUnlock();
      
      toast({
        title: 'Report Unlocked!',
        description: 'You now have full access to your personalized growth strategy.',
      });

    } catch (error) {
      console.error('Error saving lead:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Error',
        description: 'We encountered an error saving your details. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-500">
      <Card className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-none">
        <div className="bg-slate-950 p-10 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-inner">
                <Download className="w-10 h-10 text-blue-400" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tight mb-2">Unlock Your Full Analysis</CardTitle>
            <p className="text-slate-400 font-medium">Enter your professional details to download the complete Strategy & Content Pack.</p>
        </div>
        <CardContent className="p-10 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Full Name"
                  required
                  className="pl-12 py-7 bg-slate-50 border-slate-200 rounded-2xl font-bold text-lg focus:ring-4 focus:ring-blue-500/10 h-auto transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Work Email"
                  required
                  className="pl-12 py-7 bg-slate-50 border-slate-200 rounded-2xl font-bold text-lg focus:ring-4 focus:ring-blue-500/10 h-auto transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="tel"
                  placeholder="Direct Phone"
                  required
                  className="pl-12 py-7 bg-slate-50 border-slate-200 rounded-2xl font-bold text-lg focus:ring-4 focus:ring-blue-500/10 h-auto transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-950 hover:bg-blue-600 text-white font-black py-8 rounded-2xl transition-all shadow-2xl shadow-slate-900/20 active:scale-[0.98] text-xl h-auto group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                <span className="flex items-center gap-2">
                    Access Strategy Report <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </span>
              )}
            </Button>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Encrypted Data Transmission</span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
