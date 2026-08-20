"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { reportService } from "@/services/report.service"

const formatHours = (hours: number): string => {
  const wholeHours = Math.floor(hours)
  const minutes = Math.round((hours - wholeHours) * 60)
  if (wholeHours === 0) {
    return `${minutes}min`
  }
  if (minutes === 0) {
    return `${wholeHours}h`
  }
  return `${wholeHours}h ${minutes}min`
}

const getLast30DaysRange = (): { from: string; to: string } => {
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const format = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  return {
    from: format(thirtyDaysAgo),
    to: format(today),
  }
}

export function AvgProcessingTime() {
  const [meanTime, setMeanTime] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [from, setFrom] = useState<string>(getLast30DaysRange().from)
  const [to, setTo] = useState<string>(getLast30DaysRange().to)

  const load = async (selectedFrom: string, selectedTo: string) => {
    setLoading(true)
    setError(null)

    try {
      const value = await reportService.getMeanResolutionTime(selectedFrom, selectedTo)
      setMeanTime(value)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Durée moyenne de traitement</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[80px] w-full items-center justify-center text-sm text-muted-foreground">
            Chargement...
          </div>
        ) : error ? (
          <div className="flex h-[80px] w-full items-center justify-center text-sm text-destructive">
            {error}
          </div>
        ) : (
          <>
            <div className="text-4xl font-bold">
              {meanTime !== null ? formatHours(meanTime) : "-"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Basé sur la période sélectionnée
            </p>
          </>
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
