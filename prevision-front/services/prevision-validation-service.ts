import type { PrevisionCardReadDto, PrevisionReadDto, ValidatePrevisionRequestDto } from "@/types"
import axiosInstance from "./axios-instance";

export class PrevisionValidationService {
  // Récupérer les prévisions à valider
  static async getPrevisionsPendingValidation(): Promise<PrevisionCardReadDto[]> {
    try {
       const response = await axiosInstance.get('/previsions/prevision-a-valider');
       return response.data;

      // Mock data pour les tests
     /* const mockdata : PrevisionCardReadDto[] = [{
          id: 1,
          date: "2024-01-15",
          type: "journaliere",
          fermeId: "F001",
          fermeNom: "Ferme du Nord",
          creeParUserId: 1,
          creeParUserName: "Jean Dupont",
          statut: "en_attente",
          totale: 125.5,
          fluxId:1,
          fluxNom:"1",
          versionId : 1,
          versionName : "hh"

          
         
        }]
      return mockdata*/
    } catch (error) {
      console.error("Erreur lors de la récupération des prévisions:", error)
      throw error
    }
  }

  // Récupérer une prévision par ID
  static async getPrevisionById(id: number): Promise<PrevisionReadDto | null> {
    try {
       const response = await axiosInstance.get(`/previsions/${id}`);
       return response.data;

 
    } catch (error) {
      console.error("Erreur lors de la récupération de la prévision:", error)
      throw error
    }
  }

  // Valider une prévision
  static async validatePrevision(request: ValidatePrevisionRequestDto): Promise<void> {
    try {
       await axiosInstance.patch(`/etapesPrev/valider`,request);
      
    } catch (error) {
      console.error("Erreur lors de la validation:", error)
      throw error
    }
  }

  // Annuler une prévision
  static async cancelPrevision(id: number): Promise<void> {
    try {
       await axiosInstance.patch(`/previsions/annuler/${id}`);
      console.log(`Prévision ${id} annulée`)
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error)
      throw error
    }
  }

  // Modifier une ligne de prévision
  /*static async updateLignePrevision(ligneId: number, valeur: number): Promise<void> {
    try {
      // await axiosInstance.put(`/lignes-prevision/${ligneId}`, { valeur });
      console.log(`Ligne ${ligneId} mise à jour avec la valeur ${valeur}`)
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      throw error
    }
  }*/
}
