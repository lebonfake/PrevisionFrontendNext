/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import type {
  SystemVersionCreateDto,
  VersionCreateDto,
  SystemVersionReadDto,
} from "@/types";
import { SystemVersionService } from "./../../services/system-version-service";
import { toast } from "sonner";

interface CreateSystemVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (systemVersion: SystemVersionReadDto) => void;
}

const dayOptions = [
  { value: 0, label: "Dimanche" },
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
];

export default function CreateSystemVersionModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateSystemVersionModalProps) {
  const [nom, setNom] = useState("");
  const [versions, setVersions] = useState<VersionCreateDto[]>([
    { name: "", startDay: 0, endDay: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nom.trim()) {
      toast.error("Erreur", {
        description: "Le nom du system version est requis",
      });
      return;
    }
    console.log(versions);
    if (!versions) {
        toast.error("Erreur", {
          description: "Au moins une version est requise",
        });
        return 
    }
      if (versions.length === 0) {
        toast.error("Erreur", {
          description: "Au moins une version est requise",
        });
        return;
      }
    

    // Validate versions
    for (const version of versions) {
      if (!version.name.trim()) {
        toast.error("Erreur", {
          description: "Tous les noms de version sont requis",
        });
        return;
      }
    }

    try {
      setLoading(true);
      const systemVersionData: SystemVersionCreateDto = {
        nom: nom.trim(),
        versionCreateDtos: versions,
      };
      console.log(systemVersionData);
      

      const newSystemVersion : SystemVersionReadDto = await SystemVersionService.createSystemVersion(
        systemVersionData
      );
      console.log(newSystemVersion);
      
      onSuccess(newSystemVersion);

      // Reset form
      setNom("");
      setVersions([{ name: "", startDay: 0, endDay: 0 }]);
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de créer le system version",
      });
    } finally {
      setLoading(false);
    }
  };

  const addVersion = () => {
    setVersions([...versions, { name: "", startDay: 0, endDay: 0 }]);
  };

  const removeVersion = (index: number) => {
    if (versions.length > 1) {
      setVersions(versions.filter((_, i) => i !== index));
    }
  };

  const updateVersion = (
    index: number,
    field: keyof VersionCreateDto,
    value: string | number
  ) => {
    const updatedVersions = [...versions];
    updatedVersions[index] = { ...updatedVersions[index], [field]: value };
    setVersions(updatedVersions);
  };

  const handleClose = () => {
    setNom("");
    setVersions([{ name: "", startDay: 0, endDay: 0 }]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un SystemVersion</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* System Version Name */}
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du SystemVersion</Label>
            <Input
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Entrez le nom du system version"
              required
            />
          </div>

          {/* Versions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Versions</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVersion}
                className="flex items-center gap-2 bg-transparent"
              >
                <Plus className="h-4 w-4" />
                Ajouter Version
              </Button>
            </div>

            <div className="space-y-4">
              {versions.map((version, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        Version {index + 1}
                      </CardTitle>
                      {versions.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeVersion(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`version-name-${index}`}>
                        Nom de la version
                      </Label>
                      <Input
                        id={`version-name-${index}`}
                        value={version.name}
                        onChange={(e) =>
                          updateVersion(index, "name", e.target.value)
                        }
                        placeholder="Entrez le nom de la version"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`start-day-${index}`}>
                          Jour de début
                        </Label>
                        <Select
                          value={version.startDay.toString()}
                          onValueChange={(value) =>
                            updateVersion(
                              index,
                              "startDay",
                              Number.parseInt(value)
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le jour de début" />
                          </SelectTrigger>
                          <SelectContent>
                            {dayOptions.map((day) => (
                              <SelectItem
                                key={day.value}
                                value={day.value.toString()}
                              >
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`end-day-${index}`}>Jour de fin</Label>
                        <Select
                          value={version.endDay.toString()}
                          onValueChange={(value) =>
                            updateVersion(
                              index,
                              "endDay",
                              Number.parseInt(value)
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le jour de fin" />
                          </SelectTrigger>
                          <SelectContent>
                            {dayOptions.map((day) => (
                              <SelectItem
                                key={day.value}
                                value={day.value.toString()}
                              >
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
