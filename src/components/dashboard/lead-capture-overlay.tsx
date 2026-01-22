"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

interface LeadCaptureOverlayProps {
  onUnlock: () => void;
}

export function LeadCaptureOverlay({ onUnlock }: LeadCaptureOverlayProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, you'd send this email to a backend
      console.log("Email captured:", email);
      onUnlock();
    }
  };

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/30 backdrop-blur-sm">
      <Card className="max-w-md w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                <Lock className="h-8 w-8 text-primary" />
            </div>
          <CardTitle>Unlock Full Report</CardTitle>
          <CardDescription>Enter your email to access the complete audit and detailed insights.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
            <Button type="submit" className="w-full h-12 text-base">Unlock Full Data</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
