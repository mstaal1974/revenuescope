
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useFirestore } from '@/firebase';
import { CourseTimeline } from '@/components/CourseBuilder/CourseTimeline';
import { Loader2, Inbox } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function SavedCurriculum() {
  const [leadId, setLeadId] = useState<string | null>(null);
  const firestore = useFirestore();

  useEffect(() => {
    // This runs on the client, so window is available.
    const id = localStorage.getItem('leadId');
    setLeadId(id);
  }, []);

  const leadDocRef = useMemo(() => {
    if (!firestore || !leadId) return null;
    return doc(firestore, 'leads', leadId);
  }, [firestore, leadId]);

  const { data: leadData, loading: leadLoading } = useDoc(leadDocRef);

  if (!leadId) {
    // Don't render anything if there's no leadId in storage.
    // This user hasn't created a lead yet.
    return null;
  }

  if (leadLoading) {
    return (
      <Card className="mt-16">
        <CardContent className="p-10 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-4 font-semibold text-slate-600">Loading Saved Curriculum...</p>
        </CardContent>
      </Card>
    );
  }

  if (leadData && leadData.curriculum) {
    return (
      <Card className="mt-16 bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden">
        <CardHeader className="p-8 md:p-16 bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-3xl font-black text-slate-950 tracking-tight">Your Saved Curriculum</CardTitle>
            <CardDescription className="text-slate-500 mt-2 max-w-2xl">This is the curriculum you generated and saved to your profile.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 md:p-16">
          <CourseTimeline data={leadData.curriculum} isLoading={false} isUnlocked={true} />
        </CardContent>
      </Card>
    );
  }

  // If there's a leadId but no curriculum saved yet.
  return (
    <Card className="mt-16 bg-slate-50 border-2 border-dashed border-slate-200">
      <CardContent className="p-12 text-center">
        <Inbox className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-lg font-bold text-slate-800">No Curriculum Saved Yet</h3>
        <p className="mt-1 text-sm text-slate-500">
          Once you generate and save a curriculum in the Course Builder, it will appear here.
        </p>
      </CardContent>
    </Card>
  );
}
