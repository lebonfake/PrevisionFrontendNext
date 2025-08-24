"use client"

import PrevisionDetailShared from "@/components/prevision/prevision-detail"
import { PrevisionService } from "@/services/prevision-service"

interface Props {
  params: { id: string }
}

export default function EtatDetailPage({ params }: Props) {
  return (
    <PrevisionDetailShared
      id={parseInt(params.id)}
      backPath="/etat-previsions"
      backLabel="Retour à l'état"
      fetchData={PrevisionService.getHistoriquePrevisionDetail}
      title="État de la Prévision"
    />
  )
}
