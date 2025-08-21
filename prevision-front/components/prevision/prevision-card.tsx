"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { PrevisionCardReadDto } from "@/types"
import { Calendar, MapPin, Clock, TrendingUp } from "lucide-react"

interface PrevisionCardProps {
  prevision: PrevisionCardReadDto
  onClick: () => void
}

const getTypeBadgeVariant = (type: string) => {
  switch (type.toLowerCase()) {
    case "journaliere":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
    case "hebdomadaire":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    case "six_weeks":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export default function PrevisionCard({ prevision, onClick }: PrevisionCardProps) {
  const progressPercentage =
    prevision.totaleEtape > 0 ? Math.round((prevision.ordreCurrentEtape / prevision.totaleEtape) * 100) : 0

  return (
    <Card
      className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-0 shadow-md bg-white"
      onClick={onClick}
    >
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 mb-1">{prevision.fermeNom}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={`${getTypeBadgeVariant(prevision.type)} border-0 font-medium`}>{prevision.type}</Badge>
              {prevision.type.toLowerCase() === "hebdomadaire" && prevision.versionName && (
                <Badge variant="outline" className="text-xs bg-white/80">
                  {prevision.versionName}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{prevision.totale.toFixed(1)}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">tonnes</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="p-2 bg-blue-50 rounded-full">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{formatDate(prevision.date)}</div>
              <div className="text-xs text-gray-500">Date de prévision</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <div className="p-2 bg-green-50 rounded-full">
              <MapPin className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{prevision.creeParUserName}</div>
              <div className="text-xs text-gray-500">Créé par</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <div className="p-2 bg-purple-50 rounded-full">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium text-gray-900">Progression des étapes</div>
                <div className="text-xs text-gray-500">
                  {prevision.ordreCurrentEtape}/{prevision.totaleEtape}
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-gray-200" />
              {prevision.etapeNom && (
                <div className="text-xs text-gray-500 mt-1">Étape actuelle: {prevision.etapeNom}</div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
              <Clock className="h-3 w-3 mr-1" />
              {prevision.statut.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
