/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, RefreshCw, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  StatutPrevisionDto,
  TypePrevisionDto,
  type PrevisionCardReadDto,
} from "@/types";

interface PrevisionTableSharedProps {
  title: string;
  description: string;
  basePath: string;
  fetchData: (filters?: any) => Promise<PrevisionCardReadDto[]>;
  showFilters?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function PrevisionTableShared({
  title,
  description,
  basePath,
  fetchData,
  showFilters = true,
  autoRefresh = false,
  refreshInterval = 30000,
}: PrevisionTableSharedProps) {
  const router = useRouter();
  const [previsions, setPrevisions] = useState<PrevisionCardReadDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statutFilter, setStatutFilter] = useState<string>("all");

  const loadData = async () => {
    try {
      setLoading(true);

      const data = await fetchData();
      setPrevisions(data);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const filteredPrevisions = previsions.filter((prevision) => {
    const matchesSearch = prevision.fermeNom
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || prevision.type === typeFilter;
    const matchesStatut =
      statutFilter === "all" || prevision.statut === statutFilter;

    return matchesSearch && matchesType && matchesStatut;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case TypePrevisionDto.Journaliere:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case TypePrevisionDto.Hebdo:
        return "bg-green-100 text-green-800 border-green-200";
      case TypePrevisionDto.SixWeeks:
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case StatutPrevisionDto.Valide:
        return "bg-green-100 text-green-800 border-green-200";
      case StatutPrevisionDto.Annule:
        return "bg-red-100 text-red-800 border-red-200";
      case StatutPrevisionDto.EnAttente:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleRowClick = (previsionId: number) => {
    router.push(`${basePath}/${previsionId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>
        {autoRefresh && (
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        )}
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom de ferme..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de prévision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value={TypePrevisionDto.Journaliere}>
                    Journalière
                  </SelectItem>
                  <SelectItem value={TypePrevisionDto.Hebdo}>
                    Hebdomadaire
                  </SelectItem>
                  <SelectItem value={TypePrevisionDto.SixWeeks}>
                    Six semaines
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={statutFilter} onValueChange={setStatutFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value={StatutPrevisionDto.EnAttente}>
                    En cours
                  </SelectItem>
                  <SelectItem value={StatutPrevisionDto.Valide}>
                    Validé
                  </SelectItem>
                  <SelectItem value={StatutPrevisionDto.Annule}>
                    Annulé
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ferme</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Total (tonnes)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredPrevisions.length > 0 ? (
                filteredPrevisions.map((prevision) => {
                  const progressPercentage =
                    prevision.totaleEtape > 0
                      ? Math.round(
                          (prevision.ordreCurrentEtape /
                            prevision.totaleEtape) *
                            100
                        )
                      : 0;

                  return (
                    <TableRow
                      key={prevision.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleRowClick(prevision.id)}
                    >
                      <TableCell className="font-medium">
                        {prevision.fermeNom}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getTypeColor(prevision.type)}
                        >
                          {prevision.type === TypePrevisionDto.Journaliere &&
                            "Journalière"}
                          {prevision.type === TypePrevisionDto.Hebdo &&
                            "Hebdomadaire"}
                          {prevision.type === TypePrevisionDto.SixWeeks &&
                            "Six semaines"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(prevision.date).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatutColor(prevision.statut)}
                        >
                          {prevision.statut === StatutPrevisionDto.Valide &&
                            "Validé"}
                          {prevision.statut === StatutPrevisionDto.Annule &&
                            "Annulé"}
                          {prevision.statut === StatutPrevisionDto.EnAttente &&
                            "En cours"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={progressPercentage}
                            className="w-16"
                          />
                          <span className="text-sm text-gray-600">
                            {prevision.ordreCurrentEtape}/
                            {prevision.totaleEtape}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {prevision.totale
                          ? prevision.totale.toFixed(2)
                          : "0.00"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(prevision.id);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      Aucune prévision trouvée
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
