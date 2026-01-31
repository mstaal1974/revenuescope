'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const chartData = [
  { month: 'Jan', unbundled: 18, original: 4 },
  { month: 'Feb', unbundled: 30, original: 5 },
  { month: 'Mar', unbundled: 23, original: 4 },
  { month: 'Apr', unbundled: 47, original: 6 },
  { month: 'May', unbundled: 39, original: 5 },
  { month: 'Jun', unbundled: 51, original: 7 },
];

const chartConfig = {
  unbundled: {
    label: 'AI-Unbundled Products',
    color: 'hsl(var(--primary))',
  },
  original: {
    label: 'Original Qualifications',
    color: 'hsl(var(--foreground) / 0.3)',
  },
} satisfies ChartConfig;

export function UnbundlingChart() {
  return (
     <Card className="bg-card p-4 rounded-[1.5rem] border border-border shadow-2xl shadow-primary/5">
        <CardHeader className="p-2 pb-0">
            <CardTitle className="text-sm font-bold text-foreground">AI Unbundling Performance</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Last 6 Months</CardDescription>
        </CardHeader>
        <CardContent className="p-0 pb-2">
            <ChartContainer config={chartConfig} className="h-40 w-full">
                <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value}
                        className="text-xs"
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={10} width={20} />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="original" fill="var(--color-original)" radius={4} />
                    <Bar dataKey="unbundled" fill="var(--color-unbundled)" radius={4} />
                </BarChart>
            </ChartContainer>
            <div className="mt-2 p-3 bg-background rounded-md border border-border/50">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">BSB50120 Analysis</span>
                    <span className="text-sm font-bold text-emerald-400">85% Match</span>
                </div>
                <Progress value={85} className="h-2 [&>div]:bg-emerald-400" />
            </div>
        </CardContent>
    </Card>
  );
}
