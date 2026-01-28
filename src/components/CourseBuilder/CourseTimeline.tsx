'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type CourseTimelineData, type TimelineStep } from '@/types/course';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

// A type guard to ensure the icon name is a valid key in LucideIcons
const isValidIcon = (iconName: string): iconName is keyof typeof LucideIcons => {
  return iconName in LucideIcons;
};

// A fallback icon if the provided one is invalid
const FallbackIcon = LucideIcons.HelpCircle;

const TimelineIcon: React.FC<{ iconName: string }> = ({ iconName }) => {
  const IconComponent = isValidIcon(iconName)
    ? LucideIcons[iconName]
    : FallbackIcon;
  return <IconComponent className="h-6 w-6 text-white" />;
};

const LeadCaptureModal: React.FC<{ triggerButton: React.ReactNode }> = ({
  triggerButton,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unlock Full Course Content</DialogTitle>
          <DialogDescription>
            Enter your details to generate the full content for this module,
            including lesson plans and assessments.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Your Name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue="your.email@example.com"
              className="col-span-3"
            />
          </div>
        </div>
        <Button type="submit">Generate & Download</Button>
      </DialogContent>
    </Dialog>
  );
};

const TimelineStepCard: React.FC<{ step: TimelineStep; isLast: boolean }> = ({
  step,
  isLast,
}) => {
  const nodeColor =
    step.contentType === 'conclusion' ? 'bg-emerald-500' : 'bg-blue-500';

  return (
    <div className="flex items-start gap-8">
      {/* Metro Line */}
      <div className="flex flex-col items-center h-full">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${nodeColor} shadow-lg`}
        >
          <TimelineIcon iconName={step.icon} />
        </div>
        {!isLast && <div className="w-1 flex-1 bg-slate-200 -mt-1"></div>}
      </div>

      {/* Content Card */}
      <div className="flex-1 pb-12 -mt-2">
        <Card className="bg-white shadow-sm hover:shadow-lg transition-shadow border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">
              {step.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">{step.description}</p>
            <LeadCaptureModal
              triggerButton={
                <Button variant="secondary" className="w-full">
                  <LucideIcons.Sparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const CourseTimeline: React.FC<{
  data: CourseTimelineData | null;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center p-10">
        <LucideIcons.Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 font-semibold text-slate-600">
          Building visual course outline...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-10 text-slate-500">
        No course data available to build a timeline.
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 rounded-2xl">
      <h3 className="text-2xl font-black text-slate-900 mb-2">
        {data.courseTitle}
      </h3>
      <p className="text-md text-slate-500 mb-8">
        A visual learner pathway from zero to certified.
      </p>

      <div className="mt-8">
        {data.timeline.map((step, index) => (
          <TimelineStepCard
            key={step.id}
            step={step}
            isLast={index === data.timeline.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
