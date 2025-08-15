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
export interface SecteurReadDto {
  code: number
  designation: string
  superficie: number
  codFerm: string
}

export interface CycleReadDto {
  codeCycle: number
  designation: string
}

export enum TypePrevisionDto {
  Journaliere = "Journaliere",
  Hebdo = "Hebdo",
  SixWeeks = "SixWeeks",
}

export enum StatutPrevisionDto {
  Valide = "Valide",
  EnAttente = "EnAttente",
  Annule = "Annule",
}

export interface LignePrevisionCreateDto {
  valeur: number
  date: string // ISO date string
}

export interface PrevisionDetailsCreateDto {
  secteurId: number
  cycleId: number
  numCulture: number
  parcelle: string
  lignesPrevision: LignePrevisionCreateDto[]
}

export interface PrevisionCreateDto {
  date: string // ISO date string
  type: TypePrevisionDto
  fermeId: string
  creeParUserId: number
  statut: StatutPrevisionDto
  details: PrevisionDetailsCreateDto[]
  versionId: number
  fluxId: number
}

export type TypePrevision = "journaliere" | "hebdomadaire" | "six_weeks"

export interface PrevisionFormData {
  fermeId: string | null
  cycleId: number | null
  typePrevision: TypePrevision | null
  semaine?: number
  versionId?: number
}
