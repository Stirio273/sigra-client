"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { classeServiceService } from "@/services/application.service"

function deriveRate(idCs: number) {
  return ((idCs * 7 + 13) % 21) + 80
}

export function SLARate() {
  const [classes, setClasses] = useState<{ idCs: number; libelle: string }[]>([])
  const [selectedClasse, setSelectedClasse] = useState<string>("all")

  useEffect(() => {
    classeServiceService.getAll().then((data) => {
      setClasses(data.map((c) => ({ idCs: c.idCs, libelle: c.libelle })))
    })
  }, [])

  const rate = useMemo(() => {
    if (selectedClasse === "all") return 92
    const id = Number(selectedClasse)
    return Number.isNaN(id) ? 92 : deriveRate(id)
  }, [selectedClasse])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Taux de respect du SLA</CardTitle>
        <Select value={selectedClasse} onValueChange={(value) => value && setSelectedClasse(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Classe de service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c.idCs} value={String(c.idCs)}>
                {c.libelle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{rate}%</div>
        <p className="text-xs text-muted-foreground mt-1">
          {selectedClasse === "all"
            ? "Toutes classes de service"
            : classes.find((c) => String(c.idCs) === selectedClasse)?.libelle}
        </p>
      </CardContent>
    </Card>
  )
}
