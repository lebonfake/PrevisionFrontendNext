"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { FermeReadDto } from "@/types"
import { toast } from "sonner"
import fermeService from "./../../services/ferme-service"
import type { AffectFermeDto } from "@/types"

interface AffectFermeModalProps {
  isOpen: boolean
  onClose: () => void
  fluxId: number
  fluxNom: string
  updateCallback : ()=>void
}

export default function AffectFermeModal({ isOpen, onClose, fluxId, fluxNom,updateCallback }: AffectFermeModalProps) {
  const [fermes, setFermes] = useState<FermeReadDto[]>([])
  const [selectedFermes, setSelectedFermes] = useState<FermeReadDto[]>([])
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadFermes()
      setSelectedFermes([])
    }
  }, [isOpen])

  const loadFermes = async () => {
    try {
      setLoading(true)
      // TODO: Remplacer par l'appel API réel
       const data = await fermeService.getAllWithoutFlux(fluxId)
       setFermes(data)
       console.log(data);
       

     
      
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de charger les fermes",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFermeSelect = (ferme: FermeReadDto) => {
    console.log(ferme);
    
    setSelectedFermes((prev) => {
      const isAlreadySelected = prev.some((f) => f.id === ferme.id)
      if (isAlreadySelected) {
        return prev.filter((f) => f.id !== ferme.id)
      } else {
        return [...prev, ferme]
      }
    })
  }

  const handleRemoveFerme = (fermeId: string) => {
    setSelectedFermes((prev) => prev.filter((f) => f.id !== fermeId))
  }

  const handleSubmit = async () => {
    if (selectedFermes.length === 0) {
      toast.error("Erreur", {
        description: "Veuillez sélectionner au moins une ferme",
      })
      return
    }

    try {
      setSubmitting(true)
      const fermeIds = selectedFermes.map((f) => f.id)

      // TODO: Remplacer par l'appel API réel
      const affectFermeDto :AffectFermeDto = {fluxId : fluxId , fermeId : fermeIds}
      console.log(affectFermeDto);
      
       await fermeService.affectFluxToFermes(affectFermeDto)

      toast.success("Succès", {
        description: `Flux "${fluxNom}" affecté à ${selectedFermes.length} ferme${selectedFermes.length > 1 ? "s" : ""}`,
      })

      updateCallback()
      
      onClose()
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible d'affecter le flux aux fermes",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Affecter à une ferme</DialogTitle>
          <DialogDescription>Sélectionnez les fermes auxquelles affecter le flux "{fluxNom}"</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Sélecteur de fermes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Fermes</label>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isPopoverOpen}
                  className="w-full justify-between bg-transparent"
                  disabled={loading}
                >
                  {loading ? "Chargement..." : "Sélectionner des fermes..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Rechercher une ferme..." />
                  <CommandList>
                    <CommandEmpty>Aucune ferme trouvée.</CommandEmpty>
                    <CommandGroup>
                      {fermes.map((ferme) => (
                        <CommandItem key={ferme.id} onSelect={() => handleFermeSelect(ferme)}>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedFermes.some((f) => f.id === ferme.id) ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {ferme.nom}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Fermes sélectionnées */}
          {selectedFermes.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Fermes sélectionnées ({selectedFermes.length})</label>
              <div className="flex flex-wrap gap-2">
                {selectedFermes.map((ferme) => (
                  <Badge
                    key={ferme.id}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => handleRemoveFerme(ferme.id)}
                  >
                    {ferme.nom} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || selectedFermes.length === 0}>
            {submitting ? "Affectation..." : "Affecter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
