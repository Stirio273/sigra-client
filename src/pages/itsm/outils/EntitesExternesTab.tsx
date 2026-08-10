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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { entiteExterneService } from "@/services/entiteexterne.service";
import type { EntiteExterne } from "@/types/entiteexterne";

type FormState = {
  nom: string;
  actif: boolean;
};

const emptyForm: FormState = {
  nom: "",
  actif: true,
};

export default function EntitesExternesTab() {
  const [entites, setEntites] = useState<EntiteExterne[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<EntiteExterne | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await entiteExterneService.getAll();
      setEntites(data);
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

  const openEdit = (entite: EntiteExterne) => {
    setEditingId(entite.idEntiteExterne);
    setForm({
      nom: entite.nom,
      actif: entite.actif,
    });
    setSubmitError(null);
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!form.nom.trim()) {
      setSubmitError("Le nom est requis.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await entiteExterneService.update(editingId, {
          nom: form.nom.trim(),
          actif: form.actif,
        });
      } else {
        await entiteExterneService.create({
          nom: form.nom.trim(),
          actif: form.actif,
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
      await entiteExterneService.delete(deleteTarget.idEntiteExterne);
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
        <h2 className="text-lg font-medium">Entités externes</h2>
        <Button onClick={openCreate}>
          <Plus size={16} className="mr-2" />
          Ajouter une entité
        </Button>
      </div>

      {error ? (
        <Card>
          <CardContent className="p-6 text-sm text-red-600">{error}</CardContent>
        </Card>
      ) : loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Chargement des entités externes...
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entites.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-sm text-muted-foreground"
                    >
                      Aucune entité externe trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  entites.map((entite) => (
                    <TableRow key={entite.idEntiteExterne} className="hover:bg-muted/50">
                      <TableCell className="text-sm">{entite.nom}</TableCell>
                      <TableCell>
                        <Badge variant={entite.actif ? "default" : "secondary"}>
                          {entite.actif ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEdit(entite)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setDeleteTarget(entite)}
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
                ? "Modifier l'entité externe"
                : "Nouvelle entité externe"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Mettez à jour les informations de l'entité externe."
                : "Renseignez les informations de la nouvelle entité externe."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="libelle">Nom</Label>
              <Input
                id="nom"
                value={form.nom}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nom: e.target.value }))
                }
                placeholder="Ex: Partenaire A"
              />
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
            <DialogTitle>Supprimer l'entité externe</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{deleteTarget?.nom}" ? Cette
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
