"use client";

import { Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/shared/header";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { type AuditData } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

function DashboardPageContent() {
  const searchParams = useSearchParams();
  const dataString = searchParams.get("data");

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

  if (!dataString) {
    return <ErrorCard title="Error Loading Data" message="No audit data was provided. Please start a new audit from the homepage." />;
  }

  try {
    const data: AuditData = JSON.parse(decodeURIComponent(dataString));
    return <DashboardClient data={data} />;
  } catch (error) {
    console.error("Failed to parse audit data:", error);
    return <ErrorCard title="Data Parsing Error" message="There was an issue with the audit data. It might be corrupted. Please try again." />;
  }
}

export default function DashboardPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col">
              <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading Dashboard...</div>}>
                <DashboardPageContent />
              </Suspense>
            </main>
        </div>
    );
}
