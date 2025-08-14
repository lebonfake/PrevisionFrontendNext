/* eslint-disable @typescript-eslint/no-unused-vars */
import type { SystemVersionCreateDto, SystemVersionReadDto } from "@/types"
import axiosInstance from "./axios-instance";

export class SystemVersionService {
  // Get all system versions
  static async getAllSystemVersions(): Promise<SystemVersionReadDto[]> {
    // TODO: Replace with actual API call
     const response = await axiosInstance.get('/systemVersion');
     return response.data;

    // Mock data for now
    return []
  }

  // Create a new system version
  static async createSystemVersion(systemVersionData: SystemVersionCreateDto): Promise<SystemVersionReadDto> {
    // TODO: Replace with actual API call
    
    const response = await axiosInstance.post('/systemVersion', systemVersionData);
    console.log("service : ",response.data);
     return response.data;

   
    
  }

  // Delete a system version
  static async deleteSystemVersion(id: number): Promise<void> {
    // TODO: Replace with actual API call
    // await axiosInstance.delete(`/system-versions/${id}`);
  }

  // Affect system version to fermes
  static async affectSystemVersionToFermes(systemVersionId: number, fermeIds: string[]): Promise<void> {
    // TODO: Replace with actual API call
    // await axiosInstance.post(`/system-versions/${systemVersionId}/affect-fermes`, { fermeIds });
  }
}
