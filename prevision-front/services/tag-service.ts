import type { TagCreateDto, TagReadDto } from "@/types"
import axiosInstance from "./axios-instance"

export class TagService {
  // Données mock pour les tests
  private static mockTags: TagReadDto[] = [
    { id: 1, tag: "Agriculture" },
    { id: 2, tag: "Élevage" },
    { id: 3, tag: "Céréales" },
    { id: 4, tag: "Légumes" },
    { id: 5, tag: "Fruits" },
  ]

  static async getAllTags(): Promise<TagReadDto[]> {
    try {
       const response = await axiosInstance.get<TagReadDto[]>('/tags')
       return response.data

     
    } catch (error) {
      console.error("Erreur lors de la récupération des tags:", error)
      throw error
    }
  }

  static async createTag(tagData: TagCreateDto): Promise<TagReadDto> {
    try {
       const response = await axiosInstance.post<TagReadDto>('/tags', tagData)
       return response.data

      
    } catch (error) {
      console.error("Erreur lors de la création du tag:", error)
      throw error
    }
  }

  static async deleteTag(id: number): Promise<void> {
    try {
       await axiosInstance.delete(`/tags/${id}`)

      
     
    } catch (error) {
      console.error("Erreur lors de la suppression du tag:", error)
      throw error
    }
  }
}
