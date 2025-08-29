/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, act } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Check, X, Edit } from "lucide-react";
import type { ActionCreateDto, CancelPrevisionRequestDto, PrevisionReadDto, TagReadDto, ValidatePrevisionRequestDto } from "@/types";
import { PrevisionValidationService } from "@/services/prevision-validation-service";
import { toast } from "sonner";
import { PermissionType } from "@/types";
import { permission } from "process";
import validateurService from "@/services/validateur-service";
import { TagService } from "@/services/tag-service";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export default function PrevisionValidationDetailPage() {
  const [prevision, setPrevision] = useState<PrevisionReadDto | null>(null);
  const [editingValues, setEditingValues] = useState<Record<number, number>>(
    {}
  );
  const [tags,setTags] = useState<TagReadDto[]>([])
  const [action,setAction] = useState<ActionCreateDto>({remarque : "", tagsIds : []})
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = Number.parseInt(params.id as string);

  const [canValidate, setCanValidate] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    loadPrevision();
    loadTags();
  }, [id]);

  const loadTags=async ()=>{
    try{
      setLoading(true)
      const response = await TagService.getAllTags()
      if(response){
        setTags(response)
      }
    }
    catch(err){
      setLoading(false)
    console.log(err);

    }finally{
      setLoading(false);
    }
  }
  const loadPrevision = async () => {
    try {
      setLoading(true);
      const data = await PrevisionValidationService.getPrevisionById(id);
      console.log(data?.etapePrevId);

      if (data) {
        const {permissions} =
          await validateurService.getValidateurPermissionsPrev(
            data?.etapePrevId
          );

        console.log(permissions);
        console.log(permissions.includes(PermissionType.Valider));

        if (permissions) {
          setCanValidate(
            permissions.includes(PermissionType.Valider)
          );
          setCanCancel(
            permissions.includes(PermissionType.Annuler)
          );
          setCanEdit(permissions.includes(PermissionType.Modifier));
        }
        setPrevision(data);
        // Initialiser les valeurs d'édition
        const initialValues: Record<number, number> = {};
        data.details.forEach((detail) => {
          detail.lignesPrevision.forEach((ligne) => {
            initialValues[ligne.id] = ligne.valeur;
          });
        });
        setEditingValues(initialValues);
      } else {
        toast.error("Prévision non trouvée");
        router.push("/prevision-validation");
      }
    } catch (error) {
      toast.error("Erreur lors du chargement de la prévision");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (ligneId: number, value: string) => {
    const numValue = Number.parseFloat(value) || 0;
    setEditingValues((prev) => ({
      ...prev,
      [ligneId]: numValue,
    }));
  };
  const handleValidateTagToggle = (id: number) => {
    setAction(prev => {
        // Check if the ID already exists in the tagsIds array
        const isSelected = prev.tagsIds.includes(id);

        let updatedTagsIds;
        if (isSelected) {
            // If the ID is already there, remove it
            updatedTagsIds = prev.tagsIds.filter(tagId => tagId !== id);
        } else {
            // If the ID is not there, add it
            updatedTagsIds = [...prev.tagsIds, id];
        }

        // Return the new state
        return { ...prev, tagsIds: updatedTagsIds };
    });
};

  const actionCreate : ActionCreateDto = {remarque : "", tagsIds : [1,2]}
  const handleValidate = async () => {
    try {
      // Sauvegarder les modifications
      const validateRequest: ValidatePrevisionRequestDto = {
        prevId: id,
        lignePrev: editingValues,
        action : action
      };

      await PrevisionValidationService.validatePrevision(validateRequest);
      /* for (const [ligneId, value] of Object.entries(editingValues)) {
        await PrevisionValidationService.updateLignePrevision(Number.parseInt(ligneId), value)
      }
      await PrevisionValidationService.validatePrevision(id)*/
      toast.success("Prévision validée avec succès");
      router.push("/prevision-validation");
    } catch (error) {
      toast.error("Erreur lors de la validation");
    }
  };

  const handleCancel = async () => {
    try {
    
    const  cancelRequest : CancelPrevisionRequestDto  = {prevId : id , action : action}
      await PrevisionValidationService.cancelPrevision(cancelRequest);
      toast.success("Prévision annulée");
      router.push("/prevision-validation");
    } catch (error) {
      toast.error("Erreur lors de l'annulation");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la prévision...</p>
        </div>
      </div>
    );
  }

  if (!prevision) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Prévision non trouvée</p>
      </div>
    );
  }

  // Extraire toutes les dates uniques
  const allDates = Array.from(
    new Set(
      prevision.details.flatMap((detail) =>
        detail.lignesPrevision.map((ligne) => ligne.date)
      )
    )
  ).sort();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/prevision-validation")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>

          <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Validation - {prevision.fermeNom}
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant="secondary">{prevision.type}</Badge>
                  {prevision.type.toLowerCase() === "hebdo" &&
                    prevision.versionName && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
                        Version: {prevision.versionName}
                      </Badge>
                    )}
                  <span className="text-sm text-gray-600">
                    Créé par {prevision.creeParUserName}
                  </span>
                  <span className="text-sm text-gray-600">
                    {new Date(prevision.date).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:flex-shrink-0">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={!canCancel}
                      type="button"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 min-w-40 h-12 bg-white border-2 border-red-500 text-red-700 hover:bg-red-50 hover:border-red-600 hover:text-red-800 font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200 focus:ring-4 focus:ring-red-500 focus:ring-offset-2 rounded-md cursor-pointer focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <X className="h-6 w-6 flex-shrink-0" />
                      <span>Annuler</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Annuler la prévision</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir annuler cette prévision ? Cette
                        action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="validate-remarque">Remarque</label>
                        <Textarea
                          id="validate-remarque"
                          placeholder="Ajoutez une remarque (optionnel)..."
                          value={action.remarque}
                          onChange={(e) => setAction(prev=>{
                            return {...prev, remarque:e.target.value}
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label>Raisons</label>
                        <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                          {tags.map((tag) => (
                            <div key={tag.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`validate-tag-${tag.id}`}
                                checked={action.tagsIds.includes(tag.id)}
                                onCheckedChange={() => handleValidateTagToggle(tag.id)}
                              />
                              <label htmlFor={`validate-tag-${tag.id}`} className="text-sm">
                                {tag.tag}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Retour</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancel}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Annuler la prévision
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={!canValidate}
                      type="button"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 min-w-40 h-12 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200 focus:ring-4 focus:ring-green-500 focus:ring-offset-2 rounded-md cursor-pointer focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <Check className="h-6 w-6 flex-shrink-0" />
                      <span>Valider</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Valider la prévision</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir valider cette prévision avec
                        les modifications apportées ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                     <div className="space-y-4">
                      <div>
                        <label htmlFor="validate-remarque">Remarque</label>
                        <Textarea
                          id="validate-remarque"
                          placeholder="Ajoutez une remarque (optionnel)..."
                          value={action.remarque}
                          onChange={(e) => setAction(prev=>{
                            return {...prev, remarque:e.target.value}
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label>Raisons</label>
                        <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                          {tags.map((tag) => (
                            <div key={tag.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`validate-tag-${tag.id}`}
                                checked={action.tagsIds.includes(tag.id)}
                                onCheckedChange={() => handleValidateTagToggle(tag.id)}
                              />
                              <label htmlFor={`validate-tag-${tag.id}`} className="text-sm">
                                {tag.tag}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Retour</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleValidate}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Valider
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Grille de validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-900">
                      Secteur
                    </th>
                    {allDates.map((date) => (
                      <th
                        key={date}
                        className="text-center p-3 font-medium text-gray-900 min-w-32"
                      >
                        {new Date(date).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </th>
                    ))}
                    <th className="text-center p-3 font-medium text-gray-900">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prevision.details.map((detail) => (
                    <tr key={detail.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">
                        {detail.secteurDesignation}
                        <div className="text-sm text-gray-500">
                          {detail.parcelle}
                        </div>
                      </td>
                      {allDates.map((date) => {
                        const ligne = detail.lignesPrevision.find(
                          (l) => l.date === date
                        );
                        return (
                          <td key={date} className="p-3 text-center">
                            {ligne ? (
                              canEdit ? (
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={editingValues[ligne.id] || 0}
                                  onChange={(e) =>
                                    handleValueChange(ligne.id, e.target.value)
                                  }
                                  className="w-20 text-center"
                                />
                              ) : (
                                <span>{editingValues[ligne.id] || 0}</span>
                              )
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-3 text-center font-medium">
                        {detail.lignesPrevision
                          .reduce(
                            (sum, ligne) =>
                              sum + (editingValues[ligne.id] || 0),
                            0
                          )
                          .toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">
                      Total général
                    </td>
                    {allDates.map((date) => (
                      <td key={date} className="p-3 text-center font-bold">
                        {prevision.details
                          .flatMap((detail) => detail.lignesPrevision)
                          .filter((ligne) => ligne.date === date)
                          .reduce(
                            (sum, ligne) =>
                              sum + (editingValues[ligne.id] || 0),
                            0
                          )
                          .toFixed(1)}
                      </td>
                    ))}
                    <td className="p-3 text-center font-bold text-blue-600">
                      {Object.values(editingValues)
                        .reduce((sum, val) => sum + val, 0)
                        .toFixed(1)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
