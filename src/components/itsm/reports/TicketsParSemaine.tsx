"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { semaine: "S1", tickets: 186 },
  { semaine: "S2", tickets: 305 },
  { semaine: "S3", tickets: 237 },
  { semaine: "S4", tickets: 173 },
  { semaine: "S5", tickets: 209 },
  { semaine: "S6", tickets: 214 },
  { semaine: "S7", tickets: 192 },
  { semaine: "S8", tickets: 248 },
]

const chartConfig = {
  tickets: {
    label: "Tickets",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function TicketsParSemaine() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nombre de tickets par semaine</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="semaine"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="tickets" fill="var(--color-tickets)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
