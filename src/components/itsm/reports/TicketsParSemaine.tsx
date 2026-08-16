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
  { semaine: "S1", respecteSLA: 140, horsSLA: 46 },
  { semaine: "S2", respecteSLA: 230, horsSLA: 75 },
  { semaine: "S3", respecteSLA: 180, horsSLA: 57 },
  { semaine: "S4", respecteSLA: 130, horsSLA: 43 },
  { semaine: "S5", respecteSLA: 160, horsSLA: 49 },
  { semaine: "S6", respecteSLA: 160, horsSLA: 54 },
  { semaine: "S7", respecteSLA: 145, horsSLA: 47 },
  { semaine: "S8", respecteSLA: 190, horsSLA: 58 },
]

const chartConfig = {
  respecteSLA: {
    label: "Respecte SLA",
    color: "var(--muted)",
  },
  horsSLA: {
    label: "Hors SLA",
    color: "var(--primary)",
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
            <Bar dataKey="respecteSLA" fill="var(--color-respecteSLA)" stackId="a" radius={[0, 0, 4, 4]} />
            <Bar dataKey="horsSLA" fill="var(--color-horsSLA)" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
