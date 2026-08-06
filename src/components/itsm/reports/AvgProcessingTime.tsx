"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AvgProcessingTime() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Durée moyenne de traitement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">4h 32min</div>
        <p className="text-xs text-muted-foreground mt-1">
          Basé sur les 30 derniers jours
        </p>
      </CardContent>
    </Card>
  )
}
