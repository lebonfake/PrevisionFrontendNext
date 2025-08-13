import axiosInstance from "./axios-instance"
import type { FermeReadDto } from "@/types"
import type { AffectFermeDto } from "@/types";

class FermeService {
  // Récupérer toutes les fermes
  async getAll(id:number): Promise<FermeReadDto[]> {
    const response = await axiosInstance.get(`/fermes/without-flux/${id}`)
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
}

export default new FermeService()
