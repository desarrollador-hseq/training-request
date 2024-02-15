"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Collaborator,
  Company,
  Course,
  CourseLevel,
  RequiredDocument,
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
import { useRouter, usePathname } from "next/navigation";
import { IdentificationFileForm } from "@/app/(main)/dashboard/entrenamiento/colaboradores/[collaboratorId]/_components/identification-file-form";
import { DateRange } from "react-day-picker";
import { ButtonScheduleCollaborator } from "./button-schedule-collaborator";
import { ArlForm } from "./arl-form";

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
  const pathname = usePathname();
  const { setLoadingApp } = useLoading();


  const [trainingRequest, setTrainingRequest] = useState(
    trainingRequestCollaborator
  );
  const [courseLevelId, setCourseLevelId] = useState<string | undefined>(
    trainingRequestCollaborator?.courseLevel?.id
  );

  const [date, setDate] = useState<DateRange | undefined>({
    from: trainingRequestCollaborator?.startDate || undefined,
    to: trainingRequestCollaborator?.endDate || undefined,
  });

  const [document, setDocument] = useState(
    trainingRequestCollaborator?.courseLevel?.requiredDocuments?.map(
      (m) => m
    ) || []
  );
  const [documentsRequired, setDocumentsRequired] = useState<
    RequiredDocument[] | null | undefined
  >();
  const [isDisallowed, setIsDisallowed] = useState<boolean>(
    trainingRequestCollaborator?.isDisallowed || false
  );

  useEffect(() => {
    setDocument(
      trainingRequestCollaborator?.courseLevel?.requiredDocuments?.map(
        (m) => m
      ) || []
    );
  }, [trainingRequestCollaborator?.courseLevel?.requiredDocuments]);

  const onChange = async (courseLevelId: string, collaboratorId?: string) => {
    setCourseLevelId(courseLevelId);
    try {
      setLoadingApp(true);
      const { data } = await axios.patch(
        `/api/training-requests/${trainingRequestCollaborator?.trainingRequestId}/members/${collaboratorId}`,
        { courseLevelId }
      );
      toast.success("Colaborador actualizado");
      router.replace(pathname);
      // router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    }
    setLoadingApp(false);
  };

  useEffect(() => {
    setLoadingApp(true);
    if (!courseLevelId) return;
    const getdocumentsRequired = async () => {
      const { data } = await axios.get(
        `/api/course-levels/${courseLevelId}/required-document`
      );
      setDocumentsRequired(data);
    };
    getdocumentsRequired();
    router.refresh();
    setLoadingApp(false);
  }, [courseLevelId]);

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
            trainingRequestId={trainingRequestCollaborator?.trainingRequestId}
            courseName={trainingRequestCollaborator?.courseLevel?.course?.name}
            levelName={trainingRequestCollaborator?.courseLevel?.name}
            toEmail={trainingRequestCollaborator?.collaborator?.email}
            colDocument={`${trainingRequestCollaborator?.collaborator?.docType} ${trainingRequestCollaborator?.collaborator?.numDoc}`}
            colName={trainingRequestCollaborator?.collaborator?.fullname}
            collaboratorId={trainingRequestCollaborator?.collaborator?.id}
            isDisallowed={trainingRequestCollaborator?.isDisallowed}
            setIsDisallowed={setIsDisallowed}
          />
        )}
      </div>

      <div>
        <PickScheduleDates
          isDisallowed={isDisallowed}
          setDate={setDate}
          date={date}
          collaboratorId={trainingRequestCollaborator?.collaborator?.id}
          collaboratorName={trainingRequestCollaborator?.collaborator?.fullname}
          collaboratorPhone={trainingRequestCollaborator?.collaborator?.phone}
          company={trainingRequestCollaborator?.collaborator?.company}
          courseName={trainingRequestCollaborator?.courseLevel?.course?.name}
          trainingRequestCollaborator={trainingRequestCollaborator}
          courseLevelName={trainingRequestCollaborator?.courseLevel?.name}
          trainingRequestId={trainingRequestCollaborator?.trainingRequestId}
          scheduledDate={{
            from: trainingRequest?.startDate,
            to: trainingRequest?.endDate,
          }}
        />
      </div>

      {!!date?.from && (
        <ButtonScheduleCollaborator
          collaboratorId={trainingRequestCollaborator?.collaborator?.id}
          company={trainingRequestCollaborator?.collaborator?.company}
          collaboratorName={trainingRequestCollaborator?.collaborator?.fullname}
          trainingRequestCollaborator={trainingRequestCollaborator}
          collaboratorPhone={trainingRequestCollaborator?.collaborator?.phone}
          trainingRequestId={trainingRequestCollaborator?.trainingRequestId}
          courseName={
            trainingRequestCollaborator?.courseLevel?.course?.shortName
          }
          levelName={trainingRequestCollaborator?.courseLevel?.name}
          isDisallowed={isDisallowed}
          scheduledDate={{
            to: trainingRequestCollaborator?.endDate,
            from: trainingRequestCollaborator?.startDate,
          }}
          date={date}
        />
      )}

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
                    text={trainingRequestCollaborator?.collaborator?.company?.businessName}
                  />
                  <CardItemInfo label="Nit" text={trainingRequestCollaborator?.collaborator?.company?.nit} />
                  <CardItemInfo
                    label="Sector"
                    text={trainingRequestCollaborator?.collaborator?.company?.sector}
                  />
                  <CardItemInfo
                    label="Estado"
                    text={trainingRequestCollaborator?.collaborator?.company?.active ? "Activa" : "Inactiva"}
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
                        onValueChange={(e) => onChange(e, trainingRequestCollaborator?.collaborator?.id)}
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
                  <div>
                    <ArlForm
                      arlName={
                        trainingRequestCollaborator?.collaborator?.arlName
                      }
                      collaboratorId={trainingRequestCollaborator?.collaborator?.id}
                    />
                  </div>
                </div>
              </div>

                <SubtitleSeparator className="bg-primary" text="Documentos adjuntados"></SubtitleSeparator>
              <div className="px-2 grid md:grid-cols-2 gap-2">
                {documentsRequired?.map((doc, index) => (
                  <div key={doc.id + index} className="">
                    <div>
                      <IdentificationFileForm
                        label={doc.name}
                        field={"documentLink"}
                        collaboratorId={trainingRequestCollaborator?.collaborator?.id}
                        courseLevelId={courseLevelId}
                        documentRequiredId={doc.id}
                        ubiPath="colaboradores/documentos"
                      />
                    </div>
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
