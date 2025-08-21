/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, RefreshCw } from "lucide-react"
import { PrevisionCardReadDto, StatutPrevisionDto, TypePrevisionDto } from "@/types"
import PrevisionCard from "./prevision-card"

import { useRouter } from "next/navigation"

interface PrevisionListSharedProps {
  title: string
  description: string
  basePath: string
  fetchData: (filters?: any) => Promise<PrevisionCardReadDto[]>
  showFilters?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

export default function PrevisionListShared({
  title,
  description,
  basePath,
  fetchData,
  showFilters = true,
  autoRefresh = false,
  refreshInterval = 30000,
}: PrevisionListSharedProps) {
  const [previsions, setPrevisions] = useState<PrevisionCardReadDto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<TypePrevisionDto | string>("all")
  const [statutFilter, setStatutFilter] = useState<string>("all")
  const router = useRouter()
  const loadData = async () => {
    try {
      setLoading(true)
      const filters = showFilters
        ? {
            search: searchTerm,
            type: typeFilter !== "all" ? typeFilter : undefined,
            statut: statutFilter !== "all" ? statutFilter : undefined,
          }
        : undefined

      const data = await fetchData(filters)
      setPrevisions(data)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [searchTerm, typeFilter, statutFilter])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  const filteredPrevisions = previsions.filter((prevision) => {
    const matchesSearch = prevision.fermeNom.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || prevision.type === typeFilter
    const matchesStatut = statutFilter === "all" || prevision.statut === statutFilter

    return matchesSearch && matchesType && matchesStatut
  })

  function handleClick(id:number){
    router.push(`${basePath}/${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>
        {autoRefresh && (
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        )}
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom de ferme..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de prévision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value={`${TypePrevisionDto.Journaliere}`}>Journalière</SelectItem>
                  <SelectItem value={`${TypePrevisionDto.Hebdo}`}>Hebdomadaire</SelectItem>
                  <SelectItem value={`${TypePrevisionDto.SixWeeks}`}>Six semaines</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statutFilter} onValueChange={setStatutFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {basePath != "/historique-previsions" && <SelectItem value={`${StatutPrevisionDto.EnAttente}`}>En cours</SelectItem>}
                  <SelectItem value={`${StatutPrevisionDto.Valide}`}>Validé</SelectItem>
                  <SelectItem value={`${StatutPrevisionDto.Annule}`}>Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredPrevisions.length > 0 ? (
          filteredPrevisions.map((prevision) => (
            <PrevisionCard key={prevision.id} prevision={prevision} onClick={()=>handleClick(prevision.id)} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">Aucune prévision trouvée</p>
          </div>
        )}
      </div>
    </div>
  )
}
