import React, { useEffect, useRef, useState, useCallback } from "react";
import { Upload, FileText, Trash2, Loader2, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TopBar from "@/components/itsm/TopBar";
import {
  applicationService,
  knowledgeService,
} from "@/services/application.service";
import type { Application, KnowledgeFile } from "@/types/application";
import type { PaginatedResponse } from "@/types/ticket";

// const VIDEO_ACCEPT = ".mp4,.mov,.avi,.mkv,.webm,video/*";
const DOCUMENT_ACCEPT = ".pdf,.docx,.doc,.rst,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const MAX_DOCUMENTS = 5;
const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const DOCUMENT_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export default function Modules() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [documentPage, setDocumentPage] = useState<PaginatedResponse<KnowledgeFile> | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingKnowledge, setLoadingKnowledge] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [videosError, setVideosError] = useState<string | null>(null);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  // const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const selectedApp = applications.find((a) => a.idApplication === selectedAppId) ?? null;

  const documents = documentPage?.items ?? [];
  const totalCount = documentPage?.totalCount ?? 0;
  const totalPages = Math.max(1, documentPage?.totalPages ?? 1);
  const start = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, totalCount);

  const loadApplications = useCallback(async () => {
    try {
      setLoadingApps(true);
      setError(null);
      const apps = await applicationService.getAll();
      setApplications(apps);
      // if (apps.length > 0 && !selectedAppId) {
      //   setSelectedAppId(apps[0].idApplication);
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : "LOAD_FAILED");
    } finally {
      setLoadingApps(false);
    }
  }, [selectedAppId]);

  const loadKnowledge = useCallback(async () => {
    if (!selectedAppId) return;
    try {
      setLoadingKnowledge(true);
      setError(null);
      // setVideosError(null);
      setDocumentsError(null);
      const result = await knowledgeService.getDocuments(
        selectedAppId,
        currentPage,
        PAGE_SIZE,
        searchTerm
      );
      setDocumentPage(result);
    } catch (err) {
      setDocumentsError(err instanceof Error ? err.message : "DOCUMENTS_FETCH_FAILED");
      setDocumentPage(null);
    } finally {
      setLoadingKnowledge(false);
    }
  }, [selectedAppId, currentPage, searchTerm, refreshKey]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  useEffect(() => {
    loadKnowledge();
  }, [loadKnowledge]);

  // Reset pagination and search whenever the selected application changes.
  useEffect(() => {
    setCurrentPage(1);
    setSearchInput("");
    setSearchTerm("");
  }, [selectedAppId]);

  // Debounce the search input so we do not fire a request on every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  // const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file || !selectedAppId) return;

  //   if (!file.type.startsWith("video/")) {
  //     setUploadError("Veuillez sélectionner un fichier vidéo.");
  //     return;
  //   }

  //   try {
  //     setUploadingVideo(true);
  //     setUploadError(null);
  //     const uploaded = await knowledgeService.uploadVideo(selectedAppId, file);
  //     setVideos((prev) => [...prev, uploaded]);
  //   } catch (err) {
  //     setUploadError(
  //       err instanceof Error ? err.message : "VIDEO_UPLOAD_FAILED"
  //     );
  //   } finally {
  //     setUploadingVideo(false);
  //     if (videoInputRef.current) {
  //       videoInputRef.current.value = "";
  //     }
  //   }
  // };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length === 0 || !selectedAppId) return;

    if (selectedFiles.length > MAX_DOCUMENTS) {
      setUploadError(
        `Vous pouvez téléverser au maximum ${MAX_DOCUMENTS} documents à la fois.`
      );
      return;
    }

    const invalidFiles = selectedFiles.filter((file) => {
      const fileName = file.name.toLowerCase();
      const validExtension = fileName.endsWith(".pdf") || fileName.endsWith(".docx") || fileName.endsWith(".doc") || fileName.endsWith(".rst");
      return !DOCUMENT_TYPES.includes(file.type) && !validExtension;
    });

    if (invalidFiles.length > 0) {
      setUploadError(
        `Format non pris en charge : ${invalidFiles.map((f) => f.name).join(", ")}. Formats acceptés : PDF, DOCX.`
      );
      return;
    }

    try {
      setUploadingDoc(true);
      setUploadError(null);
      const result = await knowledgeService.uploadDocuments(selectedAppId, selectedFiles);

      const failedFiles = result.files.filter((file) => !file.success);
      if (failedFiles.length > 0) {
        setUploadError(
          `Échec du téléversement : ${failedFiles
            .map((file) => `${file.nomFichier}${file.errorReason ? ` (${file.errorReason})` : ""}`)
            .join(", ")}`
        );
      }

      // Reload from the first page without filters so the new files are visible.
      setCurrentPage(1);
      setSearchInput("");
      setSearchTerm("");
      setRefreshKey((key) => key + 1);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "DOCUMENT_UPLOAD_FAILED"
      );
    } finally {
      setUploadingDoc(false);
      if (docInputRef.current) {
        docInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!selectedAppId) return;
    const remaining = documents.length - 1;
    try {
      await knowledgeService.deleteKnowledge(id);
      if (remaining === 0 && currentPage > 1) {
        setCurrentPage((page) => Math.max(1, page - 1));
      } else {
        setRefreshKey((key) => key + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "DELETE_FAILED");
    }
  };

  const handleDownload = async (item: KnowledgeFile) => {
    try {
      const blob = await knowledgeService.download(item.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = item.nomFichier;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Téléchargement impossible.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-full mx-auto space-y-6">
        <TopBar />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium">Modules</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez les connaissances IA par application
            </p>
          </div>
        </div>

        {error && (
          <Card>
            <CardContent className="p-4 text-sm text-red-600">{error}</CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Application</CardTitle>
            <CardDescription>
              Sélectionnez l'application dont vous souhaitez gérer les
              connaissances.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingApps ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Chargement des applications...
              </div>
            ) : (
              <Select
                value={selectedAppId ? String(selectedAppId) : undefined}
                onValueChange={(value) =>
                  setSelectedAppId(Number(value))
                }
              >
                <SelectTrigger className="w-full max-w-sm">
                  {selectedApp ? (
                    <span>{selectedApp.libelle}</span>
                  ) : (
                    <SelectValue placeholder="Sélectionner une application" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {applications.map((app) => (
                    <SelectItem
                      key={app.idApplication}
                      value={String(app.idApplication)}
                    >
                      {app.libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {uploadError && (
          <Card>
            <CardContent className="p-4 text-sm text-red-600">{uploadError}</CardContent>
          </Card>
        )}

        {selectedApp && (
          <Tabs defaultValue="documents" className="space-y-4">
            <TabsList variant="line">
              {/* <TabsTrigger value="videos">Vidéos de formation</TabsTrigger> */}
              <TabsTrigger value="documents">Documentation</TabsTrigger>
            </TabsList>

            {/* <TabsContent value="videos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileVideo className="size-4" />
                    Vidéos de formation
                  </CardTitle>
                  <CardDescription>
                    Ajoutez des vidéos de formation pour l'application{" "}
                    <span className="font-medium text-foreground">
                      {selectedApp.libelle}
                    </span>
                    .
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed p-8 text-center cursor-pointer hover:border-foreground/30 transition-colors"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <div className="rounded-full bg-muted p-3">
                      <Upload className="size-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {uploadingVideo
                          ? "Téléchargement en cours..."
                          : "Cliquez pour ajouter une vidéo"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Formats acceptés : MP4, MOV, AVI, MKV, WebM
                      </p>
                    </div>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept={VIDEO_ACCEPT}
                      className="hidden"
                      onChange={handleVideoUpload}
                      disabled={uploadingVideo}
                    />
                  </div>

                  {uploadingVideo && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Téléchargement de la vidéo...
                    </div>
                  )}

                  {loadingKnowledge ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Chargement des vidéos...
                    </div>
                  ) : videosError ? (
                    <p className="text-sm text-red-600">Impossible de charger les vidéos : {videosError}</p>
                  ) : (
                    <div className="space-y-2">
                      {videos.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Aucune vidéo enregistrée pour cette application.
                        </p>
                      ) : (
                        videos.map((video) => (
                          <div
                            key={video.id}
                            className="flex items-center justify-between rounded-md border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <FileVideo className="size-4 text-muted-foreground" />
                              <div className="space-y-0.5">
                                <p className="text-sm font-medium">
                                  {video.nomFichier}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {video.applicationName} • Chunks: {video.chunkCount}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                Vidéo
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleDownload(video)}
                              >
                                <Download className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleDelete(video.id, "video")}
                              >
                                <Trash2 className="size-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent> */}

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="size-4" />
                    Documentation
                  </CardTitle>
                  <CardDescription>
                    Ajoutez de la documentation pour l'application{" "}
                    <span className="font-medium text-foreground">
                      {selectedApp.libelle}
                    </span>
                    .
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed p-8 text-center cursor-pointer hover:border-foreground/30 transition-colors"
                    onClick={() => docInputRef.current?.click()}
                  >
                    <div className="rounded-full bg-muted p-3">
                      <Upload className="size-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {uploadingDoc
                          ? "Téléchargement en cours..."
                          : "Cliquez pour ajouter des documents"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Formats acceptés : PDF, DOCX • Maximum {MAX_DOCUMENTS} documents à la fois
                      </p>
                    </div>
                    <input
                      ref={docInputRef}
                      type="file"
                      accept={DOCUMENT_ACCEPT}
                      className="hidden"
                      multiple
                      onChange={handleDocUpload}
                      disabled={uploadingDoc}
                    />
                  </div>

                  {uploadingDoc && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Téléchargement du document...
                    </div>
                  )}

                  <div className="relative max-w-sm">
                    <Search className="absolute left-2.5 top-2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un document par nom de fichier"
                      className="pl-8"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </div>

                  {documentsError ? (
                    <p className="text-sm text-red-600">Impossible de charger les documents : {documentsError}</p>
                  ) : loadingKnowledge && documents.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Chargement des documents...
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nom du fichier</TableHead>
                            {/* <TableHead>Application</TableHead> */}
                            <TableHead className="w-24">Chunks</TableHead>
                            <TableHead className="w-28 text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {documents.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="text-center text-sm text-muted-foreground"
                              >
                                {searchTerm
                                  ? "Aucun document ne correspond à votre recherche."
                                  : "Aucun document enregistré pour cette application."}
                              </TableCell>
                            </TableRow>
                          ) : (
                            documents.map((doc) => (
                              <TableRow key={doc.id}>
                                <TableCell className="text-sm">
                                  {doc.nomFichier}
                                </TableCell>
                                {/* <TableCell className="text-sm">
                                  {doc.applicationName}
                                </TableCell> */}
                                <TableCell className="text-sm">
                                  {doc.chunkCount}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      onClick={() => handleDownload(doc)}
                                    >
                                      <Download className="size-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      onClick={() => handleDelete(doc.id)}
                                    >
                                      <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>

                      {loadingKnowledge && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="size-4 animate-spin" />
                          Chargement des documents...
                        </div>
                      )}

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-muted-foreground">
                          Affichage de {start} à {end} sur {totalCount} document
                          {totalCount > 1 ? "s" : ""}
                        </p>
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                text="Précédent"
                                onClick={() =>
                                  setCurrentPage((page) => Math.max(1, page - 1))
                                }
                                className={
                                  currentPage === 1
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                                }
                              />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink isActive>
                                {currentPage} / {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationNext
                                text="Suivant"
                                onClick={() =>
                                  setCurrentPage((page) =>
                                    Math.min(totalPages, page + 1)
                                  )
                                }
                                className={
                                  currentPage === totalPages
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                                }
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
