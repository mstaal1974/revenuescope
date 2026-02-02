'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  value: {
    label: 'Projected Revenue',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

interface GrowthProjectionChartProps {
    data: { name: string; value: number }[];
    yAxisFormatter?: (value: any) => string;
}

export default function GrowthProjectionChart({ data, yAxisFormatter }: GrowthProjectionChartProps) {
  const defaultFormatter = (value: any) => `$${Number(value) / 1000}k`;
  const formatter = yAxisFormatter || defaultFormatter;

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 0,
          right: 0,
          top: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value}
           className="text-xs fill-slate-500"
        />
        <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={formatter}
            className="text-xs fill-slate-500"
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <defs>
            <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1}/>
            </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="natural"
          fill="url(#fillValue)"
          stroke="var(--color-value)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
