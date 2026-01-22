"use client";

import { useEffect, useState } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ListChecks, Briefcase } from "lucide-react";
import type { AuditData } from "@/app/actions";

interface StudentViewProps {
  analysis: AuditData["analysis"];
}

const chartConfig = {
  skills: {
    label: "Skill Impact",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const careerPaths = [
    { title: "AI/ML Specialist", description: "Leverage new data science modules for high-demand roles."},
    { title: "Cybersecurity Analyst", description: "Fill critical skill gaps in digital security sectors."},
    { title: "Cloud Solutions Architect", description: "Expanded curriculum now covers advanced cloud certifications."},
    { title: "Digital Marketing Manager", description: "New modules focus on data-driven marketing strategies."}
];

export function StudentView({ analysis }: StudentViewProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate data generation from analysis
    const skills = ["Problem Solving", "Data Analysis", "Project Mgmt", "Communication", "Technical Acumen", "Leadership"];
    const data = skills.map(skill => ({
      skill,
      value: Math.floor(Math.random() * (100 - 40 + 1)) + 40,
    }));
    setChartData(data);
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Student Skill Enhancement</CardTitle>
            <CardDescription>
              Projected impact of new curriculum on key employability skills.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[350px]">
                <RadarChart data={chartData}>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarGrid />
                  <Radar dataKey="value" fill="var(--color-skills)" fillOpacity={0.6} />
                </RadarChart>
              </ChartContainer>
            </ResponsiveContainer>
          </CardContent>
        </Card>
         <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListChecks /> AI-Generated Course Benefits</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
             <p>{analysis.revenueOpportunities}</p>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase/> High-Impact Career Paths</CardTitle>
            <CardDescription>
                Potential career outcomes for students completing the new courses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {careerPaths.map(path => (
                <div key={path.title}>
                    <h4 className="font-semibold">{path.title}</h4>
                    <p className="text-sm text-muted-foreground">{path.description}</p>
                </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
