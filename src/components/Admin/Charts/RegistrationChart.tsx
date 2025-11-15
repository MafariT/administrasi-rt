'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  pendaftar: {
    label: "Pendaftar",
    color: "#0D9488",
  },
} satisfies ChartConfig

export function WeeklyChart({ data }: { data: any[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[320px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar
          dataKey="pendaftar"
          fill="var(--color-pendaftar)"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  )
}
