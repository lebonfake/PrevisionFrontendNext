/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TagService } from "@/services/tag-service"
import type { TagCreateDto } from "@/types"
import { toast } from "sonner"
import { Plus } from "lucide-react"

interface CreateTagModalProps {
  onTagCreated: () => void
}

export function CreateTagModal({ onTagCreated }: CreateTagModalProps) {
  const [open, setOpen] = useState(false)
  const [tagName, setTagName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tagName.trim()) {
      toast.error("Erreur", {
        description: "Le nom du tag est requis",
      })
      return
    }

    setIsLoading(true)
    try {
      const tagData: TagCreateDto = {
        tag: tagName.trim(),
      }

      await TagService.createTag(tagData)

      toast.success("Succès", {
        description: "Tag créé avec succès",
      })

      setTagName("")
      setOpen(false)
      onTagCreated()
    } catch (error) {
      toast.error("Erreur", {
        description: "Erreur lors de la création du tag",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer un tag
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau tag</DialogTitle>
          <DialogDescription>Ajoutez un nouveau tag pour organiser vos données.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tagName">Nom du tag</Label>
              <Input
                id="tagName"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Entrez le nom du tag"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
