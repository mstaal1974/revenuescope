
"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LeadCaptureOverlayProps {
  onUnlock: () => void;
}

export function LeadCaptureOverlay({ onUnlock }: LeadCaptureOverlayProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && phone) {
      console.log("Lead Captured:", { name, email, phone });
      onUnlock();
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
        <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Button variant="outline" className="w-full py-6 rounded-[2rem] text-base font-bold">Download Board-Ready PDF</Button>
            <Button asChild variant="outline" className="w-full py-6 rounded-[2rem] text-base font-bold">
              <Link href="https://outlook.office.com/bookwithme/user/a656a2e7353645d98cae126f07ebc593@blocksure.com.au/meetingtype/OAyzW_rOmEGxuBmLJElpTw2?anonymous&ismsaljsauthenabled&ep=mlink" target="_blank">Book Discovery Meeting</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
