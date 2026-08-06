import TopBar from "@/components/itsm/TopBar"
import { TicketsParSemaine } from "@/components/itsm/reports/TicketsParSemaine"
import { SLARate } from "@/components/itsm/reports/SLARate"
import { AvgProcessingTime } from "@/components/itsm/reports/AvgProcessingTime"
import { RepartitionPlateforme } from "@/components/itsm/reports/RepartitionPlateforme"
import { WeekComparison } from "@/components/itsm/reports/WeekComparison"

export default function Reports() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-full mx-auto">
        <TopBar />
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium">Rapports</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2">
              <TicketsParSemaine />
            </div>
            <WeekComparison />
            <SLARate />
            <AvgProcessingTime />
            <div className="md:col-span-2">
              <RepartitionPlateforme />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
