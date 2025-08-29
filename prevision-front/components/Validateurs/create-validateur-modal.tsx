/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserReadDto, ValidateurCreateDto, ValidateurReadDto } from "@/types"
import userService from "@/services/user-service"
import validateurService from "@/services/validateur-service"
import { toast } from "@/hooks/use-toast"

interface CreateValidateurModalProps {
  isOpen: boolean
  onClose: () => void
  onValidateurCreated: (validateur: ValidateurReadDto) => void
}

export default function CreateValidateurModal({ isOpen, onClose, onValidateurCreated }: CreateValidateurModalProps) {
  const [users, setUsers] = useState<UserReadDto[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [open, setOpen] = useState(false)

  // Charger les utilisateurs quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      loadUsers()
    }
  }, [isOpen])

  const loadUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const usersData = await userService.getNotValidateur()
      setUsers(usersData)
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de charger les utilisateurs",
      })
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedUserId) {
      toast.error("Erreur", {
        description: "Veuillez sélectionner un utilisateur",
      })
      return
    }

    setIsLoading(true)
    try {
      const createDto: ValidateurCreateDto = {
        userId: Number.parseInt(selectedUserId),
      }

      const newValidateur = await validateurService.createValidateur(createDto)

      toast.success("Succès", {
        description: "Validateur créé avec succès",
      })

      onValidateurCreated(newValidateur)
      handleClose()
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de créer le validateur",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedUserId("")
    setOpen(false)
    onClose()
  }

  const selectedUser = users.find((user) => user.id.toString() === selectedUserId)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un nouveau validateur</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="user-select">Utilisateur</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={isLoadingUsers}
                >
                  {selectedUser
                    ? `${selectedUser.firstName} ${selectedUser.lastName}`
                    : isLoadingUsers
                    ? "Chargement des utilisateurs..."
                    : "Sélectionner un utilisateur"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Rechercher par nom complet..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>
                      {isLoadingUsers
                        ? "Chargement..."
                        : "Aucun utilisateur trouvé."}
                    </CommandEmpty>
                    <CommandGroup>
                      {users.map((user) => {
                        const fullName = `${user.firstName} ${user.lastName}`
                        return (
                          <CommandItem
                            key={user.id}
                            value={fullName}
                            onSelect={() => {
                              setSelectedUserId(
                                selectedUserId === user.id.toString()
                                  ? ""
                                  : user.id.toString()
                              )
                              setOpen(false)
                            }}
                          >
                            {fullName}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedUserId === user.id.toString()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !selectedUserId}>
            {isLoading ? "Création..." : "Créer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}