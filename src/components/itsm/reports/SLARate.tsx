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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { classeServiceService } from "@/services/application.service"
import { reportService } from "@/services/report.service"

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

export function SLARate() {
  const [classes, setClasses] = useState<{ idCs: number; libelle: string }[]>([])
  const [selectedClasse, setSelectedClasse] = useState<string | null | undefined>(null)
  const [rate, setRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [from, setFrom] = useState<string>(getCurrentWeekRange().from)
  const [to, setTo] = useState<string>(getCurrentWeekRange().to)

  useEffect(() => {
    classeServiceService.getAll().then((data) => {
      setClasses(data.map((c) => ({ idCs: c.idCs, libelle: c.libelle })))
    })
  }, [])

  const load = async (selectedFrom: string, selectedTo: string, idClasseService?: string | null) => {
    setLoading(true)
    setError(null)

    try {
      const value = await reportService.getSlaCompliance(
        selectedFrom,
        selectedTo,
        idClasseService ? Number(idClasseService) : undefined
      )
      setRate(value)
    } catch (err) {
      setError(err instanceof Error ? err.message : "LOAD_FAILED")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(from, to, selectedClasse)
  }, [])

  const handleApply = () => {
    load(from, to, selectedClasse)
  }

  const selectedLabel = useMemo(() => {
    // if (selectedClasse === "all") return "Toutes"
    const found = classes.find((c) => String(c.idCs) === selectedClasse)
    return found?.libelle ?? "Toutes"
  }, [selectedClasse, classes])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Taux de respect du SLA</CardTitle>
        <Select value={selectedClasse} onValueChange={(value) => {
          setSelectedClasse(value)
          load(from, to, value)
        }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Classe de service">
              {selectedLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem>Toutes</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c.idCs} value={String(c.idCs)}>
                {c.libelle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            <div className="text-4xl font-bold">{rate !== null ? `${rate}%` : "-"}</div>
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
