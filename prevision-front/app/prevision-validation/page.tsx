/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, CheckCircle } from "lucide-react"
import PrevisionCard from "@/components/prevision/prevision-card"
import type { PrevisionCardReadDto } from "@/types"
import { PrevisionValidationService } from "@/services/prevision-validation-service"
import { toast } from "sonner"

export default function PrevisionValidationPage() {
  const [previsions, setPrevisions] = useState<PrevisionCardReadDto[]>([])
  const [filteredPrevisions, setFilteredPrevisions] = useState<PrevisionCardReadDto[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadPrevisions()
  }, [])

  useEffect(() => {
    filterPrevisions()
  }, [searchTerm, previsions])

  const loadPrevisions = async () => {
    try {
      setLoading(true)
      const data = await PrevisionValidationService.getPrevisionsPendingValidation()
   
      setPrevisions(data)
    } catch (error) {
      toast.error("Erreur lors du chargement des prévisions")
    } finally {
      setLoading(false)
    }
  }

  const filterPrevisions = () => {
    if (!searchTerm) {
      setFilteredPrevisions(previsions)
      return
    }

    const filtered = previsions.filter(
      (prevision) =>
        prevision.fermeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prevision.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prevision.creeParUserName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredPrevisions(filtered)
  }

  const handleCardClick = (previsionId: number) => {
    router.push(`/prevision-validation/${previsionId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des prévisions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Prévisions à valider</h1>
          <p className="text-gray-600">Gérez et validez les prévisions en attente</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par ferme, type ou créateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
           
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">{filteredPrevisions.length} prévision(s) trouvée(s)</p>
        </div>

        {/* Previsions Grid */}
        {filteredPrevisions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CheckCircle className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune prévision à valider</h3>
            <p className="text-gray-600">
              {searchTerm ? "Aucun résultat pour votre recherche." : "Toutes les prévisions sont à jour."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrevisions.map((prevision) => (
              <PrevisionCard key={prevision.id} prevision={prevision} onClick={() => handleCardClick(prevision.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
