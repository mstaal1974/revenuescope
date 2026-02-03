'use client';

import React, { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Phone, User, Download, ShieldCheck } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
        description: 'Could not connect to the database. Please try again later.'
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create a document reference with a generated ID immediately (synchronous)
      const leadsCollection = collection(db, 'leads');
      const docRef = doc(leadsCollection);
      const leadId = docRef.id;

      const leadData = {
        id: leadId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        rtoCode: rtoCode || 'N/A',
        createdAt: serverTimestamp(),
        timestamp: new Date().toISOString()
      };

      // Perform the write without await to follow non-blocking guidelines
      setDoc(docRef, leadData).catch((err) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'create',
          requestResourceData: leadData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      // Store leadId in local storage for future reference (e.g. Course Builder)
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
        description: 'Something went wrong. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-500">
      <Card className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-none">
        <div className="bg-blue-600 p-8 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                <Download className="w-8 h-8" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tight">Unlock Your Full Analysis</CardTitle>
            <p className="mt-2 text-blue-100 font-medium">Enter your details to download the Sales & Content Pack.</p>
        </div>
        <CardContent className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Full Name"
                  required
                  className="pl-12 py-6 bg-slate-50 border-slate-200 rounded-xl font-bold text-lg focus:ring-4 focus:ring-blue-500/10 h-auto"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Business Email"
                  required
                  className="pl-12 py-6 bg-slate-50 border-slate-200 rounded-xl font-bold text-lg focus:ring-4 focus:ring-blue-500/10 h-auto"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="pl-12 py-6 bg-slate-50 border-slate-200 rounded-xl font-bold text-lg focus:ring-4 focus:ring-blue-500/10 h-auto"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-950 hover:bg-blue-600 text-white font-black py-8 rounded-2xl transition-all shadow-2xl shadow-slate-900/20 active:scale-[0.98] text-xl h-auto"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                'Unlock Report & Content Pack'
              )}
            </Button>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure Data Processing</span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
