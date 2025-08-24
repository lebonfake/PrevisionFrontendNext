import  axiosInstance  from "./axios-instance"
import type { PermissionPrevReadDto,  } from "@/types"

export class PermissionService {
  private static readonly BASE_URL = "/permissionprev"

  static async getAll(): Promise<PermissionPrevReadDto[]> {
    // TODO: Implémenter l'appel API pour récupérer toutes les permissions
    const response = await axiosInstance.get<PermissionPrevReadDto[]>(this.BASE_URL)
    return response.data
  }

  static async getById(id: number): Promise<PermissionPrevReadDto> {
    // TODO: Implémenter l'appel API pour récupérer une permission par ID
    const response = await axiosInstance.get<PermissionPrevReadDto>(`${this.BASE_URL}/${id}`)
    return response.data
  }

 
}
