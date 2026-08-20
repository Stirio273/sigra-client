"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

type ApiWeeklyStat = {
  weekNumber: number
  year: number
  weekStart: string
  count: number
  slaReachedCount: number
}

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

const getLastEightWeeksRange = (): { from: string; to: string } => {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? 6 : day - 1
  const currentMonday = new Date(today)
  currentMonday.setDate(today.getDate() - diff)

  const startDate = new Date(currentMonday)
  startDate.setDate(currentMonday.getDate() - 56)

  const endDate = new Date(currentMonday)
  endDate.setDate(currentMonday.getDate() - 1)

  const format = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  return {
    from: format(startDate),
    to: format(endDate),
  }
}

export function TicketsParSemaine() {
  const [data, setData] = useState<ApiWeeklyStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [from, setFrom] = useState<string>(getLastEightWeeksRange().from)
  const [to, setTo] = useState<string>(getLastEightWeeksRange().to)

  const load = async (selectedFrom: string, selectedTo: string) => {
    setLoading(true)
    setError(null)

    try {
      const raw = await reportService.getWeeklyRequests(selectedFrom, selectedTo)
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

  const chartData = data.map((item) => {
    const respecteSLA = item.slaReachedCount
    const horsSLA = Math.max(item.count - respecteSLA, 0)
    return {
      semaine: `S${item.weekNumber}`,
      respecteSLA,
      horsSLA,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nombre de tickets par semaine</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[200px] w-full items-center justify-center text-sm text-muted-foreground">
            Chargement...
          </div>
        ) : error ? (
          <div className="flex h-[200px] w-full items-center justify-center text-sm text-destructive">
            {error}
          </div>
        ) : (
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
