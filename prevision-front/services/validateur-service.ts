/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ValidateurCreateDto, ValidateurReadDto , ValidateurPermissionResponse} from "@/types"
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

   async getValidateurPermissionsPrev(etapePrevId : number) : Promise<ValidateurPermissionResponse>{
    
    try{
      const response =  await axiosInstance.get<ValidateurPermissionResponse>(`${this.baseUrl}/permissions/${etapePrevId}`)
      console.log("service : ",response);
      
    return response.data
    }
    catch(err)
    {
      throw err
    }
  }
  async toggleValidateur(validateurId : number) {
      try{
          const response =  await axiosInstance.get(`${this.baseUrl}/toggle/${validateurId}`)
          return response

      }
      catch(err)
      {
        throw err
      }
  }
}

export default new ValidateurService()
