/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, ArrowLeft, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypePrevisionDto, type PrevisionGeneralReadDto } from "@/types";
import Link from "next/link";

interface PrevisionDetailSharedProps {
  id: number;
  backPath: string;
  backLabel: string;
  fetchData: (id: number) => Promise<PrevisionGeneralReadDto>;
  title: string;
}

export default function PrevisionDetailShared({
  id,
  backPath,
  backLabel,
  fetchData,
  title,
}: PrevisionDetailSharedProps) {
  const [data, setData] = useState<PrevisionGeneralReadDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("fetched data ");

        const result = await fetchData(id);
        console.log(result);

        setData(result);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, fetchData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Prévision non trouvée</p>
        <Link href={backPath}>
          <Button variant="outline" className="mt-4 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
      </div>
    );
  }

  const { prev: prevision, etapes } = data;

  const progressPercentage =
    (prevision.ordreCurrentEtape / prevision.totaleEtape) * 100;

  const dates = [
    ...new Set(
      (prevision.details || []).flatMap((detail) =>
        (detail.lignesPrevision || []).map((ligne) => ligne.date)
      )
    ),
  ].sort();

  const secteurs = [
    ...new Set(
      (prevision.details || []).map((d) => ({
        id: d.secteurId,
        designation: d.secteurDesignation,
      }))
    ),
  ];

  function GetSumOfRow(secteurId: number) {
    const details = prevision?.details?.find((d) => d.secteurId == secteurId);
    const sum = details?.lignesPrevision
      .map((ligne) => ligne.valeur)
      .reduce((curr, acc) => curr + acc, 0);
    return sum?  Math.round(sum   * 100) / 100 : 0 ;
  }

  function GetSumOfCoulmn(date : string){
    const sum = (prevision.details || []).flatMap(p=>(p?.lignesPrevision.find(l=>l.date == date))?.valeur)?.reduce((curr, acc) => curr + acc, 0);
    return sum?  Math.round(sum   * 100) / 100 : 0 ;
  }
  let totaleSum = 0
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={backPath}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backLabel}
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">Détails de la prévision</p>
        </div>
      </div>

      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Ferme</p>
              <p className="font-semibold">{prevision.fermeNom}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <Badge className="mt-1">
                {prevision.type === TypePrevisionDto.Journaliere
                  ? "Journalière"
                  : prevision.type === TypePrevisionDto.Hebdo
                  ? "Hebdomadaire"
                  : "Six semaines"}
                {prevision.versionName
                  ? ", version : " + prevision.versionName
                  : " "}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold">
                {new Date(prevision.date).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-semibold">
                {prevision?.totale?.toLocaleString("fr-FR")} tonnes
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progression</span>
              <span className="text-sm font-medium">
                {prevision.ordreCurrentEtape}/{prevision.totaleEtape} étapes
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Grille des valeurs */}
      <Card>
        <CardHeader>
          <CardTitle>Grille des prévisions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-50 text-left font-medium">
                    Secteur
                  </th>
                  {dates.map((date) => (
                    <th
                      key={date}
                      className="border border-gray-300 p-2 bg-gray-50 text-center font-medium min-w-[120px]"
                    >
                      {new Date(date).toLocaleDateString("fr-FR")}
                    </th>
                  ))}
                  <th className="border border-gray-300 p-2 bg-gray-50  font-medium text-center">
                    {" "}
                    Totale{" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {secteurs.map((secteur) => (
                  <tr key={secteur.id}>
                    <td className="border border-gray-300 p-2 font-medium bg-gray-50">
                      {secteur.designation}
                    </td>
                    {dates.map((date) => {
                      const detail = (prevision.details || []).find(
                        (d) => d.secteurId === secteur.id
                      );
                      const ligne = detail?.lignesPrevision?.find(
                        (l) => l.date === date
                      );
                      return (
                        <td
                          key={`${secteur.id}-${date}`}
                          className="border border-gray-300 p-2 text-center"
                        >
                          <span className="text-sm">{ligne?.valeur || 0}</span>
                        </td>
                      );
                    })}
                    <td className="border border-gray-300 p-2 text-center">
                      {`${GetSumOfRow(secteur.id)}`}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="border border-gray-300 p-2 font-medium bg-gray-50">
                    Totale
                  </td>
                  {
                    dates.map((d,index)=>{

                      totaleSum += GetSumOfCoulmn(d)

                      return (<td className="border border-gray-300 p-2 text-center" key={index}>{GetSumOfCoulmn(d)}</td>)
                    })
                  }
                  <td className="border border-gray-300 p-2 font-medium text-center">{totaleSum}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Étapes de validation */}
      <Card>
        <CardHeader>
          <CardTitle>Étapes de validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(etapes || []).map((etape) => (
              <div key={etape.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{etape.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Ordre: {etape.ordre}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(etape.validateurPermissionModifications || []).map(
                    (validateur: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">
                            Validateur: {validateur.validateur}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(validateur.premissions || []).map(
                            (permission: string, permIndex: number) => (
                              <Badge
                                key={permIndex}
                                variant="outline"
                                className="text-xs"
                              >
                                {permission}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historique des modifications */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des modifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {(etapes || []).map((etape) =>
              (etape.validateurPermissionModifications || []).map(
                (validateur: any, validateurIndex: number) =>
                  (validateur.secteurModifications || []).map(
                    (secteur: any, secteurIndex: number) => (
                      <div
                        key={`${etape.id}-${validateurIndex}-${secteurIndex}`}
                        className="border-l-4 border-l-blue-500 pl-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{etape.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            <User className="h-3 w-3 mr-1 inline" />
                            {validateur.validateur}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">
                            {secteur.secteurName}
                          </h5>
                          {(secteur.modificationsDtos || []).map(
                            (modif: any) => (
                              <div
                                key={modif.id}
                                className="bg-gray-50 rounded p-3"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs text-gray-500">
                                    Date du jour de prévision :{" "}
                                    {new Date(
                                      modif.dateLigne
                                    ).toLocaleDateString("fr-FR")}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1 inline" />
                                    Date de modification :
                                    {" " +
                                      new Date(
                                        modif.dateModification
                                      ).toLocaleDateString("fr-FR")}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-red-600">
                                    Ancien: {modif.oldValue} tonnes
                                  </span>
                                  <span className="text-gray-400">→</span>
                                  <span className="text-green-600">
                                    Nouveau: {modif.newValue} tonnes
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
