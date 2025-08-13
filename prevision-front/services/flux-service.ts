import  axiosInstance  from "./axios-instance"
import type { FluxCreateDto, FluxReadDto } from "@/types"

export class FluxService {
  private static readonly BASE_URL = "/flux"

  static async getAll(): Promise<FluxReadDto[]> {
    // TODO: Implémenter l'appel API pour récupérer tous les flux
    const response = await axiosInstance.get<FluxReadDto[]>(this.BASE_URL)
    return response.data
  }

  static async getById(id: number): Promise<FluxReadDto> {
    // TODO: Implémenter l'appel API pour récupérer un flux par ID
    const response = await axiosInstance.get<FluxReadDto>(`${this.BASE_URL}/${id}`)
    return response.data
  }

  static async create(flux: FluxCreateDto): Promise<FluxReadDto> {
    // TODO: Implémenter l'appel API pour créer un flux
    const response = await axiosInstance.post<FluxReadDto>(this.BASE_URL, flux)
    return response.data
  }

  static async update(id: number, flux: Partial<FluxCreateDto>): Promise<FluxReadDto> {
    // TODO: Implémenter l'appel API pour mettre à jour un flux
    const response = await axiosInstance.put<FluxReadDto>(`${this.BASE_URL}/${id}`, flux)
    return response.data
  }

  static async delete(id: number): Promise<void> {
    // TODO: Implémenter l'appel API pour supprimer un flux
    await axiosInstance.delete(`${this.BASE_URL}/${id}`)
  }
}
