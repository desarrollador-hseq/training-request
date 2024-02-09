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
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [collaborator, setCollaborator] = useState(
    trainingRequestCollaborator?.collaborator
  );
  const [courseLevel, setCourseLevel] = useState(
    trainingRequestCollaborator?.courseLevel
  );
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

  useEffect(() => {
    console.log({ courseLevel });
  }, [courseLevel]);

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
    setDocument(courseLevel?.requiredDocuments?.map((m) => m) || []);
  }, [courseLevel]);

  const onChange = async (courseLevelId: string, collaboratorId: string) => {
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
            emailResponsibleCompany={collaborator?.company?.email}
            trainingRequestCollaboratorId={
              trainingRequestCollaborator?.trainingRequest?.id
            }
            collaboratorId={collaborator?.id}
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
          collaboratorId={collaborator?.id}
          collaboratorName={collaborator?.fullname}
          collaboratorPhone={collaborator?.phone}
          company={trainingRequest?.collaborator?.company}
          courseName={trainingRequest?.courseLevel?.course?.name}
          trainingRequestCollaborator={trainingRequest}
          courseLevelName={trainingRequest?.courseLevel?.name}
          trainingRequestId={trainingRequest?.trainingRequestId}
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
          courseName={trainingRequestCollaborator?.courseLevel?.course?.name}
          courseLevelName={trainingRequestCollaborator?.courseLevel?.name}
          trainingRequestId={trainingRequestCollaborator?.trainingRequestId}
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
                    text={collaborator?.company?.businessName}
                  />
                  <CardItemInfo label="Nit" text={collaborator?.company?.nit} />
                  <CardItemInfo
                    label="Sector"
                    text={collaborator?.company?.sector}
                  />
                  <CardItemInfo
                    label="Estado"
                    text={collaborator?.company?.active ? "Activa" : "Inactiva"}
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
                    text={courseLevel?.course?.name}
                  />
                  <CardItemInfo
                    label="Nivel"
                    highlight
                    text={
                      <Select
                        defaultValue={
                          trainingRequestCollaborator?.courseLevelId!
                        }
                        onValueChange={(e) => onChange(e, collaborator?.id)}
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

                  <CardItemInfo label="# Horas" text={courseLevel?.hours} />
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
                    text={collaborator?.fullname}
                  />
                  <CardItemInfo
                    label="N° de documento"
                    text={`${collaborator?.docType} ${collaborator?.numDoc}`}
                  />
                  <CardItemInfo
                    label="Correo Electrónico"
                    text={collaborator?.email}
                  />
                  <CardItemInfo
                    label="Teléfono movil"
                    text={collaborator?.phone}
                  />
                  <div>
                    <ArlForm
                      arlName={trainingRequestCollaborator?.collaborator?.arlName}
                      collaboratorId={collaborator?.id}
                    />
                  </div>
                </div>
              </div>

              <div className="px-2 grid md:grid-cols-2 gap-2">
                {documentsRequired?.map((doc, index) => (
                  <div key={doc.id + index} className="">
                    <div>
                      <IdentificationFileForm
                        // apiUrl={`/api/upload/file`}
                        // update={`/api/collaborators/${trainingRequestCollaborator?.collaborator?.id}/course-level/${trainingRequestCollaborator?.courseLevelId}/document-required/${doc.collaboratorCourseLevelDocument[0].requiredDocumentId}`}
                        label={doc.name}
                        field={"documentLink"}
                        // file={docc.documentLink}
                        collaboratorId={collaborator?.id}
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
