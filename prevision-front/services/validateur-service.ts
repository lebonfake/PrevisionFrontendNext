import type { ValidateurCreateDto, ValidateurReadDto } from "@/types"
import axiosInstance from "./axios-instance";

class ValidateurService {
  private readonly baseUrl = "/validateurs"

  // Récupérer tous les validateurs
  async getAllValidateurs(): Promise<ValidateurReadDto[]> {
    // TODO: Implémenter l'appel API
     const response = await axiosInstance.get<ValidateurReadDto[]>(this.baseUrl);
     return response.data;
   
  }

  // Créer un nouveau validateur
  async createValidateur(validateur: ValidateurCreateDto): Promise<ValidateurReadDto> {
    // TODO: Implémenter l'appel API
   const response = await axiosInstance.post<ValidateurReadDto>(this.baseUrl, validateur);
    return response.data;
   
  }

  // Supprimer un validateur
  async deleteValidateur(id: number): Promise<void> {
    // TODO: Implémenter l'appel API
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  // Rechercher des validateurs
  async searchValidateurs(searchTerm: string): Promise<ValidateurReadDto[]> {
    // TODO: Implémenter l'appel API avec paramètres de recherche
    // const response = await axiosInstance.get<ValidateurReadDto[]>(`${this.baseUrl}/search`, {
    //   params: { searchTerm }
    // });
    // return response.data;
    return []
  }
}

export default new ValidateurService()
