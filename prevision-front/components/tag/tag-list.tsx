/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { TagService } from "@/services/tag-service"
import type { TagReadDto } from "@/types"
import { toast } from "sonner"
import { Search, Trash2, Tag } from "lucide-react"

interface TagsListProps {
  refreshTrigger: number
}

export function TagsList({ refreshTrigger }: TagsListProps) {
  const [tags, setTags] = useState<TagReadDto[]>([])
  const [filteredTags, setFilteredTags] = useState<TagReadDto[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const loadTags = async () => {
    try {
      setIsLoading(true)
      const data = await TagService.getAllTags()
      setTags(data)
      setFilteredTags(data)
    } catch (error) {
      toast.error("Erreur", {
        description: "Erreur lors du chargement des tags",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTags()
  }, [refreshTrigger])

  useEffect(() => {
    const filtered = tags.filter((tag) => tag.tag.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredTags(filtered)
  }, [searchTerm, tags])

  const handleDelete = async (id: number, tagName: string) => {
    try {
      await TagService.deleteTag(id)
      toast.success("Succès", {
        description: `Tag "${tagName}" supprimé avec succès`,
      })
      loadTags()
    } catch (error) {
      toast.error("Erreur", {
        description: "Erreur lors de la suppression du tag",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Chargement des tags...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher un tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Liste des tags */}
      {filteredTags.length === 0 ? (
        <div className="text-center py-8">
          <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{searchTerm ? "Aucun tag trouvé" : "Aucun tag"}</h3>
          <p className="text-gray-500">
            {searchTerm ? "Essayez de modifier votre recherche" : "Commencez par créer votre premier tag"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTags.map((tag) => (
            <Card key={tag.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-blue-600" />
                    <span className="truncate">{tag.tag}</span>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer le tag</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer le tag &quot;{tag.tag}&quot; ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(tag.id, tag.tag)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardTitle>
              </CardHeader>
              
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
