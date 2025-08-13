"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserReadDto, ValidateurCreateDto, ValidateurReadDto } from "@/types"
import userService from "@/services/user-service"
import validateurService from "@/services/validateur-service"
import { toast } from "@/hooks/use-toast"

interface CreateValidateurModalProps {
  isOpen: boolean
  onClose: () => void
  onValidateurCreated: (validateur : ValidateurReadDto) => void
}

export default function CreateValidateurModal({ isOpen, onClose, onValidateurCreated }: CreateValidateurModalProps) {
  const [users, setUsers] = useState<UserReadDto[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  // Charger les utilisateurs quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      loadUsers()
    }
  }, [isOpen])

  const loadUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const usersData = await userService.getAllUsers()
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
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un nouveau validateur</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="user-select">Utilisateur</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={isLoadingUsers}>
              <SelectTrigger>
                <SelectValue
                  placeholder={isLoadingUsers ? "Chargement des utilisateurs..." : "Sélectionner un utilisateur"}
                />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
