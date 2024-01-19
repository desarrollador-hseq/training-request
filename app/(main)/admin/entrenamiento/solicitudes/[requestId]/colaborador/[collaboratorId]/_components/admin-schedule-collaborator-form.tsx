"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Collaborator,
  Company,
  Course,
  CourseLevel,
  TrainingRequest,
  TrainingRequestCollaborator,
} from "@prisma/client";
import { FileUploadForm } from "@/components/file-upload-form";
import { SubtitleSeparator } from "@/components/subtitle-separator";
import { PickScheduleDates } from "./pick-schedule-dates";
import { MarkCollaboratorDisallowed } from "./mark-collaborator-disallowed";
import { CardItemInfo } from "@/components/card-item-info";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import { useLoading } from "@/components/providers/loading-provider";
import { useRouter } from "next/navigation";

interface AdminScheduleCollaboratorFormProps {
  trainingRequestCollaborator:
    | (TrainingRequestCollaborator & {
        courseLevel:
          | (CourseLevel & {
              course: Course | null | undefined;
              requiredDocuments:
                | {
                    name: string;
                    collaboratorCourseLevelDocument:
                      | {
                          collaboratorId: string | undefined | null;
                          requiredDocumentId: string | undefined | null;
                          documentLink: string | undefined | null;
                          name: string | undefined | null;
                        }[]
                      | null
                      | undefined;
                  }[]
                | null
                | undefined;
            })
          | null
          | undefined;
        trainingRequest: TrainingRequest | null | undefined;
        collaborator:
          | (Collaborator & { company: Company | null | undefined })
          | null
          | undefined;
      })
    | null;
  courseLevels: CourseLevel[] | null | undefined;
}

