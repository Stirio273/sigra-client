import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { teamService } from "@/services/team.service";
import TopBar from "@/components/itsm/TopBar";
import type { Role, Utilisateur } from "@/types/utilisateur";

type FormState = {
  email: string;
  role: Role;
};

const emptyForm: FormState = {
  email: "",
  role: { idRole: 0, libelle: "" },
};

export default function Team() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rolesLoading, setRolesLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teamService.getUtilisateurs();
      setUtilisateurs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "LOAD_FAILED");
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      setRolesLoading(true);
      const data = await teamService.getRoles();
      setRoles(data);
    } catch {
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    loadRoles();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setSubmitError(null);
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!form.email.trim()) {
      setSubmitError("L'adresse email est requise.");
      return;
    }

    try {
      setSubmitting(true);
      await teamService.addUtilisateurByEmail(form.email.trim(), form.role);
      setFormOpen(false);
      await loadData();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "ADD_UTILISATEUR_FAILED"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActif = async (u: Utilisateur) => {
    try {
      await teamService.toggleUtilisateurActif(u.idUtilisateur, !u.actif);
      await loadData();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "TOGGLE_UTILISATEUR_FAILED"
      );
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";
    try {
      return new Date(date).toLocaleString("fr-FR");
    } catch {
      return date;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-full mx-auto">
      <TopBar />
      <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium">Équipes</h1>
            <Button onClick={openCreate}>
              <Plus size={16} className="mr-2" />
              Ajouter un membre
            </Button>
          </div>

          {error ? (
            <Card>
              <CardContent className="p-6 text-sm text-red-600">
                {error}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0 w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[22%]">Email</TableHead>
                      <TableHead className="w-[12%]">Rôle</TableHead>
                      <TableHead className="w-[10%]">Statut</TableHead>
                      <TableHead className="w-[14%]">Dernière synchronisation</TableHead>
                      <TableHead className="w-[14%]">Désactivé le</TableHead>
                      <TableHead className="w-[10%] pr-10 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-sm text-muted-foreground"
                        >
                          Chargement des membres...
                        </TableCell>
                      </TableRow>
                    ) : utilisateurs.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-sm text-muted-foreground"
                        >
                          Aucun membre trouvé.
                        </TableCell>
                      </TableRow>
                    ) : (
                      utilisateurs.map((u) => (
                        <TableRow key={u.idUtilisateur} className="hover:bg-muted/50">
                          <TableCell className="text-sm whitespace-normal break-words">{u.email}</TableCell>
                          <TableCell className="text-sm">{u.role?.libelle ? u.role.libelle : ""}</TableCell>
                          <TableCell>
                            <Badge variant={u.actif ? "default" : "secondary"}>
                              {u.actif ? "Actif" : "Inactif"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm whitespace-normal break-words">{formatDate(u.dateSynchronisation)}</TableCell>
                          <TableCell className="text-sm whitespace-normal break-words">{formatDate(u.dateDesactivation)}</TableCell>
                          <TableCell className="text-right pr-10">
                            <Button variant="ghost" size="icon-sm" onClick={() => handleToggleActif(u)}>
                              {u.actif ? "Désactiver" : "Activer"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Add Member Dialog */}
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger render={<span />} />
            <DialogContent className="w-full max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter un membre</DialogTitle>
                <DialogDescription>
                  Invitez un utilisateur en renseignant son email. Ses
                  informations AD seront synchronisées automatiquement.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="ex: jean.dupont@domaine.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select
                    value={null}
                    onValueChange={(value) =>
                      setForm((f) => ({ ...f, role: roles.find((r) => String(r.idRole) === value) ?? f.role }))
                    }
                  >
                    <SelectTrigger id="role">
                      {form.role.idRole ? (
                        <span>{form.role.libelle}</span>
                      ) : (
                        <SelectValue placeholder="Sélectionner un rôle" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {rolesLoading ? (
                        <SelectItem value="" disabled>
                          Chargement...
                        </SelectItem>
                      ) : roles.length === 0 ? (
                        <SelectItem value="" disabled>
                          Aucun rôle disponible
                        </SelectItem>
                      ) : (
                        roles.map((role) => (
                          <SelectItem key={role.idRole} value={String(role.idRole)}>
                            {role.libelle}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
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
                    {submitting ? "Ajout en cours..." : "Ajouter"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
