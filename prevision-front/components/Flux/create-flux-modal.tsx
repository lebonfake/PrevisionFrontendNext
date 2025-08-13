"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { FluxCreateDto, ValidateurReadDto, PermissionPrevReadDto, FluxReadDto } from "@/types"
import { toast } from "sonner"
import validateurService from "@/services/validateur-service"
import { PermissionService } from "@/services/permission-service"
import { FluxService } from "@/services/flux-service"

interface CreateFluxModalProps {
  isOpen: boolean
  onClose: () => void
  onFluxCreated: (flux: FluxReadDto) => void
}

interface ValidateurPermission {
  validateurId: number
  permissionIds: number[]
}

interface EtapeData {
  nom: string
  validateurs: ValidateurPermission[]
}

export default function CreateFluxModal({ isOpen, onClose, onFluxCreated }: CreateFluxModalProps) {
  const [nom, setNom] = useState("")
  const [nombreEtapes, setNombreEtapes] = useState<number>(1)
  const [etapes, setEtapes] = useState<EtapeData[]>([])
  const [validateurs, setValidateurs] = useState<ValidateurReadDto[]>([])
  const [permissions, setPermissions] = useState<PermissionPrevReadDto[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadData()
      resetForm()
    }
  }, [isOpen])

  useEffect(() => {
    // Initialiser les étapes quand le nombre change
    const newEtapes: EtapeData[] = Array.from({ length: nombreEtapes }, (_, index) => ({
      nom: `Étape ${index + 1}`,
      validateurs: [],
    }))
    setEtapes(newEtapes)
  }, [nombreEtapes])

  const loadData = async () => {
    try {
      const [validateursData, permissionsData] = await Promise.all([
        validateurService.getAllValidateurs(),
        PermissionService.getAll()
      ])
      console.log(permissionsData);
      
      setValidateurs(validateursData)
      setPermissions(permissionsData)
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de charger les données",
      })
    }
  }

  const resetForm = () => {
    setNom("")
    setNombreEtapes(1)
    setEtapes([])
  }

  // Use useCallback to memoize the function and prevent re-creation on every render
  const addValidateurToEtape = useCallback((etapeIndex: number) => {
    console.log("Adding validateur to etape:", etapeIndex);
    
    setEtapes((prevEtapes) => {
      // Create a deep copy to avoid mutation
      const newEtapes = prevEtapes.map((etape, index) => {
        if (index === etapeIndex) {
          return {
            ...etape,
            validateurs: [
              ...etape.validateurs,
              {
                validateurId: 0,
                permissionIds: [],
              }
            ]
          }
        }
        return etape
      })
      
      console.log("New etapes after adding:", newEtapes);
      return newEtapes
    })
  }, [])

  // Use useCallback for remove function as well
  const removeValidateurFromEtape = useCallback((etapeIndex: number, validateurIndex: number) => {
    console.log("Removing validateur:", { etapeIndex, validateurIndex });
    
    setEtapes((prevEtapes) => {
      // Create a deep copy to avoid mutation
      const newEtapes = prevEtapes.map((etape, index) => {
        if (index === etapeIndex) {
          return {
            ...etape,
            validateurs: etape.validateurs.filter((_, vIndex) => vIndex !== validateurIndex)
          }
        }
        return etape
      })
      
      console.log("New etapes after removing:", newEtapes);
      return newEtapes
    })
  }, [])

  const updateValidateur = useCallback((etapeIndex: number, validateurIndex: number, validateurId: number) => {
    setEtapes((prevEtapes) => {
      return prevEtapes.map((etape, eIndex) => {
        if (eIndex === etapeIndex) {
          return {
            ...etape,
            validateurs: etape.validateurs.map((validateur, vIndex) => {
              if (vIndex === validateurIndex) {
                return { ...validateur, validateurId }
              }
              return validateur
            })
          }
        }
        return etape
      })
    })
  }, [])

  const updatePermissions = useCallback((etapeIndex: number, validateurIndex: number, permissionId: number, checked: boolean) => {
    setEtapes((prevEtapes) => {
      return prevEtapes.map((etape, eIndex) => {
        if (eIndex === etapeIndex) {
          return {
            ...etape,
            validateurs: etape.validateurs.map((validateur, vIndex) => {
              if (vIndex === validateurIndex) {
                let newPermissionIds: number[]
                if (checked) {
                  newPermissionIds = validateur.permissionIds.includes(permissionId) 
                    ? validateur.permissionIds 
                    : [...validateur.permissionIds, permissionId]
                } else {
                  newPermissionIds = validateur.permissionIds.filter((id) => id !== permissionId)
                }
                return { ...validateur, permissionIds: newPermissionIds }
              }
              return validateur
            })
          }
        }
        return etape
      })
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nom.trim()) {
      toast.error("Erreur", {
        description: "Le nom du flux est requis",
      })
      return
    }

    // Validation des étapes
    for (let i = 0; i < etapes.length; i++) {
      const etape = etapes[i]
      if (etape.validateurs.length === 0) {
        toast.error("Erreur", {
          description: `L'étape ${i + 1} doit avoir au moins un validateur`,
        })
        return
      }

      for (let j = 0; j < etape.validateurs.length; j++) {
        const validateur = etape.validateurs[j]
        if (validateur.validateurId === 0) {
          toast.error("Erreur", {
            description: `Veuillez sélectionner un validateur pour l'étape ${i + 1}`,
          })
          return
        }
        if (validateur.permissionIds.length === 0) {
          toast.error("Erreur", {
            description: `Veuillez sélectionner au moins une permission pour chaque validateur de l'étape ${i + 1}`,
          })
          return
        }
      }
    }

    try {
      setLoading(true)

      const fluxData: FluxCreateDto = {
        nom: nom.trim(),
        etapeFluxs: etapes.map((etape, index) => ({
          ordre: index + 1,
          nom: etape.nom,
          EtapeFluxValidateurPermissionLinks: etape.validateurs.flatMap((validateur) =>
            validateur.permissionIds.map((permissionId) => ({
              validateurId: validateur.validateurId,
              permissionPrevId: permissionId,
            })),
          ),
        })),
      }

      // TODO: Remplacer par l'appel API réel
      console.log(fluxData);
      
     const createdFlux = await FluxService.create(fluxData)

     

      onFluxCreated(createdFlux)
      toast.success("Succès", {
        description: "Flux créé avec succès",
      })
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de créer le flux",
      })
    } finally {
      setLoading(false)
    }
  }

  const getValidateurName = (id: number) => {
    const validateur = validateurs.find((v) => v.id === id)
    return validateur ? `${validateur.firstName} ${validateur.lastName}` : ""
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un flux de validation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Configuration de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du flux</Label>
              <Input
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Entrez le nom du flux"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombreEtapes">Nombre d&apos;étapes</Label>
              <Select
                value={nombreEtapes.toString()}
                onValueChange={(value) => setNombreEtapes(Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} étape{num > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Configuration des étapes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configuration des étapes</h3>

            {etapes.map((etape, etapeIndex) => (
              <Card key={etapeIndex}>
                <CardHeader>
                  <CardTitle className="text-base">{etape.nom}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Liste des validateurs pour cette étape */}
                  {etape.validateurs.map((validateur, validateurIndex) => (
                    <div key={`${etapeIndex}-${validateurIndex}`} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Validateur {validateurIndex + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeValidateurFromEtape(etapeIndex, validateurIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Sélection du validateur */}
                      <div className="space-y-2">
                        <Label>Sélectionner un validateur</Label>
                        <Select
                          value={validateur.validateurId.toString()}
                          onValueChange={(value) =>
                            updateValidateur(etapeIndex, validateurIndex, Number.parseInt(value))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un validateur" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0" disabled>
                              Choisir un validateur
                            </SelectItem>
                            {validateurs.map((v) => (
                              <SelectItem key={v.id} value={v.id.toString()}>
                                {v.firstName} {v.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sélection des permissions */}
                      {validateur.validateurId > 0 && (
                        <div className="space-y-2">
                          <Label>Permissions pour {getValidateurName(validateur.validateurId)}</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {permissions.map((permission) => (
                              <div key={permission.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`permission-${etapeIndex}-${validateurIndex}-${permission.id}`}
                                  checked={validateur.permissionIds.includes(permission.id)}
                                  onCheckedChange={(checked) =>
                                    updatePermissions(etapeIndex, validateurIndex, permission.id, checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor={`permission-${etapeIndex}-${validateurIndex}-${permission.id}`}
                                  className="text-sm"
                                >
                                  {permission.permissions}
                                </Label>
                              </div>
                            ))}
                          </div>
                          {validateur.permissionIds.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {validateur.permissionIds.map((permId) => {
                                const perm = permissions.find((p) => p.id === permId)
                                return perm ? (
                                  <Badge key={permId} variant="secondary" className="text-xs">
                                    {perm.permissions}
                                  </Badge>
                                ) : null
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}


                  {/* Bouton ajouter validateur */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addValidateurToEtape(etapeIndex)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un validateur
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}