
"use client";

import { Suspense, useState, useEffect } from 'react';
import { Header } from "@/components/shared/header";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { type AuditData } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, Loader2 } from 'lucide-react';

function DashboardPageContent() {
  const [data, setData] = useState<AuditData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataString = localStorage.getItem("auditData");
    if (!dataString) {
      setError("No audit data found. Please start a new audit from the homepage.");
      setLoading(false);
      return;
    }
    try {
      const parsedData = JSON.parse(dataString);
      setData(parsedData);
    } catch (e) {
      console.error("Failed to parse audit data:", e);
      setError("There was an issue with the audit data. It might be corrupted. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const ErrorCard = ({title, message}: {title: string, message: string}) => (
    <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-card rounded-[2.5rem] shadow-2xl p-12 border border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-black text-foreground">
                    <AlertTriangle className="text-rose-500" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">{message}</p>
                <Button asChild className="w-full bg-slate-950 hover:bg-blue-600 text-white font-black px-8 py-5 rounded-2xl transition-all shadow-2xl shadow-slate-900/20 active:scale-[0.98] text-xl">
                  <Link href="/">Start New Audit</Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
  
  if (loading) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground font-medium">Loading Dashboard...</p>
        </div>
    );
  }

  if (error) {
    return <ErrorCard title="Error Loading Audit" message={error} />;
  }
  
  if (data) {
    return <DashboardClient data={data} />;
  }

  return <ErrorCard title="An Unknown Error Occurred" message="Something went wrong. Please return to the homepage and try again." />;
}

export default function DashboardPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-body">
            <Header />
            <main className="flex-1 flex flex-col py-8 md:py-16">
              <Suspense fallback={
                <div className="flex-1 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-4 text-muted-foreground font-medium">Loading...</p>
                </div>
              }>
                <DashboardPageContent />
              </Suspense>
            </main>
        </div>
    );
}
