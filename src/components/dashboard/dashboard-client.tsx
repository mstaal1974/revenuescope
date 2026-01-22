"use client";

import { useState } from "react";
import type { AuditData } from "@/app/actions";
import { RtoView } from "./rto-view";
import { StudentView } from "./student-view";
import { LeadCaptureOverlay } from "./lead-capture-overlay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, GraduationCap } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface DashboardClientProps {
  data: AuditData;
}

export function DashboardClient({ data }: DashboardClientProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4 relative">
        <Card className="mb-8 bg-card/50 backdrop-blur-sm border-primary/20 rounded-2xl">
            <CardHeader>
                <CardTitle className="text-3xl font-black font-headline">Audit Results for: {data.rtoName}</CardTitle>
                <CardDescription className="text-lg">A multi-perspective analysis of your curriculum scope.</CardDescription>
            </CardHeader>
        </Card>
      <div className={`relative transition-all duration-500 ${!isUnlocked ? 'blur-lg pointer-events-none' : ''}`}>
        <Tabs defaultValue="rto" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-12 rounded-xl">
            <TabsTrigger value="rto" className="h-full text-base gap-2 rounded-lg">
              <Building className="h-5 w-5" />
              RTO Perspective
            </TabsTrigger>
            <TabsTrigger value="student" className="h-full text-base gap-2 rounded-lg">
              <GraduationCap className="h-5 w-5" />
              Student Perspective
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rto" className="mt-6">
            <RtoView analysis={data.analysis} />
          </TabsContent>
          <TabsContent value="student" className="mt-6">
            <StudentView analysis={data.analysis} />
          </TabsContent>
        </Tabs>
      </div>

      {!isUnlocked && <LeadCaptureOverlay onUnlock={() => setIsUnlocked(true)} />}
    </div>
  );
}
