/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, Building2 } from "lucide-react"
import type { SystemVersionReadDto } from "@/types"
import { SystemVersionService } from "./../../services/system-version-service"
import { toast } from "sonner"
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
import CreateSystemVersionModal from "./create-system-version"
import AffectSystemVersionModal from "./affect-system-version"

const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

export default function SystemVersionList() {
  const [systemVersions, setSystemVersions] = useState<SystemVersionReadDto[]>([])
  const [filteredSystemVersions, setFilteredSystemVersions] = useState<SystemVersionReadDto[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedSystemVersionId, setSelectedSystemVersionId] = useState<number | null>(null)
  const [isAffectModalOpen, setIsAffectModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSystemVersions()
  }, [])

  useEffect(() => {
    const filtered = systemVersions.filter((systemVersion) =>
      systemVersion.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredSystemVersions(filtered)
  }, [systemVersions, searchTerm])

  const loadSystemVersions = async () => {
    try {
      setLoading(true)
      const data = await SystemVersionService.getAllSystemVersions()
      setSystemVersions(data)
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de charger les system versions",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    try {
      await SystemVersionService.deleteSystemVersion(id)
      setSystemVersions((prev) => prev.filter((sv) => sv.id !== id))
      toast.success("Succès", {
        description: "SystemVersion supprimé avec succès",
      })
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de supprimer le system version",
      })
    }
  }

  const handleCreateSuccess = (newSystemVersion: SystemVersionReadDto) => {
    console.log(newSystemVersion);
    
    setSystemVersions((prev) => [...prev, newSystemVersion])
    setIsCreateModalOpen(false)
    toast.success("Succès", {
      description: "SystemVersion créé avec succès",
    })
  }

  const handleAffectClick = (systemVersionId: number) => {
    setSelectedSystemVersionId(systemVersionId)
    setIsAffectModalOpen(true)
  }

  const handleAffectSuccess = () => {
    setIsAffectModalOpen(false)
    setSelectedSystemVersionId(null)
    toast.success("Succès", {
      description: "SystemVersion affecté aux fermes avec succès",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">SystemVersions</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer SystemVersion
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* System Versions List */}
      <div className="grid gap-4">
        {filteredSystemVersions.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-gray-500">
                {searchTerm ? "Aucun system version trouvé" : "Aucun system version disponible"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSystemVersions.map((systemVersion) => (
            <Card key={systemVersion.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{systemVersion.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAffectClick(systemVersion.id)}
                      className="flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4" />
                      Affecter à une ferme
                    </Button>
                    {/*<AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer le system version &quot;{systemVersion.name}&quot; ? Cette action
                            est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(systemVersion.id, systemVersion.name)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>*/}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Versions ({systemVersion.versionReadDtos ? systemVersion.versionReadDtos.length : 0})</h4>
                    <div className="grid gap-2">
                      {systemVersion.versionReadDtos.map((version) => (
                        <div key={version.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{version.name}</span>
                          <div className="flex gap-2">
                            <Badge variant="outline">
                              {dayNames[version.startDay]} - {dayNames[version.endDay]}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modals */}
      <CreateSystemVersionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {selectedSystemVersionId && (
        <AffectSystemVersionModal
          isOpen={isAffectModalOpen}
          onClose={() => {
            setIsAffectModalOpen(false)
            setSelectedSystemVersionId(null)
          }}
          systemVersionId={selectedSystemVersionId}
          onSuccess={handleAffectSuccess}
        />
      )}
    </div>
  )
}
