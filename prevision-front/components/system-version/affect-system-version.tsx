/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AffectFermeVesrionDto, FermeReadDto } from "@/types"
import  fermeService  from "./../../services/ferme-service"
import { SystemVersionService } from "./../../services/system-version-service"
import { toast } from "sonner"

interface AffectSystemVersionModalProps {
  isOpen: boolean
  onClose: () => void
  systemVersionId: number
  onSuccess: () => void
}

export default function AffectSystemVersionModal({
  isOpen,
  onClose,
  systemVersionId,
  onSuccess,
}: AffectSystemVersionModalProps) {
  const [fermes, setFermes] = useState<FermeReadDto[]>([])
  const [selectedFermes, setSelectedFermes] = useState<FermeReadDto[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingFermes, setLoadingFermes] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadFermes()
    }
  }, [isOpen])

  const loadFermes = async () => {
    try {
      setLoadingFermes(true)
      const data = await fermeService.getAllWithoutSystemVer(systemVersionId)
      setFermes(data)
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de charger les fermes",
      })
    } finally {
      setLoadingFermes(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedFermes.length === 0) {
      toast.error("Erreur", {
        description: "Veuillez sélectionner au moins une ferme",
      })
      return
    }

    try {
      setLoading(true)
      const fermeIds = selectedFermes.map((ferme) => ferme.id)
      const affectRequest : AffectFermeVesrionDto = {SystemId: systemVersionId, FermeId: fermeIds}
      await fermeService.affectSystemVersionToFermes(affectRequest)
      onSuccess()
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible d'affecter le system version aux fermes",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectFerme = (ferme: FermeReadDto) => {
    if (!selectedFermes.find((f) => f.id === ferme.id)) {
      setSelectedFermes([...selectedFermes, ferme])
    }
    setOpen(false)
  }

  const handleRemoveFerme = (fermeId: string) => {
    setSelectedFermes(selectedFermes.filter((f) => f.id !== fermeId))
  }

  const handleClose = () => {
    setSelectedFermes([])
    onClose()
  }

  const availableFermes = fermes.filter((ferme) => !selectedFermes.find((selected) => selected.id === ferme.id))

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Affecter à des fermes</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Sélectionner les fermes</Label>

            {/* Selected Fermes */}
            {selectedFermes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedFermes.map((ferme) => (
                  <Badge key={ferme.id} variant="secondary" className="flex items-center gap-1">
                    {ferme.nom}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-600"
                      onClick={() => handleRemoveFerme(ferme.id)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Ferme Selector */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between bg-transparent"
                  disabled={loadingFermes}
                >
                  {loadingFermes ? "Chargement..." : "Sélectionner une ferme..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Rechercher une ferme..." />
                  <CommandList>
                    <CommandEmpty>Aucune ferme trouvée.</CommandEmpty>
                    <CommandGroup>
                      {availableFermes.map((ferme) => (
                        <CommandItem key={ferme.id} value={ferme.nom} onSelect={() => handleSelectFerme(ferme)}>
                          <Check className={cn("mr-2 h-4 w-4", "opacity-0")} />
                          {ferme.nom}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || selectedFermes.length === 0}>
              {loading ? "Affectation..." : "Affecter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
