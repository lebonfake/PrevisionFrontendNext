// Types basés sur vos DTOs
export interface ValidateurCreateDto {
  userId: number
}

export interface ValidateurReadDto {
  id: number
  firstName: string
  lastName: string
}

export interface UserReadDto {
  id: number
  firstName: string
  lastName: string
}

export interface FluxCreateDto {
  nom: string
  etapeFluxs: EtapeFluxCreateDto[]
}

export interface EtapeFluxCreateDto {
  ordre: number
  nom: string
  EtapeFluxValidateurPermissionLinks: EtapeFluxValidateurPermissionLinkDto[]
}

export interface EtapeFluxValidateurPermissionLinkDto {
  validateurId: number
  permissionPrevId: number
}

export interface FluxReadDto {
  id: number
  nom: string
  nombreEtapes: number
}

export interface PermissionPrevReadDto {
     id :number
     permissions:string
}
