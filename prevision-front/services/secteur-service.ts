import type { SecteurReadDto } from "@/types"
import axiosInstance from "./axios-instance";

export class SecteurService {
  static async getSecteursByFerme(fermeId: string): Promise<SecteurReadDto[]> {
    try {
      // TODO: Remplacer par l'appel API réel
       const response = await axiosInstance.get(`secteurs/get-by-farmId/${fermeId}`);
      return response.data;

      
    } catch (error) {
      console.error("Erreur lors du chargement des secteurs:", error)
      throw error
    }
  }

   static async getSecteursByFermeAndCycle(fermeId: string,cycleId : number): Promise<SecteurReadDto[]> {
    try {
      // TODO: Remplacer par l'appel API réel
       const response = await axiosInstance.get(`secteurs/get-by-farmId/${fermeId}/cycleId/${cycleId}`);
      return response.data;

      
    } catch (error) {
      console.error("Erreur lors du chargement des secteurs:", error)
      throw error
    }
  }
}
