"use client"

import { Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { plateforme: "Web", tickets: 275, fill: "var(--color-web)" },
  { plateforme: "Mobile", tickets: 200, fill: "var(--color-mobile)" },
  { plateforme: "Desktop", tickets: 187, fill: "var(--color-desktop)" },
  { plateforme: "API", tickets: 173, fill: "var(--color-api)" },
  { plateforme: "Autre", tickets: 90, fill: "var(--color-autre)" },
]

const chartConfig = {
  tickets: {
    label: "Tickets",
  },
  web: {
    label: "Web",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-3)",
  },
  api: {
    label: "API",
    color: "var(--chart-4)",
  },
  autre: {
    label: "Autre",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function RepartitionPlateforme() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par plateforme</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer
          config={chartConfig}
          className="w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="tickets"
              nameKey="plateforme"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
