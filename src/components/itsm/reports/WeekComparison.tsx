"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { reportService } from "@/services/report.service"

export function WeekComparison() {
  const [weekN, setWeekN] = useState<number | null>(null)
  const [weekNMinus1, setWeekNMinus1] = useState<number | null>(null)
  const [evolution, setEvolution] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const raw = await reportService.getLastTwoWeeks()
        if (!cancelled) {
          const [n, nMinus1] = raw.entries
          setWeekN(n.count)
          setWeekNMinus1(nMinus1.count)
          setEvolution(raw.ticketCountEvolution)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "LOAD_FAILED")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparaison semaine N vs semaine N-1</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Chargement...</div>
        </CardContent>
      </Card>
    )
  }

  if (error || weekN === null || weekNMinus1 === null || evolution === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparaison semaine N vs semaine N-1</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-sm text-destructive">{error || "Données indisponibles"}</div>
        </CardContent>
      </Card>
    )
  }

  const isUp = evolution > 0
  const isDown = evolution < 0
  const isNeutral = evolution === 0

  const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus
  const colorClass = isUp
    ? "text-emerald-600"
    : isDown
      ? "text-red-600"
      : "text-muted-foreground"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison semaine N vs semaine N-1</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Semaine N</div>
          <div className="text-2xl font-semibold">{weekN}</div>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${colorClass}`}>
          <Icon className="h-4 w-4" />
          {isNeutral ? "0%" : `${Math.abs(evolution).toFixed(1)}%`}
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Semaine N-1</div>
          <div className="text-2xl font-semibold">{weekNMinus1}</div>
        </div>
      </CardContent>
    </Card>
  )
}
