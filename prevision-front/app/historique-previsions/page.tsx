"use client"


import PrevisionTableShared from "@/components/prevision/prevision-table-shared"
import { PrevisionService } from "@/services/prevision-service"

export default function HistoriquePrevisions() {
  return (
    <PrevisionTableShared
      title="Historique des prévisions"
      description="Consultez l'historique complet de toutes les prévisions validées et annulées"
      basePath="/historique-previsions"
      fetchData={PrevisionService.getHistoriquePrevisions}
      showFilters={true}
      autoRefresh={false}
    />

  )
}
