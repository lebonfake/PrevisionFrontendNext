/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { Search, Plus, Trash2 } from "lucide-react"
import type { ValidateurReadDto } from "@/types"
import validateurService from "@/services/validateur-service"
import CreateValidateurModal from "./create-validateur-modal"
import { toast } from "@/hooks/use-toast"

export default function ValidateursList() {
  const [validateurs, setValidateurs] = useState<ValidateurReadDto[]>([])
  const [filteredValidateurs, setFilteredValidateurs] = useState<ValidateurReadDto[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [validateurToDelete, setValidateurToDelete] = useState<ValidateurReadDto | null>(null)

  const handleValidateurCreated = (newValidateur: ValidateurReadDto) => {
    setValidateurs([...validateurs, newValidateur])
    toast.success("Succès", {
      description: "Validateur créé avec succès",
    })
  }

  useEffect(() => {
    loadValidateurs()
  }, [])

  useEffect(() => {
    filterValidateurs()
  }, [validateurs, searchTerm])

  const loadValidateurs = async () => {
    setIsLoading(true)
    try {
      const data = await validateurService.getAllValidateurs()
      setValidateurs(data)
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de charger les validateurs",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterValidateurs = () => {
    if (!searchTerm.trim()) {
      setFilteredValidateurs(validateurs)
      return
    }

    const filtered = validateurs.filter(
      (validateur) =>
        validateur.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        validateur.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredValidateurs(filtered)
  }

  const handleDeleteClick = (validateur: ValidateurReadDto) => {
    setValidateurToDelete(validateur)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!validateurToDelete) return

    try {
      await validateurService.deleteValidateur(validateurToDelete.id)
      toast.success("Succès", {
        description: "Validateur supprimé avec succès",
      })
      loadValidateurs()
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de supprimer le validateur",
      })
    } finally {
      setDeleteDialogOpen(false)
      setValidateurToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setValidateurToDelete(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement des validateurs...</div>
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
            placeholder="Rechercher par prénom ou nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau validateur
        </Button>
      </div>

      {/* Liste des validateurs */}
      {filteredValidateurs.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              {searchTerm ? "Aucun validateur trouvé" : "Aucun validateur enregistré"}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredValidateurs.map((validateur) => (
            <Card key={validateur.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>
                    {validateur.firstName} {validateur.lastName}
                  </span>
                  {/*<Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(validateur)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>*/}
                </CardTitle>
              </CardHeader>
            
            </Card>
          ))}
        </div>
      )}

      {/* Modal de création */}
      <CreateValidateurModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onValidateurCreated={handleValidateurCreated}
      />

      {/*<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le validateur{" "}
              <strong>
                {validateurToDelete?.firstName} {validateurToDelete?.lastName}
              </strong>{" "}
              ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
*/}    </div>
  )
}
