import React, { useEffect, useRef, useState, useCallback } from "react";
import { Upload, FileVideo, FileText, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import TopBar from "@/components/itsm/TopBar";
import {
  applicationService,
  knowledgeService,
} from "@/services/application.service";
import type { Application, KnowledgeFile } from "@/types/application";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 octets";
  const k = 1024;
  const sizes = ["octets", "Ko", "Mo", "Go"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const VIDEO_ACCEPT = ".mp4,.mov,.avi,.mkv,.webm,video/*";
const DOCUMENT_ACCEPT = ".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export default function Modules() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [videos, setVideos] = useState<KnowledgeFile[]>([]);
  const [documents, setDocuments] = useState<KnowledgeFile[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingKnowledge, setLoadingKnowledge] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const selectedApp = applications.find((a) => a.idApplication === selectedAppId) ?? null;

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
      const [vids, docs] = await Promise.all([
        knowledgeService.getVideos(selectedAppId),
        knowledgeService.getDocuments(selectedAppId),
      ]);
      setVideos(vids);
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "KNOWLEDGE_LOAD_FAILED");
    } finally {
      setLoadingKnowledge(false);
    }
  }, [selectedAppId]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  useEffect(() => {
    if (selectedAppId) {
      loadKnowledge();
    } else {
      setVideos([]);
      setDocuments([]);
    }
  }, [selectedAppId, loadKnowledge]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAppId) return;

    if (!file.type.startsWith("video/")) {
      setUploadError("Veuillez sélectionner un fichier vidéo.");
      return;
    }

    try {
      setUploadingVideo(true);
      setUploadError(null);
      const uploaded = await knowledgeService.uploadVideo(selectedAppId, file);
      setVideos((prev) => [...prev, uploaded]);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "VIDEO_UPLOAD_FAILED"
      );
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAppId) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    const fileName = file.name.toLowerCase();
    const validExtension = fileName.endsWith(".pdf") || fileName.endsWith(".docx") || fileName.endsWith(".doc");

    if (!validTypes.includes(file.type) && !validExtension) {
      setUploadError("Veuillez sélectionner un document PDF ou DOCX.");
      return;
    }

    try {
      setUploadingDoc(true);
      setUploadError(null);
      const uploaded = await knowledgeService.uploadDocument(selectedAppId, file);
      setDocuments((prev) => [...prev, uploaded]);
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

  const handleDelete = async (id: number, type: "video" | "document") => {
    if (!selectedAppId) return;
    try {
      await knowledgeService.deleteKnowledge(selectedAppId, id);
      if (type === "video") {
        setVideos((prev) => prev.filter((v) => v.id !== id));
      } else {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "DELETE_FAILED");
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
          <Tabs defaultValue="videos" className="space-y-4">
            <TabsList variant="line">
              <TabsTrigger value="videos">Vidéos de formation</TabsTrigger>
              <TabsTrigger value="documents">Documentation</TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="space-y-4">
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
                                  {video.nom}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(video.taille)} •{" "}
                                  {formatDate(video.dateUpload)}
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
            </TabsContent>

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
                          : "Cliquez pour ajouter un document"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Formats acceptés : PDF, DOCX
                      </p>
                    </div>
                    <input
                      ref={docInputRef}
                      type="file"
                      accept={DOCUMENT_ACCEPT}
                      className="hidden"
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

                  {loadingKnowledge ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Chargement des documents...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {documents.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Aucun document enregistré pour cette application.
                        </p>
                      ) : (
                        documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between rounded-md border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="size-4 text-muted-foreground" />
                              <div className="space-y-0.5">
                                <p className="text-sm font-medium">
                                  {doc.nom}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(doc.taille)} •{" "}
                                  {formatDate(doc.dateUpload)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                Document
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleDelete(doc.id, "document")}
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
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
