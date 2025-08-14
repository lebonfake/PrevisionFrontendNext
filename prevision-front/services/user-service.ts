/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserReadDto } from "@/types"
import axiosInstance from "./axios-instance";
class UserService {
  private readonly baseUrl = "/users"

  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<UserReadDto[]> {
    // TODO: Implémenter l'appel API
     const response = await axiosInstance.get<UserReadDto[]>(this.baseUrl);
     return response.data;
    return []
  }

  // Récupérer un utilisateur par ID
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserById(id: number): Promise<UserReadDto> {
    // TODO: Implémenter l'appel API
    // const response = await axiosInstance.get<UserReadDto>(`${this.baseUrl}/${id}`);
    // return response.data;
    return {} as UserReadDto
  }

  // Rechercher des utilisateurs
  async searchUsers(searchTerm: string): Promise<UserReadDto[]> {
    // TODO: Implémenter l'appel API avec paramètres de recherche
    // const response = await axiosInstance.get<UserReadDto[]>(`${this.baseUrl}/search`, {
    //   params: { searchTerm }
    // });
    // return response.data;
    return []
  }
}

export default new UserService()
