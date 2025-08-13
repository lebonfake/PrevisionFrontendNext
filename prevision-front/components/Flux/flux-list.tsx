"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Trash2, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { FluxReadDto } from "@/types"
import { toast } from "sonner"
import CreateFluxModal from "./create-flux-modal"
import AffectFermeModal from "./affect-ferme-modal"
import { FluxService } from "@/services/flux-service"
import { Label } from "../ui/label"

export default function FluxList() {
  const [flux, setFlux] = useState<FluxReadDto[]>([])
  const [filteredFlux, setFilteredFlux] = useState<FluxReadDto[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAffectModalOpen, setIsAffectModalOpen] = useState(false)
  const [selectedFluxForAffect, setSelectedFluxForAffect] = useState<{ id: number; nom: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFlux()
  }, [])

  useEffect(() => {
    const filtered = flux.filter((f) => f.nom.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredFlux(filtered)
  }, [flux, searchTerm])

  const loadFlux = async () => {
    try {
      setLoading(true)
      // TODO: Remplacer par l'appel API réel
       const data = await FluxService.getAll()
      setFlux(data)
      console.log(data);
      

      // Données de test temporaires
     
      
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de charger les flux de validation",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, nom: string) => {
    try {
      // TODO: Remplacer par l'appel API réel
      // await FluxService.delete(id)

      setFlux((prev) => prev.filter((f) => f.id !== id))
      toast.success("Succès", {
        description: "Flux supprimé avec succès",
      })
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de supprimer le flux",
      })
    }
  }

  const handleFluxCreated = (newFlux: FluxReadDto) => {
    setFlux((prev) => [...prev, newFlux])
    setIsCreateModalOpen(false)
  }

  const handleAffectToFerme = (fluxId: number, fluxNom: string) => {
    setSelectedFluxForAffect({ id: fluxId, nom: fluxNom })
    setIsAffectModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement des flux...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec recherche et bouton créer */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un flux..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer un flux
        </Button>
      </div>

      {/* Liste des flux */}
      <div className="grid gap-4">
        {filteredFlux.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-gray-500">{searchTerm ? "Aucun flux trouvé" : "Aucun flux de validation créé"}</p>
            </CardContent>
          </Card>
        ) : (
          filteredFlux.map((fluxItem) => (
            <Card key={fluxItem.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{fluxItem.nom}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAffectToFerme(fluxItem.id, fluxItem.nom)}
                    className="flex items-center gap-2"
                  >
                    <Building2 className="h-4 w-4" />
                    Affecter à une ferme
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer le flux "{fluxItem.nom}" ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(fluxItem.id, fluxItem.nom)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {fluxItem.nombreEtapes} étape{fluxItem.nombreEtapes > 1 ? "s" : ""}
                  </Badge>
                </div>
                {fluxItem.fermes.length>0 && <Label className="mt-4  text-xl">Fermes affectées : </Label>}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {fluxItem.fermes.map(item=>(
                        <Badge  key={item.id}>{item.nom}</Badge>
                    ))}
                  </Badge>
                </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de création */}
      <CreateFluxModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onFluxCreated={handleFluxCreated}
      />

      {selectedFluxForAffect && (
        <AffectFermeModal
          isOpen={isAffectModalOpen}
          onClose={() => {
            setIsAffectModalOpen(false)
            setSelectedFluxForAffect(null)
          }}
          fluxId={selectedFluxForAffect.id}
          fluxNom={selectedFluxForAffect.nom}
          updateCallback={loadFlux}
        />
      )}
    </div>
  )
}
