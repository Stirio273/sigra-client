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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { classeServiceService } from "@/services/application.service";
import type { ClasseService } from "@/types/application";

type FormState = {
  code: string;
  libelle: string;
  dureeSla: number;
};

const emptyForm: FormState = {
  code: "",
  libelle: "",
  dureeSla: 0,
};

export default function ClassesServiceTab() {
  const [classes, setClasses] = useState<ClasseService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<ClasseService | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classeServiceService.getAll();
      setClasses(data);
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

  const openEdit = (cls: ClasseService) => {
    setEditingId(cls.idCs);
    setForm({
      code: cls.code,
      libelle: cls.libelle,
      dureeSla: cls.dureeSla,
    });
    setSubmitError(null);
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!form.code.trim()) {
      setSubmitError("Le code est requis.");
      return;
    }

    if (!form.libelle.trim()) {
      setSubmitError("Le libellé est requis.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await classeServiceService.update(editingId, {
          code: form.code.trim(),
          libelle: form.libelle.trim(),
          dureeSla: form.dureeSla,
        });
      } else {
        await classeServiceService.create({
          code: form.code.trim(),
          libelle: form.libelle.trim(),
          dureeSla: form.dureeSla,
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
      await classeServiceService.delete(deleteTarget.idCs);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "DELETE_FAILED");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Classes de service</h2>
        <Button onClick={openCreate}>
          <Plus size={16} className="mr-2" />
          Ajouter une classe
        </Button>
      </div>

      {error ? (
        <Card>
          <CardContent className="p-6 text-sm text-red-600">{error}</CardContent>
        </Card>
      ) : loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Chargement des classes de service...
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Durée SLA (min)</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-sm text-muted-foreground"
                    >
                      Aucune classe de service trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((cls) => (
                    <TableRow key={cls.idCs} className="hover:bg-muted/50">
                      <TableCell className="text-sm">{cls.code}</TableCell>
                      <TableCell className="text-sm">{cls.libelle}</TableCell>
                      <TableCell className="text-sm">{cls.dureeSla}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEdit(cls)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setDeleteTarget(cls)}
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
              {editingId
                ? "Modifier la classe de service"
                : "Nouvelle classe de service"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Mettez à jour les informations de la classe de service."
                : "Renseignez les informations de la nouvelle classe de service."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value }))
                }
                placeholder="Ex: SUPPORT"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="libelle">Libellé</Label>
              <Input
                id="libelle"
                value={form.libelle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, libelle: e.target.value }))
                }
                placeholder="Ex: Support"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duree-sla">Durée SLA (minutes)</Label>
              <Input
                id="duree-sla"
                type="number"
                value={form.dureeSla}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    dureeSla: Number(e.target.value),
                  }))
                }
                placeholder="Ex: 60"
              />
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
            <DialogTitle>Supprimer la classe de service</DialogTitle>
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
