"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users } from "lucide-react";
import type { AuditData } from "@/app/actions";

interface RtoViewProps {
  analysis: AuditData["analysis"];
}

const chartConfig = {
  revenue: {
    label: "Potential Revenue (AUD)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function RtoView({ analysis }: RtoViewProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ ltv: 0, enrollment: 0 });

  useEffect(() => {
    // In a real app, you'd parse `analysis.revenueOpportunities` to get this data.
    // Here we generate random data on the client to simulate it.
    const opportunities = ["Micro-credentials", "Corporate Training", "Online Short Courses", "Skills Bootcamps", "Advanced Diplomas"];
    const data = opportunities.map(opp => ({
      opportunity: opp,
      revenue: Math.floor(Math.random() * (250000 - 50000 + 1)) + 50000,
    }));
    setChartData(data);
    setMetrics({
        ltv: Math.floor(Math.random() * (35 - 15 + 1)) + 15,
        enrollment: Math.floor(Math.random() * (500 - 150 + 1)) + 150
    })
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Potential Revenue Streams</CardTitle>
            <CardDescription>
              AI-identified opportunities based on your current scope and market demand.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <ChartContainer config={chartConfig}>
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="opportunity"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                   <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
                </BarChart>
              </ChartContainer>
            </ResponsiveContainer>
          </CardContent>
        </Card>
         <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>AI Revenue Analysis</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
            <p>{analysis.revenueOpportunities}</p>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <Card className="rounded-2xl shadow-lg">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected LTV Increase</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{metrics.ltv}%</div>
            <p className="text-xs text-muted-foreground">
              per student with new course offerings
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-lg">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. New Enrollments (Yr 1)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~{metrics.enrollment}</div>
            <p className="text-xs text-muted-foreground">
              across all new programs
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Market Segments</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
              <Badge variant="secondary">Corporate Upskilling</Badge>
              <Badge variant="secondary">Tech Conversions</Badge>
              <Badge variant="secondary">International Students</Badge>
              <Badge variant="secondary">Continuing Education</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
