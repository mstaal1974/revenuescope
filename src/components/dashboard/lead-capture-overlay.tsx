
"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { AuditData } from "@/app/actions";

interface LeadCaptureOverlayProps {
  onUnlock: () => void;
  data: AuditData;
}

export function LeadCaptureOverlay({ onUnlock }: LeadCaptureOverlayProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && phone) {
      try {
        const db = getFirestore();
        await addDoc(collection(db, "leads"), {
          name,
          email,
          phone,
          createdAt: serverTimestamp(),
        });
        toast({
          title: "Information Submitted",
          description: "Thank you! The full report is now unlocked.",
        });
        onUnlock();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "There was a problem submitting your information. Please try again.",
        });
      }
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-8 bg-white/40 backdrop-blur-3xl z-50">
      <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.3)] border border-slate-100 max-w-xl text-center relative overflow-hidden">
        <div className="bg-blue-600 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-600/40">
          <Lock className="w-12 h-12 text-white" />
        </div>
        <h5 className="font-black text-4xl text-slate-950 mb-6 tracking-tight italic">Unlock Market-Ready Data</h5>
        <p className="text-slate-500 text-xl mb-12 leading-relaxed font-medium">
          Get full curriculum maps, calibrated pricing models, and persona-driven marketing launch plans with ad creative.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black text-xl text-center transition-all"
            required
          />
          <input
            type="email"
            placeholder="rto-manager@training.edu.au"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black text-xl text-center transition-all"
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            title="Please enter a valid email address."
            required
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black text-xl text-center transition-all"
            pattern="[\d\s\+\(\)-]{8,}"
            title="Please enter a valid phone number."
            required
          />
          <button
            type="submit"
            className="w-full bg-slate-950 hover:bg-blue-600 text-white font-black py-6 rounded-[2rem] transition-all shadow-2xl shadow-slate-950/20 text-xl uppercase tracking-widest"
          >
            Download Sales & Content Pack
          </button>
        </form>
      </div>
    </div>
  );
}
