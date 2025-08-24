"use client"

import PrevisionListShared from "@/components/prevision/prevision-list"
import { PrevisionService } from "@/services/prevision-service"

export default function EtatPrevisions() {
  return (
    <PrevisionListShared
      title="État des prévisions "
      description="Prévisions en cours de validation  "
      basePath="/etat-previsions"
      fetchData={PrevisionService.getEtatPrevisions}
      showFilters={false}
      autoRefresh={true}
      refreshInterval={30000}
    />
  )
}
