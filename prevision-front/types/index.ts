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
  lignesPrevision: LignePrevisionCreateDto[]
}

export interface PrevisionCreateDto {
  date: string // ISO date string
  type: number
  fermeId: string
  details: PrevisionDetailsCreateDto[]
  versionId: number
}

export type TypePrevision = "journaliere" | "hebdomadaire" | "six_weeks"

export interface PrevisionFormData {
  fermeId: string | null
  cycleId: number | null
  typePrevision: TypePrevision | null
  semaine?: number
  versionId?: number
}


// DTO for reading LignePrevision (response)
export interface LignePrevisionReadDto {
  id: number;
  valeur: number;
  date: string; // Use string for DateTime from C#
}

// DTO for reading PrevisionDetails (response)
export interface PrevisionDetailsReadDto {
  id: number;
  secteurId: number;
  secteurDesignation: string;
  cycleId: number;
  cycleDesignation: string;
  numCulture: number;
  parcelle: string;
  lignesPrevision: LignePrevisionReadDto[];
}

// Main DTO for reading a Prevision (response)
export interface PrevisionReadDto {
  id: number;
  date: string; // Use string for DateTime from C#
  type: string;
  fermeId: string;
  fermeNom: string;
  creeParUserId: number;
  creeParUserName: string;
  statut: string;
  details: PrevisionDetailsReadDto[];
  versionId: number;
  versionName: string;
  fluxId: number | null;
  fluxNom: string | null;
  totale : number | null
}


// DTO for reading a Prevision card (response)
export interface PrevisionCardReadDto {
  id: number;
  date: string;
  type: string;
  fermeId: string;
  fermeNom: string;
  creeParUserId: number;
  creeParUserName: string;
  statut: string;
  versionId: number | null;
  versionName: string | null;
  fluxId: number | null;
  fluxNom: string | null;
  totale: number;
  etapeNom: string | null;
  totaleEtape : number;
  ordreCurrentEtape: number
}

// DTO for validating a Prevision step
export interface ValidatePrevisionRequestDto {
  prevId: number;
  lignePrev: Record<number, number>;
}

export interface PrevisionGeneralReadDto {

 prev: PrevisionReadDto;

 etapes: EtapePrevReadDto[];

}





export interface EtapePrevReadDto {

id: number;

name: string;

ordre: number;

validateurPermissionModifications: ValidateurPermissionModifications[];

}



export interface ValidateurPermissionModifications {

validateur: string;

premissions: string[];

secteurModifications: SecteurModifications[];

}



export interface SecteurModifications {

 prevDetailId: number;

 secteurName: string;

 modificationsDtos: ModificationsDto[];

}



export interface ModificationsDto {

 id: number;

 lignePrevisionId: number;

 dateLigne: string; // Use string for DateTime objects

 oldValue: number;

 newValue: number;

 dateModification: string; // Use string for DateTime objects

}