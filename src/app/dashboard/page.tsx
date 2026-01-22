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
    const dataString = sessionStorage.getItem("auditData");
    if (!dataString) {
      setError("No audit data was found. Please start a new audit from the homepage.");
      setLoading(false);
      return;
    }
    try {
      setData(JSON.parse(dataString));
    } catch (e) {
      console.error("Failed to parse audit data:", e);
      setError("There was an issue with the audit data. It might be corrupted. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const ErrorCard = ({title, message}: {title: string, message: string}) => (
    <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="text-destructive" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>{message}</p>
                <Button asChild className="w-full">
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
            <p className="mt-2 text-muted-foreground">Loading Dashboard...</p>
        </div>
    );
  }

  if (error) {
    return <ErrorCard title="Error Loading Data" message={error} />;
  }
  
  if (data) {
    return <DashboardClient data={data} />;
  }

  return <ErrorCard title="An Unknown Error Occurred" message="Something went wrong. Please return to the homepage and try again." />;
}

export default function DashboardPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col">
              <Suspense fallback={
                <div className="flex-1 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-muted-foreground">Loading...</p>
                </div>
              }>
                <DashboardPageContent />
              </Suspense>
            </main>
        </div>
    );
}
