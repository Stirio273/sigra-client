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
import { holidayService } from "@/services/application.service";
import type { JourFerie } from "@/types/application";

type FormState = {
  date: string;
  libelle: string;
};

const emptyForm: FormState = {
  date: "",
  libelle: "",
};

export default function JourFeriesTab() {
  const [jours, setJours] = useState<JourFerie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<JourFerie | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await holidayService.getAll();
      setJours(data);
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

  const openEdit = (jour: JourFerie) => {
    setEditingId(jour.idJourFerie);
    setForm({
      date: jour.date,
      libelle: jour.libelle,
    });
    setSubmitError(null);
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!form.date) {
      setSubmitError("La date est requise.");
      return;
    }

    if (!form.libelle.trim()) {
      setSubmitError("Le libellé est requis.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await holidayService.update(editingId, {
          date: form.date,
          libelle: form.libelle.trim(),
        });
      } else {
        await holidayService.create({
          date: form.date,
          libelle: form.libelle.trim(),
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
      await holidayService.delete(deleteTarget.idJourFerie);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "DELETE_FAILED");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Jours fériés</h2>
        <Button onClick={openCreate}>
          <Plus size={16} className="mr-2" />
          Ajouter un jour férié
        </Button>
      </div>

      {error ? (
        <Card>
          <CardContent className="p-6 text-sm text-red-600">{error}</CardContent>
        </Card>
      ) : loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Chargement des jours fériés...
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Libellé</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jours.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-sm text-muted-foreground"
                    >
                      Aucun jour férié trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  jours.map((jour) => (
                    <TableRow key={jour.idJourFerie} className="hover:bg-muted/50">
                      <TableCell className="text-sm">
                        {formatDate(jour.date)}
                      </TableCell>
                      <TableCell className="text-sm">{jour.libelle}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEdit(jour)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setDeleteTarget(jour)}
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
                ? "Modifier le jour férié"
                : "Nouveau jour férié"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Mettez à jour les informations du jour férié."
                : "Renseignez les informations du nouveau jour férié."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
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
                placeholder="Ex: Noël"
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
            <DialogTitle>Supprimer le jour férié</DialogTitle>
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
