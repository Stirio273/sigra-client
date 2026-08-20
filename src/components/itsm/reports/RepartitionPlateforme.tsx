"use client"

import { useEffect, useState } from "react"
import { LabelList, Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { reportService } from "@/services/report.service"

type ApiRequestStat = {
  applicationId: number
  applicationName: string
  count: number
  percentage: number
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

const getCurrentWeekRange = (): { from: string; to: string } => {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? 6 : day - 1
  const monday = new Date(today)
  monday.setDate(today.getDate() - diff)

  const format = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  return {
    from: format(monday),
    to: format(today),
  }
}

export function RepartitionPlateforme() {
  const [data, setData] = useState<ApiRequestStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [from, setFrom] = useState<string>(getCurrentWeekRange().from)
  const [to, setTo] = useState<string>(getCurrentWeekRange().to)

  const load = async (selectedFrom: string, selectedTo: string) => {
    setLoading(true)
    setError(null)

    try {
      const raw = await reportService.getRequestsByApplication(selectedFrom, selectedTo)
      setData(raw)
    } catch (err) {
      setError(err instanceof Error ? err.message : "LOAD_FAILED")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(from, to)
  }, [])

  const handleApply = () => {
    load(from, to)
  }

  const chartData = data.map((item, index) => ({
    plateforme: item.applicationName,
    tickets: item.count,
    fill: COLORS[index % COLORS.length],
  }))

  const nameToConfigKey = new Map(
    data.map((item) => [item.applicationName, `app-${item.applicationId}`])
  )

  const chartConfig = {
    tickets: {
      label: "Tickets",
    },
    ...Object.fromEntries(
      data.map((item, index) => [
        `${item.applicationName}`,
        {
          label: item.applicationName,
          color: COLORS[index % COLORS.length],
        },
      ])
    ),
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par plateforme</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        {loading ? (
          <div className="flex h-[200px] w-full items-center justify-center text-sm text-muted-foreground">
            Chargement...
          </div>
        ) : error ? (
          <div className="flex h-[200px] w-full items-center justify-center text-sm text-destructive">
            {error}
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[250px] w-full max-w-[250px] [&_.recharts-text]:fill-background"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="tickets" hideLabel />}
              />
              <Pie data={chartData} dataKey="tickets">
                <LabelList
                  dataKey="plateforme"
                  stroke="none"
                  fontSize={12}
                 formatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <label htmlFor="from-date" className="text-xs text-muted-foreground">De</label>
            <Input
              id="from-date"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="to-date" className="text-xs text-muted-foreground">À</label>
            <Input
              id="to-date"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={handleApply} disabled={loading}>
            Appliquer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