export const AdminScheduleCollaboratorForm = ({
  trainingRequestCollaborator,
  courseLevels,
}: AdminScheduleCollaboratorFormProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [document, setDocument] = useState(
    trainingRequestCollaborator?.courseLevel?.requiredDocuments?.map((m) => m) || []
  );
  const [isDisallowed, setIsDisallowed] = useState<boolean>(
    trainingRequestCollaborator?.isDisallowed || false
  );

  useEffect(() => {
    // Actualizar el estado 'document' cuando cambia 'courseLevel'
    setDocument(trainingRequestCollaborator?.courseLevel?.requiredDocuments?.map((m) => m) || []);
  }, [trainingRequestCollaborator?.courseLevel]);

  const onChange = async (courseLevelId: any, collaboratorId: string) => {
    setLoadingApp(true);
    try {
      const { data } = await axios.patch(
        `/api/training-requests/${trainingRequestCollaborator?.trainingRequestId}/members/${collaboratorId}`,
        { courseLevelId }
      );
      toast.success("Colaborador actualizado");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoadingApp(false);
    }
  };


  // useEffect(() => {
  //   setLoadingApp(true);
    
  //   getDocumentCollaborator();
  //   setLoadingApp(false);
  // }, []);

  const getDocumentCollaborator = async () => {
    const { data } = await axios.get(
      `/api/collaborators/${trainingRequestCollaborator?.collaborator?.id}/course-level/${trainingRequestCollaborator?.courseLevelId}/document-required/${trainingRequestCollaborator?.courseLevel?.requiredDocuments[0].id}`
    );
    setFile(data);
    setFileUrl(data.documentLink);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="absolute top-2 right-6">
        {!trainingRequestCollaborator?.isScheduled && (
          <MarkCollaboratorDisallowed
            emailResponsibleCompany={
              trainingRequestCollaborator?.collaborator?.company?.email
            }
            trainingRequestCollaboratorId={
              trainingRequestCollaborator?.trainingRequest?.id
            }
            collaboratorId={trainingRequestCollaborator?.collaborator?.id}
            isDisallowed={trainingRequestCollaborator?.isDisallowed}
            setIsDisallowed={setIsDisallowed}
          />
        )}
      </div>

      <div>
        <PickScheduleDates
          isDisallowed={isDisallowed}
          collaboratorId={trainingRequestCollaborator?.collaborator?.id}
          trainingRequestId={trainingRequestCollaborator?.trainingRequestId}
          scheduledDate={{
            from: trainingRequestCollaborator?.startDate,
            to: trainingRequestCollaborator?.endDate,
          }}
        />
      </div>

      <Card className="bg-slate-100 ">
        <CardHeader className="mb-3 p-0">
          <div className="p-0 overflow-hidden rounded-md bg-blue-50">
            <div className="p-0">
              <SubtitleSeparator text="Datos de la empresa" />
            </div>
            <div>
              <div className="flex md:items-center md:justify-start h-full w-full">
                <div className="w-full grid xs:grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-2 md:gap-3 p-2">
                  <CardItemInfo
                    label="Razón social"
                    text={
                      trainingRequestCollaborator?.collaborator?.company
                        ?.businessName
                    }
                  />
                  <CardItemInfo
                    label="Nit"
                    text={
                      trainingRequestCollaborator?.collaborator?.company?.nit
                    }
                  />
                  <CardItemInfo
                    label="Sector"
                    text={
                      trainingRequestCollaborator?.collaborator?.company?.sector
                    }
                  />
                  <CardItemInfo
                    label="Estado"
                    text={
                      trainingRequestCollaborator?.collaborator?.company?.active
                        ? "Activa"
                        : "Inactiva"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card className="bg-slate-100">
        <CardHeader className="mb-3 p-0">
          <div className="p-0 overflow-hidden rounded-md bg-blue-50">
            <div className="p-0">
              <SubtitleSeparator text="Datos de la solicitud" />
            </div>
            <div>
              <div className="flex md:items-center md:justify-start h-full w-full">
                <div className="w-full grid xs:grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-2 md:gap-3 p-2">
                  <CardItemInfo
                    label="Tipo"
                    highlight
                    text={
                      trainingRequestCollaborator?.courseLevel?.course?.name
                    }
                  />
                  <CardItemInfo
                    label="Nivel"
                    highlight
                    text={
                      <Select
                        defaultValue={
                          trainingRequestCollaborator?.courseLevelId!
                        }
                        onValueChange={(e) =>
                          onChange(
                            e,
                            trainingRequestCollaborator?.collaborator?.id
                          )
                        }
                        // disabled={!isPending}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="🔴 Sin definir" />
                        </SelectTrigger>
                        <SelectContent>
                          {courseLevels?.map((level) => (
                            <SelectItem key={level.id} value={level.id}>
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    }
                  />

                  <CardItemInfo
                    label="# Horas"
                    text={trainingRequestCollaborator?.courseLevel?.hours}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card className="bg-slate-100">
        <CardHeader className="mb-3 p-0">
          <div className="p-0 overflow-hidden rounded-md bg-blue-50">
            <div className="p-0">
              <SubtitleSeparator text="Datos del colaborador" />
            </div>
            <div>
              <div className="flex md:items-center md:justify-start h-full w-full">
                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 p-2">
                  <CardItemInfo
                    label="Nombre completo"
                    text={trainingRequestCollaborator?.collaborator?.fullname}
                  />
                  <CardItemInfo
                    label="N° de documento"
                    text={`${trainingRequestCollaborator?.collaborator?.docType} ${trainingRequestCollaborator?.collaborator?.numDoc}`}
                  />
                  <CardItemInfo
                    label="Correo Electrónico"
                    text={trainingRequestCollaborator?.collaborator?.email}
                  />
                  <CardItemInfo
                    label="Teléfono movil"
                    text={trainingRequestCollaborator?.collaborator?.phone}
                  />
                </div>
              </div>

              <div className="px-2 grid md:grid-cols-2 gap-2">
                {document?.map((doc, index) => (
                    <div key={doc.name + index} className="">
                      {doc?.collaboratorCourseLevelDocument && (
                        <div>
                          <FileUploadForm
                            apiUrl={`/api/upload/file`}
                            update={`/api/collaborators/${trainingRequestCollaborator?.collaborator?.id}/course-level/${trainingRequestCollaborator?.courseLevelId}/document-required/${doc.collaboratorCourseLevelDocument[0].requiredDocumentId}`}
                            label={doc.name}
                            field={"documentLink"}
                            file={
                              doc?.collaboratorCourseLevelDocument[0]
                                ?.documentLink
                            }
                            ubiPath="colaboradores/documentos"
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
