/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosInstance from "./axios-instance"
import type { FermeReadDto } from "@/types"
import type { AffectFermeDto } from "@/types";
import type { AffectFermeVesrionDto } from "@/types";

class FermeService {
  // Récupérer toutes les fermes
  async getAllWithoutFlux(id:number): Promise<FermeReadDto[]> {
    const response = await axiosInstance.get(`/fermes/without-flux/${id}`)
    console.log(response.data);
    
    return response.data
  }

   async getAllWithoutSystemVer(id:number): Promise<FermeReadDto[]> {
    const response = await axiosInstance.get(`/fermes/without-system/${id}`)
    console.log(response.data);
    
    return response.data
  }

  // Affecter un flux à des fermes
  async affectFluxToFermes(affecteFermeDto : AffectFermeDto): Promise<void> {
    try{

        await axiosInstance.post(`/fermes/affecter-fermes`, affecteFermeDto )
    }
    catch(err){
        console.log(err);
        
    }
  }
   // Affecter un system version à des fermes
   async affectSystemVersionToFermes(affectFermeVesrionDto:AffectFermeVesrionDto): Promise<void> {
    // TODO: Replace with actual API call
     await axiosInstance.post(`/fermes/affecter-fermes-systemver`,affectFermeVesrionDto)
  }


    async getAllFermesForUser(userId:number): Promise<FermeReadDto[]> {
    // TODO: Replace with actual API call
     const response = await axiosInstance.get(`/fermes/getByUser/${userId}`)
     return response.data

   
  }
}
const fermeService = new FermeService()
export default fermeService;
