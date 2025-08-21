"use client"

import PrevisionDetailShared from "@/components/prevision/prevision-detail"
import { PrevisionService } from "@/services/prevision-service"

interface Props {
  params: { id: string }
}

export default function HistoriqueDetailPage({ params }: Props) {
  return (
    <PrevisionDetailShared
      id={parseInt(params.id)}
      backPath="/historique-previsions"
      backLabel="Retour à l'historique"
      fetchData={PrevisionService.getHistoriquePrevisionDetail}
      title="Détail Historique"
    />
  )
}
