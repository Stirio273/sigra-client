import React, { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  applicationService,
  classeServiceService,
} from "@/services/application.service";
import type { Application, ClasseService } from "@/types/application";

type FormState = {
  libelle: string;
  actif: boolean;
  idCs: number;
};

const emptyForm: FormState = {
  libelle: "",
  actif: true,
  idCs: 0,
};

export default function ApplicationsTab() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [classes, setClasses] = useState<ClasseService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [apps, classesData] = await Promise.all([
        applicationService.getAll(),
        classeServiceService.getAll(),
      ]);
      setApplications(apps);
      setClasses(classesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "LOAD_FAILED");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSubmitError(null);
    setFormOpen(true);
  };

  const openEdit = (app: Application) => {
    setEditingId(app.idApplication);
    setForm({
      libelle: app.libelle,
      actif: app.actif,
      idCs: app.idCs,
    });
    setSubmitError(null);
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!form.libelle.trim()) {
      setSubmitError("Le libellé est requis.");
      return;
    }

    if (!form.idCs) {
      setSubmitError("Veuillez sélectionner une classe de service.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await applicationService.update(editingId, {
          libelle: form.libelle.trim(),
          actif: form.actif,
          idCs: form.idCs,
        });
      } else {
        await applicationService.create({
          libelle: form.libelle.trim(),
          actif: form.actif,
          idCs: form.idCs,
        });
      }
      setFormOpen(false);
      await loadData();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "SUBMIT_FAILED");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await applicationService.delete(deleteTarget.idApplication);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "DELETE_FAILED");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const classeLabel = (idCs: number) => {
    const cls = classes.find((c) => c.idCs === idCs);
    return cls?.code ?? `#${idCs}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Applications</h2>
        <Button onClick={openCreate}>
          <Plus size={16} className="mr-2" />
          Ajouter une application
        </Button>
      </div>

      {error ? (
        <Card>
          <CardContent className="p-6 text-sm text-red-600">{error}</CardContent>
        </Card>
      ) : loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Chargement des applications...
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Classe de service</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-sm text-muted-foreground"
                    >
                      Aucune application trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => (
                    <TableRow key={app.idApplication} className="hover:bg-muted/50">
                      <TableCell className="text-sm">{app.libelle}</TableCell>
                      <TableCell className="text-sm">
                        {classeLabel(app.idCs)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={app.actif ? "default" : "secondary"}>
                          {app.actif ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEdit(app)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setDeleteTarget(app)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogTrigger render={<span />} />
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Modifier l'application" : "Nouvelle application"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Mettez à jour les informations de l'application."
                : "Renseignez les informations de la nouvelle application."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="libelle">Libellé</Label>
              <Input
                id="libelle"
                value={form.libelle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, libelle: e.target.value }))
                }
                placeholder="Ex: Service RH"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classe-service">Classe de service</Label>
              <Select
                value={form.idCs ? String(form.idCs) : undefined}
                onValueChange={(value) =>
                  setForm((f) => ({
                    ...f,
                    idCs: Number(value),
                  }))
                }
              >
                <SelectTrigger id="classe-service">
                  {form.idCs ? (
                    <span>{classeLabel(form.idCs)}</span>
                  ) : (
                    <SelectValue placeholder="Sélectionner une classe" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.idCs} value={String(cls.idCs)}>
                      {cls.libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="actif"
                checked={form.actif}
                onCheckedChange={(checked) =>
                  setForm((f) => ({
                    ...f,
                    actif: checked === true,
                  }))
                }
              />
              <Label htmlFor="actif" className="text-sm">
                Actif
              </Label>
            </div>
            {submitError && (
              <p className="text-xs text-red-600">{submitError}</p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? editingId
                    ? "Enregistrement..."
                    : "Création..."
                  : editingId
                    ? "Enregistrer"
                    : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogTrigger render={<span />} />
        <DialogContent className="w-full max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer l'application</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{deleteTarget?.libelle}" ? Cette
              action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
