"use client";

import { FileUploadForm } from "@/components/file-upload-form";
import { SubtitleSeparator } from "@/components/subtitle-separator";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Collaborator,
  CollaboratorCourseLevelDocument,
  Company,
  Course,
  CourseLevel,
  RequiredDocument,
  TrainingRequest,
  TrainingRequestCollaborator,
} from "@prisma/client";
import { ReactNode, useEffect, useState } from "react";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PickDates } from "./pick-dates";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { SimpleModal } from "@/components/simple-modal";
import axios from "axios";
import { toast } from "sonner";
import { useLoading } from "@/components/providers/loading-provider";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

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
}

export const AdminScheduleCollaboratorForm = ({
  trainingRequestCollaborator,
}: AdminScheduleCollaboratorFormProps) => {
  const [document, setDocument] = useState(
    trainingRequestCollaborator?.courseLevel?.requiredDocuments?.map((m) => m)
  );

  const [date, setDate] = useState<DateRange | undefined>();
  const [notifyEmailDisallowed, setNotifyEmailDisallowed] =
    useState<boolean>(false);
  const [disallowedMessage, setDisallowedMessage] = useState<
    string | undefined
  >();
  const { setLoadingApp } = useLoading();

  const handleScheduleDate = async () => {
    setLoadingApp(true);
    try {
      await axios.patch(
        `/api/training-requests/${trainingRequestCollaborator?.trainingRequest?.id}/members/${trainingRequestCollaborator?.collaborator?.id}/schedule`,
        { startDate: date?.from, endDate: date?.to }
      );

      toast.success("Fecha guardada");
    } catch (error) {
      toast.error(
        "Error al programar la fecha de formación, por favor intentelo nuevamente"
      );
    }

    try {
      await axios.post("/api/messages/", {
        msisdn: "",
        message: `fue programado para asistir a una reunion el dia ${date?.from}`,
      });
      toast.success("SMS enviado");
    } catch (error) {
      toast.error("Error al enviar el mensaje de texto al colaborador");
      console.log({ errorApiSms: error });
    }

    setLoadingApp(false);
  };

  const handleDisallowed = async () => {
    setLoadingApp(true);

    try {
      await axios.patch(
        `/api/training-requests/${trainingRequestCollaborator?.trainingRequest?.id}/members/${trainingRequestCollaborator?.collaborator?.id}/disallowed`
      );
      toast.info("Colaborador marcado como no autorizado");
    } catch (error) {
      toast.error("Error al marcar al colaborador que no cumple con información, por favor intentelo nuevamente");
    }

    if (notifyEmailDisallowed) {
      try {
        console.log("disallowed");
        toast.info("Correo enviado correctamente");
      } catch (error) {
        toast.error(
          "Error al enviar el correo de notificación a la persona responsable de la plataforma"
        );
        console.log({ errorApiSms: error });
      }
    }

    setLoadingApp(false);

  };

  console.log({ selec: JSON.stringify(trainingRequestCollaborator) });
  return (
    <div className="flex flex-col gap-2">
      <Card className="bg-slate-100 ">
        <CardHeader className="mb-3 p-0">
          <div className="p-0 overflow-hidden rounded-md bg-blue-50">
            <div className="p-0">
              <SubtitleSeparator text="Datos de la empresa" />
            </div>
            <div>
              <div className="flex md:items-center md:justify-start h-full w-full">
                <div className="w-full grid xs:grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-2 md:gap-3 p-2">
                  <CardInfo
                    label="Razón social"
                    text={
                      trainingRequestCollaborator?.collaborator?.company
                        ?.businessName
                    }
                  />
                  <CardInfo
                    label="Nit"
                    text={
                      trainingRequestCollaborator?.collaborator?.company?.nit
                    }
                  />
                  <CardInfo
                    label="Sector"
                    text={
                      trainingRequestCollaborator?.collaborator?.company?.sector
                    }
                  />
                  <CardInfo
                    label="Estado"
                    text={
                      trainingRequestCollaborator?.collaborator?.company?.active
                        ? "Activa"
                        : "Inactiva"
                    }
                  />

                  {/* <CardInfo
                    label="Fecha de registro del colaborador"
                    text={format(
                      trainingRequestCollaborator?.collaborator?.createdAt,
                      "PPP",
                      {
                        locale: es,
                      }
                    )}
                  /> */}
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
                  <CardInfo
                    label="Tipo"
                    highlight
                    text={
                      trainingRequestCollaborator?.courseLevel?.course?.name
                    }
                  />
                  <CardInfo
                    label="Nivel"
                    highlight
                    text={trainingRequestCollaborator?.courseLevel?.name}
                  />
                  <CardInfo
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
                  <CardInfo
                    label="Nombre completo"
                    text={trainingRequestCollaborator?.collaborator?.fullname}
                  />
                  <CardInfo
                    label="N° de documento"
                    text={`${trainingRequestCollaborator?.collaborator?.docType} ${trainingRequestCollaborator?.collaborator?.numDoc}`}
                  />
                  <CardInfo
                    label="Correo Electrónico"
                    text={trainingRequestCollaborator?.collaborator?.email}
                  />
                  <CardInfo
                    label="Teléfono movil"
                    text={trainingRequestCollaborator?.collaborator?.phone}
                  />
                </div>
              </div>

              <div className="w-full mx-2 ">
                {document?.map((doc, index) => (
                  <div key={doc.name + index} className="grid md:grid-cols-2">
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

        <SimpleModal
          // btnDisabled={!!!date}
          onAcept={() => handleDisallowed()}
          textBtn="Marcar como no admitido"
          title="Marcar como no admitido"
        >
          <p>
            Desea marcar el colaborador tiene documento incorrectos o vencidos
          </p>
          <Checkbox checked={notifyEmailDisallowed} onCheckedChange={(e) => setNotifyEmailDisallowed(!!e)} />
          {notifyEmailDisallowed && (
            <Textarea
              value={disallowedMessage}
              onChange={(e) => setDisallowedMessage(e.target.value)}
            />
          )}
        </SimpleModal>
      </Card>

      
        <div className="w-full bg-blue-300 p-3 flex flex-col lg:flex-row gap-3">
          <PickDates disabled={trainingRequestCollaborator?.isDisallowed} date={date} setDate={setDate} />
          <div>
            {/* <Button className="">Programar</Button> */}
            <SimpleModal
              btnDisabled={trainingRequestCollaborator?.isDisallowed }
              btnClass=""
              textBtn="Programar"
              onAcept={() => handleScheduleDate()}
              title="Programar colaborador"
            >
              {date && (
                <div>
                  Desea programar el colaborador{" "}
                  {trainingRequestCollaborator?.collaborator?.fullname} , desde
                  el día
                  {format(date?.from, "PPP", { locale: es })} hasta el día
                  {format(date?.to, "PPP", { locale: es })}
                </div>
              )}
            </SimpleModal>
          </div>
        </div>
      
    </div>
  );
};

const CardInfo = ({
  label,
  text,
  highlight,
}: {
  label: string;
  text?: string | ReactNode | null;
  highlight?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col p-1 items-center bg-blue-100 min-w-fit ${
        highlight && "bg-blue-200 border-4 border-blue-500"
      }`}
    >
      <div>
        <h5 className="text-lg font-bold text-center ">{label}</h5>
        <p
          className={`"text-normal text-center text-sm ${
            highlight && "text-[15px]"
          }`}
        >
          {`${text}`.toUpperCase()}
        </p>
      </div>
    </div>
  );
};
