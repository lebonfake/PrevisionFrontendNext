/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CycleReadDto } from "@/types"
import axiosInstance from "./axios-instance";
export class CycleService {
  static async getCyclesByFerme(fermeId: string): Promise<CycleReadDto[]> {
    try {
      // TODO: Remplacer par l'appel API réel
      const response = await axiosInstance.get(`/cycles/get-by-farmId/${fermeId}`);
      return response.data;

     
    } catch (error) {
      console.error("Erreur lors du chargement des cycles:", error)
      throw error
    }
  }
}
