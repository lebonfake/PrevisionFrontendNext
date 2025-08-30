"use client"

import PrevisionListShared from "@/components/prevision/prevision-list"
import { PrevisionService } from "@/services/prevision-service"

export default function PrevisionRecu() {
  return (
    <PrevisionListShared
      title="Prévision validées reçu"
      description="Prévisions récemment validées en attente de votre consultation"
      basePath="/prevision-recu"
      fetchData={PrevisionService.getRecuPrevisions}
      showFilters={false}
      autoRefresh={true}
      refreshInterval={10000}
    />
  )
}
