"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CollaboratorCourseLevelDocument } from "@prisma/client";
import axios from "axios";
import {
  Cloud,
  ImageIcon,
  Loader2,
  Pencil,
  PlusCircle,
  UploadCloud,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ModalImage from "react-modal-image";
import { toast } from "sonner";
import { z } from "zod";
import { FileInputForm } from "@/components/file-input-form";
import PdfRenderer from "@/components/pdf-renderer";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { useLoading } from "@/components/providers/loading-provider";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";

interface fileFormProps {
  collaboratorId: string;
  courseLevelId: string;
  documentRequiredId: string;
  field: string;
  ubiPath?: string;
  label: string;
}
const MAX_FILE_SIZE = 1024 * 1024 * 1;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
const formSchema = z.object({
  file: z
    .any()
    .or(z.string())
    .refine((file) => file?.length !== 0, "File is required")
    .refine((files) => {
      return files?.size <= MAX_FILE_SIZE;
    }, `El tamaño maximo del archivo es de 1MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.type),
      "Solo los formtatos de .jpg, .jpeg, .png, y .pdf son aceptados"
    ),
});

export const IdentificationFileForm = ({
  collaboratorId,
  courseLevelId,
  documentRequiredId,
  field,
  ubiPath,
  label,
}: fileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [file, setFile] = useState<CollaboratorCourseLevelDocument | null>();
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const toggleEdit = () => setIsEditing((current) => !current);

  const [isUploading, setIsUploading] = useState<boolean | null>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progressInterval, setProgressInterval] = useState<any | null>();

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
      // Handle file upload logic here
    },
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".svg"],
      "application/pdf": [".pdf"],
    },
  });

  useEffect(() => {
    if (selectedFile) {
      setValue("file", selectedFile, { shouldValidate: true });
    }
  }, [selectedFile]);

  const isPdf = useMemo(
    () => file?.documentLink.split(".").pop() === "pdf",
    [file]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: file || undefined,
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const { setValue } = form;

  useEffect(() => {
    setLoadingApp(true);
    const getDocumentCollaborator = async () => {
      try {
        const { data } = await axios.get(
          `/api/collaborators/${collaboratorId}/course-level/${courseLevelId}/document-required/${documentRequiredId}`
        );
        setFile(data);
        setFileUrl(data.documentLink);
      } catch (error) {
        console.log("sin documentos para el usuario");
      }
    };
    getDocumentCollaborator();
    setLoadingApp(false);
  }, [documentRequiredId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", values.file);
    ubiPath && formData.append("ubiPath", ubiPath);

    const progressInterval = startSimulatedProgress();
    if (fileUrl) {
      const urlKey = new URL(fileUrl).pathname.substring(1).split("/").pop();
      const key = urlKey;
      try {
        const res = await axios.delete(`/api/upload/file/${key}`, {
          data: { ubiPath: "colaboradores/documentos" },
        });
      } catch (error) {
        console.log("No se pudo borrar el archivo" + error);
      }
    }

    try {
      const { data } = await axios.post(`/api/upload/file/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (fileUrl) {
        await axios.patch(
          `/api/collaborators/${collaboratorId}/course-level/${courseLevelId}/document-required/${documentRequiredId}`,
          {
            documentLink: data.url,
          }
        );
      } else {
        await axios.post(
          `/api/collaborators/${collaboratorId}/course-level/${courseLevelId}/document-required/${documentRequiredId}`,
          {
            documentLink: data.url,
          }
        );
      }

      toast.success("Documento actualizado");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error(
        "Ocurrió un error inesperado, por favor intentelo nuevamente"
      );
    } finally {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const startSimulatedProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 200);

    return interval;
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 w-full h-full">
      <div className="font-medium flex items-center justify-between">
        {label}
        <Button
          onClick={toggleEdit}
          variant="secondary"
          className={cn(isEditing && "bg-slate-500 hover:bg-slate-700")}
        >
          {isEditing && <>Cancelar</>}
          {!isEditing && !file && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar documento
            </>
          )}
          {!isEditing && file && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Actualizar archivo
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!file ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md w-full">
            <ImageIcon className="w-10 h-10 text-slate-500" />
          </div>
        ) : (
          <div className="mt-2 min-w-full">
            {isPdf ? (
              <div className="max-h-[]">
                {fileUrl && <PdfRenderer url={fileUrl} />}
              </div>
            ) : (
              <div>
                <ModalImage
                  onError={() => <div>errorrr</div>}
                  small={fileUrl ? fileUrl : ""}
                  large={fileUrl}
                  alt={label}
                />
              </div>
            )}
          </div>
        ))}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={"flex flex-col items-center mt-2 p-1 w-full"}
          >
            <div
              {...getRootProps()}
              className={"dropzone w-full"}
              style={{
                background: !!selectedFile ? "transparent" : "#4e71b185",
                borderRadius: "7px",
                border: !!selectedFile ? "none" : "3px dashed #4e71b1",
                color: "white",
              }}
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center pb-6 mb-3 w-full  "
                )}
              >
                {uploadProgress !== 100 ? (
                  <div className="min-h-[100px] max-w-max flex flex-col gap-3 items-center justify-center">
                    {selectedFile ? (
                      <div className="flex max-w-max  bg-secondary items-center justify-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200 p-4">
                        <div className="px-3 py-2 h-full grid place-items-center">
                          {selectedFile.type === "application/pdf" ? (
                            // <File className="h-6 w-6 text-white" />
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="25"
                              height="25"
                              viewBox="0 0 256 256"
                            >
                              <path
                                fill="#ffffff"
                                d="M200 164v8h12a12 12 0 0 1 0 24h-12v12a12 12 0 0 1-24 0v-56a12 12 0 0 1 12-12h32a12 12 0 0 1 0 24Zm-108 8a32 32 0 0 1-32 32h-4v4a12 12 0 0 1-24 0v-56a12 12 0 0 1 12-12h16a32 32 0 0 1 32 32m-24 0a8 8 0 0 0-8-8h-4v16h4a8 8 0 0 0 8-8m100 8a40 40 0 0 1-40 40h-16a12 12 0 0 1-12-12v-56a12 12 0 0 1 12-12h16a40 40 0 0 1 40 40m-24 0a16 16 0 0 0-16-16h-4v32h4a16 16 0 0 0 16-16M36 108V40a20 20 0 0 1 20-20h96a12 12 0 0 1 8.49 3.52l56 56A12 12 0 0 1 220 88v20a12 12 0 0 1-24 0v-4h-48a12 12 0 0 1-12-12V44H60v64a12 12 0 0 1-24 0m124-51v23h23Z"
                              />
                            </svg>
                          ) : (
                            <ImageIcon className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <p className="px-3 py-2 h-full text-sm truncate text-white font-semibold max-w-[300px] text-ellipsis">
                          {selectedFile.name}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Cloud className="h-10 w-10 text-white mb-2" />
                        <p className="mb-2 text-sm text-white">
                          <span className="font-semibold text-base">
                            Click para subir
                          </span>{" "}
                          o arrastra el archivo aquí
                        </p>
                        <p className="text-sm text-zinc-200">
                          Formatos aceptados: jpg, jpeg, png y pdf
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="mb-2 text-sm font-semibold flex flex-col items-center text-emerald-300">
                      <UploadCloud className="w-16 h-16 " />
                      Archivo subido correctamente
                    </p>
                  </>
                )}
              </div>

              {!!uploadProgress && (
                <Progress
                  indicatorColor={uploadProgress === 100 ? "bg-green-300" : ""}
                  value={uploadProgress}
                  className="h-1 w-full bg-zinc-200"
                />
              )}

              <input {...getInputProps()} />
              {!selectedFile && isDragActive && (
                <p>Haga clic o arrastre un archivo para cargarlo</p>
              )}
            </div>

            <Button
              disabled={isSubmitting || !isValid}
              className={`w-full max-w-full gap-3 mt-2 ${
                !selectedFile && "hidden"
              }`}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {selectedFile && (isEditing && file ? "Actualizar" : "Subir")}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
