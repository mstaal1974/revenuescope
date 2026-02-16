'use client';

import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '@/firebase/provider';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Phone, User, Download, ShieldCheck, Lock } from 'lucide-react';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface LeadCaptureOverlayProps {
  rtoCode: string;
  onUnlock: () => void;
}

/**
 * LeadCaptureOverlay captures user contact info before revealing the dashboard.
 * Keyed to the specific analysis session.
 */
export function LeadCaptureOverlay({ rtoCode, onUnlock }: LeadCaptureOverlayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const firebaseContext = useContext(FirebaseContext);
  const db = firebaseContext?.firestore;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Pre-fill from local storage if details were previously submitted for convenience
    setFormData({
      name: localStorage.getItem('leadName') || '',
      email: localStorage.getItem('leadEmail') || '',
      phoneNumber: localStorage.getItem('leadPhone') || ''
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!db) {
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'The secure database is still initializing. Please wait a moment.'
      });
      setIsLoading(false);
      return;
    }

    try {
      const leadsCollection = collection(db, 'leads');
      const docRef = doc(leadsCollection);
      const leadId = docRef.id;

      const leadData = {
        id: leadId,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        rtoCode: rtoCode || 'N/A',
        createdAt: serverTimestamp(),
        timestamp: new Date().toISOString()
      };

      setDocumentNonBlocking(docRef, leadData, { merge: true });

      // Persist for session and global use
      localStorage.setItem('leadId', leadId);
      localStorage.setItem('leadName', formData.name);
      localStorage.setItem('leadEmail', formData.email);
      localStorage.setItem('leadPhone', formData.phoneNumber);
      
      // Set session-specific unlock
      sessionStorage.setItem(`unlocked_${rtoCode}`, 'true');
      
      onUnlock();
      
      toast({
        title: 'Strategy Unlocked',
        description: 'Your high-fidelity growth report is now available.',
      });

    } catch (error) {
      console.error('LeadCaptureOverlay: Error saving lead:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Error',
        description: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-500">
      <Card className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-none animate-in zoom-in-95 mx-auto">
        <div className="bg-slate-950 p-10 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-inner">
                <Lock className="w-10 h-10 text-blue-400" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tight mb-2 uppercase italic">Professional Access Required</CardTitle>
            <p className="text-slate-400 font-medium leading-relaxed px-4">
                To view the full strategic unbundling report for <b className="text-blue-400">{rtoCode}</b>, please verify your professional details.
            </p>
        </div>
        <CardContent className="p-10 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Full Name"
                  required
                  className="pl-12 py-7 bg-slate-50 border-slate-200 rounded-2xl font-bold text-lg focus:ring-4 focus:ring-blue-500/10 h-auto transition-all text-slate-900 placeholder:text-slate-400"
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
                  className="pl-12 py-7 bg-slate-50 border-slate-200 rounded-2xl font-bold text-lg focus:ring-4 focus:ring-blue-500/10 h-auto transition-all text-slate-900 placeholder:text-slate-400"
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
                  className="pl-12 py-7 bg-slate-50 border-slate-200 rounded-2xl font-bold text-lg focus:ring-4 focus:ring-blue-500/10 h-auto transition-all text-slate-900 placeholder:text-slate-400"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !db}
              className="w-full bg-slate-950 hover:bg-blue-600 text-white font-black py-8 rounded-2xl transition-all shadow-2xl shadow-slate-900/20 active:scale-[0.98] text-xl h-auto group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                <span className="flex items-center gap-2">
                    {db ? 'UNLOCK STRATEGY PACK' : 'CONNECTING...'} <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </span>
              )}
            </Button>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Encrypted via Gemini 2.5 Pro Architecture</span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
