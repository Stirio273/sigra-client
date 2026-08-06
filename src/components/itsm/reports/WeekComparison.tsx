"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WeekComparison() {
  const weekN = 248
  const weekNMinus1 = 214
  const evolution = ((weekN - weekNMinus1) / weekNMinus1) * 100
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
