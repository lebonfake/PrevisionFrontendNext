import  axiosInstance  from "./axios-instance"
import type { PrevisionCardReadDto, PrevisionCreateDto, PrevisionGeneralReadDto, PrevisionReadDto } from "@/types"

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

  static async getHistoriquePrevisions() : Promise<PrevisionCardReadDto[]>{

    try{
      const res  = await axiosInstance.get("/previsions/prevision-historique")
      return res.data
    }catch(err){
      console.log(err);
      throw err
    }
  }
  static async getEtatPrevisions() : Promise<PrevisionCardReadDto[]>{

    try{
      const res  = await axiosInstance.get("/previsions/prevision-etat")
      return res.data
    }catch(err){
      console.log(err);
      throw err
    }
  }
  static async getRecuPrevisions() : Promise<PrevisionCardReadDto[]>{

    try{
      const res  = await axiosInstance.get("/previsions/prevision-recu")
      return res.data
    }catch(err){
      console.log(err);
      throw err
    }
  }

  static async getHistoriquePrevisionDetail(previsionId : number) : Promise<PrevisionGeneralReadDto>{

    try{
      const res  = await axiosInstance.get(`/previsions/prevision-detail/${previsionId}`)
      return res.data
    }catch(err){
      console.log(err);
      throw err
    }
  }
}
