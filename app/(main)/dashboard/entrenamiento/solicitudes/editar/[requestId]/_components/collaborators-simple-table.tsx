"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Collaborator,
  CourseLevel,
  TrainingRequestCollaborator,
} from "@prisma/client";
import { AlertTriangle, MoreHorizontal, Trash, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLoading } from "@/components/providers/loading-provider";
import { cn } from "@/lib/utils";
import { ModalUploadDocument } from "./modal-upload-document";
import { TooltipInfo } from "@/components/tooltip-info";
import { ModalSuggestedDate } from "./modal-suggested-date";

interface Collaboratorss extends TrainingRequestCollaborator {
  collaborator:
    | (Collaborator & {
        trainingRequestsCollaborators:
          | TrainingRequestCollaborator[]
          | null
          | undefined;
      })
    | null
    | undefined;
  courseLevel: CourseLevel | null | undefined;
}

interface CollaboratorsSimpleTableProps {
  collaborators: Collaboratorss[] | null | undefined;
  trainingRequestId: string;
  coursesLevel: CourseLevel[] | null;
  isPending: boolean;
  isAdmin?: boolean;
  canManageRequests: boolean;
  canManagePermissions: boolean;
  trainingRequest: any;
  courseLevels: any;
}

export const CollaboratorsSimpleTable = ({
  collaborators,
  trainingRequestId,
  coursesLevel,
  trainingRequest,
  courseLevels,
  isPending,
  canManageRequests,
  canManagePermissions,
}: CollaboratorsSimpleTableProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();

  const [missingDocumentsCollaborators, setMissingDocumentsCollaborators] =
    useState<string[]>([]);

  useEffect(() => {
    const checkMissingDocuments = () => {
      const missingCollaborators: string[] = [];

      trainingRequest?.collaborators?.forEach(({ collaborator }: any) => {
        const requestedCourseLevelId =
          collaborator.trainingRequestsCollaborators.find(
            (trc: any) => trc.trainingRequestId === trainingRequest.id
          )?.courseLevelId;

        const requestedCourseLevel = courseLevels.find(
          (level: any) => level.id === requestedCourseLevelId
        );

        if (requestedCourseLevel) {
          requestedCourseLevel.requiredDocuments.forEach((document: any) => {
            const isDocumentAttached = collaborator.documents.some(
              (attachedDocument: any) =>
                attachedDocument.requiredDocumentId === document.id
            );

            if (!isDocumentAttached) {
              missingCollaborators.push(collaborator.id);
            }
          });
        }
      });

      const uniqueMissingCollaborators = Array.from(
        new Set(missingCollaborators)
      );
      setMissingDocumentsCollaborators(uniqueMissingCollaborators);
    };

    checkMissingDocuments();
  }, [trainingRequest, courseLevels]);

  const handleRemove = async (id: string) => {
    setLoadingApp(true);
    try {
      const { data } = await axios.delete(
        `/api/training-requests/${trainingRequestId}/members/${id}`
      );
      toast.success("Colaborador removido de la solicitud");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoadingApp(false);
    }
  };

  const onChange = async (courseLevelId: any, id: string) => {
    if (isPending || canManagePermissions || canManageRequests) {
      setLoadingApp(true);
      try {
        const { data } = await axios.patch(
          `/api/training-requests/${trainingRequestId}/members/${id}`,
          { courseLevelId }
        );
        router.refresh();
        toast.success("Nivel del colaborador actualizado");
      } catch (error) {
        console.error(error);
        toast.error("Ocurrió un error inesperado");
      } finally {
        setLoadingApp(false);
      }
    }
  };

  return (
    <Table className={cn("bg-blue-100")}>
      {/* <TableCaption>A list </TableCaption> */}
      <TableHeader className="w-full">
        <TableRow className="bg-slate-600 hover:bg-slate-600">
          <TableHead className="text-white">Nombre completo</TableHead>
          <TableHead className="text-white">N° Documento</TableHead>
          <TableHead className="text-white">Correo electrónico</TableHead>
          <TableHead className="text-white">Teléfono</TableHead>
          <TableHead className="text-white">Nivel</TableHead>
          <TableHead className="text-white">Documentos</TableHead>
          <TableHead className="text-white">Fecha sugerida</TableHead>
          {(isPending || canManagePermissions || canManageRequests) && (
            <TableHead className="text-right text-white">Acción</TableHead>
          )}
        </TableRow>
      </TableHeader>

      <TableBody className="relative">
        {collaborators?.map(({ collaborator, courseLevel }: any, index) => {
          const missingDocumentsMap = new Map();

          missingDocumentsCollaborators.forEach((collaboratorId) => {
            const isMissing = missingDocumentsCollaborators.includes(
              collaborator.id
            );
            missingDocumentsMap.set(collaboratorId, isMissing);
          });
          return (
            <TableRow
              // className={cn("font-semibold", !isPending && "opacity-60")}
              className={cn(
                "font-semibold border-b border-secondary",
                !isPending &&
                  collaborators[index].isDisallowed &&
                  "bg-red-700 hover:bg-red-800 text-white z-40"
              )}
              key={collaborator.id + courseLevel?.id}
            >
              <TableCell>{collaborator.fullname}</TableCell>
              <TableCell>{collaborator.numDoc}</TableCell>
              <TableCell>{collaborator.email}</TableCell>
              <TableCell>{collaborator.phone}</TableCell>

              <TableCell className="disabled:text-slate-800 ">
                <Select
                  defaultValue={courseLevel ? courseLevel.id : ""}
                  onValueChange={(e) => onChange(e, collaborator.id)}
                  disabled={!isPending && !(canManagePermissions || canManageRequests)}
                >
                  <SelectTrigger className="w-[180px] disabled:text-gray-800">
                    <SelectValue placeholder="🔴 Sin definir" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursesLevel?.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              {/* agregar Documentos de colaborador a solicitud */}
              <TableCell className={cn("animation relative")}>
                {courseLevel?.requiredDocuments &&
                  courseLevel?.requiredDocuments.length > 0 && (
                    <div
                      className={cn(
                        "flex gap-0 items-center justify-center absolute top-2 bottom-2 left-5 right-0 border border-slate-100 bg-secondary/60 rounded-md",
                        collaborators[index].isDisallowed && "z-30"
                      )}
                    >
                      <ModalUploadDocument
                        collaborator={collaborator}
                        courseLevel={courseLevel}
                        isDisallowed={collaborators[index].isDisallowed}
                      />
                      <span className="h-full flex items-center justify-start">
                        {missingDocumentsMap.get(collaborator.id) && ( //  obtener el estado isMissing del colaborador
                          <TooltipInfo text="Falta adjuntar uno o más documentos a este colaborador">
                            <div className="w-7 h-7 bg-yellow-400 cursor-help border border-accent rounded-full flex justify-center items-center">
                              <AlertTriangle className="w-5 h-5 text-orange-700" />
                            </div>
                          </TooltipInfo>
                        )}
                      </span>
                    </div>
                  )}
              </TableCell>
              <TableCell>
                <ModalSuggestedDate
                  trainingRequestCollaborator={collaborators[index]}
                  suggestedDate={
                    !!collaborators[index].suggestedDate
                      ? collaborators[index].suggestedDate!
                      : undefined
                  }
                  trainingRequestId={trainingRequestId}
                  courseLevel={courseLevel}
                  isDisallowed={collaborators[index].isDisallowed}
                />
              </TableCell>

              {(isPending || canManagePermissions || canManageRequests) && (
                <TableCell className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-4 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      className="hover:bg-slate-100"
                    >
                      <Button
                        variant="ghost"
                        onClick={() => handleRemove(collaborator.id)}
                        className="hover:bg-slate-300"
                      >
                        <Trash className="w-4 h-4 mr-2 text-red-500" />
                        Quitar de la lista
                      </Button>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          );
        })}
        {!isPending && !(canManagePermissions || canManageRequests) && (
          <TableRow>
            <TableCell className="absolute top-0 left-0 bottom-0 right-0 w-full h-full bg-white opacity-30 z-20"></TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter className="w-full">
        <TableRow className="w-full">
          <TableCell
            colSpan={
              isPending || canManagePermissions || canManageRequests ? 7 : 6
            }
            className="bg-blue-400/20"
          ></TableCell>
          <TableCell className="text-right bg-blue-400/20">
            Total colaboradores:{" "}
            <span className="font-bold max-h-[5px]">
              {" "}
              {collaborators?.length}
            </span>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
