import  axiosInstance  from "./axios-instance"
import type { PrevisionCreateDto, PrevisionReadDto } from "@/types"

export class PrevisionService {
  static async createPrevision(prevision: PrevisionCreateDto): Promise<PrevisionReadDto> {
    try {
      const res = await axiosInstance.post("/previsions", prevision)
      return res.data
    } catch (error) {
      console.error("Erreur lors de la création de la prévision:", error)
      throw error
    }
  }
}
