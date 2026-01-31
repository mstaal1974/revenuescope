'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { runGenerateCourseTimelineAction, runGenerateLearningOutcomesAction, type CourseTimelineActionResult, type LearningOutcomesActionResult } from '@/app/actions';
import { CourseTimeline } from '@/components/CourseBuilder/CourseTimeline';
import type { CourseTimelineOutput } from '@/ai/types';
import { Loader2, Sparkles, AlertTriangle, Save, CheckCircle2 } from 'lucide-react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';


function CourseBuilderContent() {
  const searchParams = useSearchParams();
  const [courseTitle, setCourseTitle] = useState(searchParams.get('title') || '');
  const [learningOutcomes, setLearningOutcomes] = useState('');
  const [isOutcomesLoading, setIsOutcomesLoading] = useState(false);
  const [result, setResult] = useState<CourseTimelineOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const titleFromParams = searchParams.get('title');
    // If there's a title in the URL, we fetch the learning outcomes.
    // We also update the courseTitle state in case it was empty on initial render.
    if (titleFromParams) {
      setCourseTitle(titleFromParams);
      setLearningOutcomes(''); // Clear previous outcomes
      setResult(null); // Clear previous results
      setIsSaved(false); // Reset saved state
      
      const fetchOutcomes = async () => {
        setIsOutcomesLoading(true);
        setError(null);
        const response: LearningOutcomesActionResult = await runGenerateLearningOutcomesAction({ course_title: titleFromParams });
        if (response.ok) {
          setLearningOutcomes(response.result.learning_outcomes.join('\n'));
        } else {
          setError(`Failed to generate learning outcomes: ${response.error}`);
        }
        setIsOutcomesLoading(false);
      };
      fetchOutcomes();
    }
  }, [searchParams]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    setIsSaved(false);

    const outcomesArray = learningOutcomes.split('\n').filter(line => line.trim() !== '');
    if (!courseTitle || outcomesArray.length === 0) {
      setError("Please provide a course title and at least one learning outcome.");
      setIsLoading(false);
      return;
    }

    const response: CourseTimelineActionResult = await runGenerateCourseTimelineAction({
      course_title: courseTitle,
      learning_outcomes: outcomesArray,
    });

    if (response.ok) {
      setResult(response.result);
      setIsUnlocked(true);

    } else {
      setError(response.error);
    }
    setIsLoading(false);
  };

  const handleSaveCurriculum = async () => {
    if (!result) return;
    setIsSaving(true);
    
    try {
      const leadId = localStorage.getItem('leadId');
      if (leadId && result) {
        const db = getFirestore();
        const leadRef = doc(db, 'leads', leadId);
        await updateDoc(leadRef, {
          curriculum: result,
        });
        setIsSaved(true);
        toast({
          title: 'Curriculum Saved!',
          description: (
            <p>
              Please contact{' '}
              <a
                href="mailto:mstaal@blocksure.com.au"
                className="font-bold underline text-blue-600"
              >
                mstaal@blocksure.com.au
              </a>{' '}
              for your copy.
            </p>
          ),
          duration: 9000,
        });
      } else {
         toast({
            variant: 'destructive',
            title: 'Profile Not Found',
            description: "We couldn't find your profile. Please complete an audit first to save your curriculum.",
        });
      }
    } catch (e) {
      console.error('Failed to save curriculum to lead:', e);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save the curriculum to the database.',
      });
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <div className="w-full max-w-4xl">
      <Card className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-200">
        <CardHeader className="p-0 mb-8 text-center">
            <div className="inline-flex items-center justify-center gap-2 mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-500" />
                <CardTitle className="text-4xl font-black text-slate-900 tracking-tight">
                    Course Builder AI
                </CardTitle>
            </div>
          <CardDescription className="text-lg text-slate-500">
            Enter your course details below and let our AI generate a market-ready curriculum outline in seconds.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="course-title" className="text-sm font-bold text-slate-700">Course Title</label>
              <Input
                id="course-title"
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g., Introduction to Strategic Leadership"
                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-xl transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="learning-outcomes" className="text-sm font-bold text-slate-700">Learning Outcomes (one per line)</label>
              <div className="relative">
                <Textarea
                  id="learning-outcomes"
                  value={learningOutcomes}
                  onChange={(e) => setLearningOutcomes(e.target.value)}
                  placeholder={isOutcomesLoading ? 'Generating learning outcomes with AI...' : 'e.g., Define strategic leadership\nDifferentiate between leadership and management'}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-medium text-lg transition-all min-h-[150px]"
                  required
                  disabled={isOutcomesLoading}
                />
                {isOutcomesLoading && <Loader2 className="absolute top-1/2 left-1/2 -mt-3 -ml-3 h-6 w-6 animate-spin text-blue-500" />}
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading || isOutcomesLoading}
              className="w-full bg-slate-950 hover:bg-blue-600 text-white font-black px-8 py-5 rounded-2xl transition-all shadow-2xl shadow-slate-900/20 active:scale-[0.98] text-xl"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                'Generate Curriculum'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-12">
        {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-rose-500 shrink-0 mt-1" />
                <div>
                    <h4 className="font-bold text-lg">Generation Failed</h4>
                    <p className="mt-1">{error}</p>
                </div>
          </div>
        )}

        {(isLoading || result) && (
          <CourseTimeline data={result} isLoading={isLoading} isUnlocked={isUnlocked} />
        )}

        {result && !isSaved && (
          <div className="mt-8 text-center bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 animate-in fade-in">
              <h4 className="text-xl font-bold text-slate-800">Ready to save your work?</h4>
              <p className="text-slate-500 mt-2 mb-6 max-w-lg mx-auto">Save this generated curriculum to your profile. You can request a copy for your records and for use in your RTO's official documentation.</p>
              <Button
                onClick={handleSaveCurriculum}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20"
              >
                {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
                {isSaving ? 'Saving...' : 'Save Curriculum to Profile'}
              </Button>
          </div>
        )}

        {isSaved && (
            <div className="mt-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl p-8 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-emerald-900">Curriculum Saved Successfully!</h4>
                <p className="text-emerald-700 mt-2 max-w-lg mx-auto">
                    This curriculum has been associated with your profile.
                    Check your email for confirmation or contact our team to receive your copy.
                </p>
            </div>
        )}
      </div>

    </div>
  );
}


export default function CourseBuilderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 md:p-8">
        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
          <CourseBuilderContent />
        </Suspense>
      </main>
    </div>
  );
}
