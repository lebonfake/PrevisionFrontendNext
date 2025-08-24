"use client"

import PrevisionDetailShared from "@/components/prevision/prevision-detail"
import { PrevisionService } from "@/services/prevision-service"

interface Props {
  params: { id: string }
}

export default function PrevisionRecuDetailPage({ params }: Props) {
  return (
    <PrevisionDetailShared
      id={parseInt(params.id)}
      backPath="/prevision-recu"
      backLabel="Retour aux prévisions reçues"
      fetchData={PrevisionService.getHistoriquePrevisionDetail}
      title="Détail Prévision Reçue"
    />
  )
}
