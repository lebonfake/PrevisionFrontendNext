import  axiosInstance  from "./axios-instance"
import type { PrevisionCreateDto } from "@/types"

export class PrevisionService {
  static async createPrevision(prevision: PrevisionCreateDto): Promise<void> {
    try {
      await axiosInstance.post("/api/previsions", prevision)
    } catch (error) {
      console.error("Erreur lors de la création de la prévision:", error)
      throw error
    }
  }
}
