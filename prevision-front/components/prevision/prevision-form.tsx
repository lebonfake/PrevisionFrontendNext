/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import  FermeService  from "@/services/ferme-service"
import { SecteurService } from "@/services/secteur-service"
import { CycleService } from "@/services/cycle-service"
import { SystemVersionService } from "@/services/system-version-service"
import { PrevisionService } from "@/services/prevision-service"
import type {
  FermeReadDto,
  SecteurReadDto,
  CycleReadDto,
  SystemVersionReadDto,
  TypePrevision,
  PrevisionFormData,
  PrevisionCreateDto,
  TypePrevisionDto,
  PrevisionDetailsCreateDto,
  LignePrevisionCreateDto,
  StatutPrevisionDto,
} from "@/types"
import { getCurrentDate, getWeeksInYear, getWeekDates, formatDate, getNext6WeeksSundays ,getWeeksRangeBasedOnDay} from "@/utils/date-helper"
import { toast } from "sonner"

export default function PrevisionForm() {
  const [fermes, setFermes] = useState<FermeReadDto[]>([])
  const [secteurs, setSecteurs] = useState<SecteurReadDto[]>([])
  const [cycles, setCycles] = useState<CycleReadDto[]>([])
  const [versions, setVersions] = useState<SystemVersionReadDto>([])
  const [weeks, setWeeks] = useState<number[]>([])
  const [gridDates, setGridDates] = useState<Date[]>([])
  const [loading, setLoading] = useState(false)
  const [gridValues, setGridValues] = useState<Record<string, number>>({})

  const [formData, setFormData] = useState<PrevisionFormData>({
    fermeId: null,
    cycleId: null,
    typePrevision: null,
    semaine: undefined,
    versionId: undefined,
  })

  useEffect(() => {
    loadFermes()
  }, [])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const yearWeeks = getWeeksRangeBasedOnDay()
    setWeeks(yearWeeks)
  }, [])

  const loadFermes = async () => {
    try {
      setLoading(true)
      //to do bdl get user id from auth context and put it here 
      const data = await FermeService.getAllFermesForUser(1)
      setFermes(data)
 
    } catch (error) {
      toast.error("Erreur lors du chargement des fermes")
    } finally {
      setLoading(false)
    }
  }

  const handleFermeChange = async (fermeId: string) => {
    const id = fermeId
    setFormData((prev) => ({ ...prev, fermeId: id, cycleId: null, typePrevision: null }))
    setGridDates([])
    setGridValues({})

    try {
      setLoading(true)
      const [secteursData, cyclesData] = await Promise.all([
        SecteurService.getSecteursByFerme(id),
        CycleService.getCyclesByFerme(id),
      ])
      setSecteurs(secteursData)
      setCycles(cyclesData)
    } catch (error) {
      toast.error("Erreur lors du chargement des données de la ferme")
    } finally {
      setLoading(false)
    }
  }

  const handleCycleChange = (cycleId: string) => {
    setFormData((prev) => ({ ...prev, cycleId: Number.parseInt(cycleId), typePrevision: null }))
    setGridDates([])
    setGridValues({})
  }

  const handleTypePrevisionChange = (type: TypePrevision) => {
    setFormData((prev) => ({ ...prev, typePrevision: type, semaine: undefined, versionId: undefined }))
    setGridDates([])
    setGridValues({})

    if (type === "journaliere") {
      const date = getCurrentDate()
      setGridDates([date])
    } else if (type === "hebdomadaire") {
      loadVersions()
    } else if (type === "six_weeks") {
      const sundays = getNext6WeeksSundays()
      setGridDates(sundays)
    }
  }

  const loadVersions = async () => {
    try {
      setLoading(true)
      const data : SystemVersionReadDto = await SystemVersionService.getSystemVersionsByFarmId(formData.fermeId)
      setVersions(data)
    } catch (error) {
      toast.error("Erreur lors du chargement des versions")
    } finally {
      setLoading(false)
    }
  }

  const handleSemaineChange = (semaine: string) => {
    const weekNumber = Number.parseInt(semaine)
    setFormData((prev) => ({ ...prev, semaine: weekNumber, versionId: undefined }))
    setGridDates([])
    setGridValues({}) // Clear grid values when week changes
  }

  const handleVersionChange = (versionId: string) => {
    const id = Number.parseInt(versionId)
    setFormData((prev) => ({ ...prev, versionId: id }))

    if (formData.semaine) {
      const version = versions.versionReadDtos.find((v) => v.id === id)
      if (version) {
        const versionData = version
        const currentYear = new Date().getFullYear()
        console.log("Semaine sélectionnée:", formData.semaine);
        
        const weekDates = getWeekDates(currentYear, formData.semaine)
        const filteredDates = weekDates.slice(versionData.startDay, versionData.endDay + 1)
        console.log("Dates filtrées:", filteredDates);
        
        setGridDates(filteredDates)
      }
    }
  }

  const shouldShowGrid = () => {
    if (formData.typePrevision === "journaliere") {
      return formData.fermeId && formData.cycleId && secteurs.length > 0
    }
    if (formData.typePrevision === "hebdomadaire") {
      return formData.fermeId && formData.cycleId && formData.semaine && formData.versionId && secteurs.length > 0
    }
    if (formData.typePrevision === "six_weeks") {
      return formData.fermeId && formData.cycleId && secteurs.length > 0
    }
    return false
  }

  const getNextStepMessage = () => {
    if (!formData.fermeId) return "Veuillez sélectionner une ferme"
    if (!formData.cycleId) return "Veuillez sélectionner un cycle"
    if (!formData.typePrevision) return "Veuillez sélectionner un type de prévision"
    if (formData.typePrevision === "hebdomadaire" && !formData.semaine) return "Veuillez sélectionner une semaine"
    if (formData.typePrevision === "hebdomadaire" && !formData.versionId) return "Veuillez sélectionner une version"
    return null
  }

  const handleGridValueChange = (secteurCode: number, dateIndex: number, value: string) => {
    const key = `${secteurCode}-${dateIndex}`
    const numValue = value === "" ? 0 : Number.parseFloat(value) || 0
    setGridValues((prev) => ({ ...prev, [key]: numValue }))
  }

  const mapTypePrevisionToDto = (type: TypePrevision): number => {
    switch (type) {
      case "journaliere":
        return 0
      case "hebdomadaire":
        return 1
      case "six_weeks":
        return 2
      default:
        return 0
    }
  }

  const handleSave = async () => {
    if (!formData.fermeId || !formData.cycleId || !formData.typePrevision) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      setLoading(true)
      
      const details: PrevisionDetailsCreateDto[] = secteurs.map((secteur) => {
        const lignesPrevision: LignePrevisionCreateDto[] = gridDates.map((date, dateIndex) => {
          const key = `${secteur.code}-${dateIndex}`
          const valeur = gridValues[key] || 0
          return {
            valeur,
            date: date.toISOString().split("T")[0],
          }
        })

        return {
          secteurId: secteur.code,
          cycleId: formData.cycleId!,
          lignesPrevision,
        }
      })

      const previsionData: PrevisionCreateDto = {
        date: new Date().toISOString().split("T")[0],
        type: mapTypePrevisionToDto(formData.typePrevision),
        fermeId: formData.fermeId.toString(),
        details,
        versionId: formData.versionId || 0,
      }

      const response = await PrevisionService.createPrevision(previsionData)
      console.log(response);

      toast.success("Prévision sauvegardée avec succès")

      setFormData({
        fermeId: null,
        cycleId: null,
        typePrevision: null,
        semaine: undefined,
        versionId: undefined,
      })
      setGridValues({})
      setGridDates([])
      setSecteurs([])
      setCycles([])
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      toast.error("Erreur lors de la sauvegarde de la prévision")
    } finally {
      setLoading(false)
    }
  }

  const renderGrid = () => {
    if (!shouldShowGrid() || gridDates.length === 0) return null

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Grille de Prévision</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-50">Secteur</th>
                  {gridDates.map((date, index) => (
                    <th key={index} className="border border-gray-300 p-2 bg-gray-50">
                      {formatDate(date)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {secteurs.map((secteur) => (
                  <tr key={secteur.code}>
                    <td className="border border-gray-300 p-2 font-medium">{secteur.designation}</td>
                    {gridDates.map((_, dateIndex) => (
                      <td key={dateIndex} className="border border-gray-300 p-2">
                        <input
                          type="number"
                          className="w-full p-1 border rounded"
                          placeholder="0"
                          value={gridValues[`${secteur.code}-${dateIndex}`] || ""}
                          onChange={(e) => handleGridValueChange(secteur.code, dateIndex, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Créer une Prévision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ferme">Ferme</Label>
            <Select value={formData.fermeId?.toString() || ""} onValueChange={handleFermeChange} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une ferme" />
              </SelectTrigger>
              <SelectContent>
                {fermes.map((ferme) => (
                  <SelectItem key={ferme.id} value={ferme.id?.toString() || ""}>
                    {ferme.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.fermeId && (
            <div className="space-y-2">
              <Label htmlFor="cycle">Cycle</Label>
              <Select value={formData.cycleId?.toString() || ""} onValueChange={handleCycleChange} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un cycle" />
                </SelectTrigger>
                <SelectContent>
                  {cycles.map((cycle) => (
                    <SelectItem key={cycle.codeCycle} value={cycle.codeCycle?.toString() || ""}>
                      {cycle.designation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.cycleId && (
            <div className="space-y-2">
              <Label htmlFor="typePrevision">Type de Prévision</Label>
              <Select value={formData.typePrevision || ""} onValueChange={(value) => handleTypePrevisionChange(value as TypePrevision)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="journaliere">Journalière</SelectItem>
                  <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                  <SelectItem value="six_weeks">Six Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.typePrevision === "hebdomadaire" && (
            <div className="space-y-2">
              <Label htmlFor="semaine">Semaine de l&apos;année</Label>
              <Select value={formData.semaine?.toString() || ""} onValueChange={handleSemaineChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une semaine" />
                </SelectTrigger>
                <SelectContent>
                  {weeks.map((week) => (
                    <SelectItem key={week} value={week?.toString() || ""}>
                      Semaine {week}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.typePrevision === "hebdomadaire" && formData.semaine && (
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Select value={formData.versionId?.toString() || ""} onValueChange={handleVersionChange} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une version" />
                </SelectTrigger>
                <SelectContent>
                  {versions.versionReadDtos && versions.versionReadDtos.map((version) => (
                    <SelectItem key={version.id} value={version.id?.toString() || ""}>
                      {version.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {getNextStepMessage() && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">{getNextStepMessage()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {renderGrid()}

      {shouldShowGrid() && gridDates.length > 0 && (
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Annuler
          </Button>
        </div>
      )}
    </div>
  )
}