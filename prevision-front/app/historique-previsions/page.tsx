"use client"

import PrevisionListShared from "@/components/prevision/prevision-list"
import { PrevisionService } from "@/services/prevision-service"

export default function HistoriquePrevisions() {
  return (
    <PrevisionListShared
      title="Historique des prévisions"
      description="Consultez l'historique complet de toutes les prévisions validées et annulées"
      basePath="/historique-previsions"
      fetchData={PrevisionService.getHistoriquePrevisions}
      showFilters={true}
      autoRefresh={false}
    />
  )
}
