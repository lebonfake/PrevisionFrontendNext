// Types basés sur vos DTOs
export interface ValidateurCreateDto {
  userId: number;
}

export interface ValidateurReadDto {
  id: number;
  firstName: string;
  lastName: string;
}

export interface UserReadDto {
  id: number;
  firstName: string;
  lastName: string;
}

export interface FluxCreateDto {
  nom: string;
  etapeFluxs: EtapeFluxCreateDto[];
}

export interface EtapeFluxCreateDto {
  ordre: number;
  nom: string;
  EtapeFluxValidateurPermissionLinks: EtapeFluxValidateurPermissionLinkDto[];
}

export interface EtapeFluxValidateurPermissionLinkDto {
  validateurId: number;
  permissionPrevId: number;
}

export interface FluxReadDto {
  id: number;
  nom: string;
  nombreEtapes: number;
  fermes: FermeReadDto[];
}

export interface PermissionPrevReadDto {
  id: number;
  permissions: string;
}

export interface FermeReadDto {
  id: string;
  nom: string;
}
export interface AffectFermeDto {
  fermeId: string[];
  fluxId: number;
}

// For creating a new Version
export interface VersionCreateDto {
  name: string;
  startDay: number; // 0-6 Sunday to Saturday
  endDay: number; // 0-6 Sunday to Saturday
}

// For creating a new SystemVersion, including nested Versions
export interface SystemVersionCreateDto {
  nom: string;
  versionCreateDtos: VersionCreateDto[]; // Note: C# 'VersionCreateDtos' becomes 'versionCreateDtos' in camelCase
}

// For reading a Version (response DTO)
export interface VersionReadDto {
  id: number;
  name: string;
  startDay: number; // 0-6 Sunday to Saturday
  endDay: number; // 0-6 Sunday to Saturday
}

// For reading a SystemVersion (response DTO), including nested VersionReadDtos
export interface SystemVersionReadDto {
  id: number;
  name: string; // Mapped from C# 'Nom'
  versionReadDtos: VersionReadDto[]; // Note: C# 'VersionReadDtos' becomes 'versionReadDtos' in camelCase
}

export interface AffectFermeVesrionDto {
  FermeId: string[];

  SystemId: number;
}
