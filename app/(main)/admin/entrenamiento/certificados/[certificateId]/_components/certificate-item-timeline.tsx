"use client";

import React, { useState } from "react";
import { Certificate, CertificateEvent, Company } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CircleSlash,
  Edit2,
  FilePlus2,
  RefreshCcw,
  Send,
  SquareGanttIcon,
  Trash,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDateOf } from "@/lib/utils";

interface CertificateItemTimelineProps {
  event: CertificateEvent & { admin: Company | null | undefined };
}

export const CertificateItemTimeline = ({
  event,
}: CertificateItemTimelineProps) => {
  const [certificateData] = useState<Certificate | null | undefined>(
    event.certificateData && JSON.parse(event.certificateData)
  );

  return (
    <li className="mb-10 ms-6">
      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white ">
        {event.eventType === "CREATED" ? (
          <FilePlus2 />
        ) : event.eventType === "UPDATED" ? (
          <RefreshCcw />
        ) : event.eventType === "SENT" ? (
          <Send />
        ) : event.eventType === "UNSEND" ? (
          <CircleSlash />
        ) : event.eventType === "DELETED" ? (
          <Trash />
        ) : (
          <SquareGanttIcon />
        )}
      </span>

      <div className="flex flex-col justify-between p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex justify-between w-full">
          <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
            {format(event.createdAt, "Pp", { locale: es })}
          </time>
          <div className="flex items-center gap-3">
            {event.admin?.businessName}
            <div
              className={cn(
                "self-start text-base font-normal text-gray-500 mt-2"
              )}
            >
              <span
                className={cn(
                  " text-white text-xs font-semibold me-2 px-2.5 py-0.5 rounded ",
                  event.eventType === "CREATED"
                    ? "bg-emerald-600"
                    : event.eventType === "UPDATED"
                    ? "bg-blue-700"
                    : event.eventType === "SENT"
                    ? "bg-green-400"
                    : event.eventType === "UNSEND"
                    ? "bg-orange-400"
                    : event.eventType === "DELETED"
                    ? "bg-red-600"
                    : "bg-slate-600"
                )}
              >
                {event.eventType === "CREATED"
                  ? "Creado"
                  : event.eventType === "UPDATED"
                  ? "Actualizado"
                  : event.eventType === "SENT"
                  ? "Enviado"
                  : event.eventType === "UNSEND"
                  ? "Anulación de envio"
                  : event.eventType === "DELETED"
                  ? "Eliminado"
                  : "Otro"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-xs">
          <div className="grid grid-cols-7 place-content-center place-items-center h-full font-bold my-1 text-xs"></div>
          {!certificateData ? (
            <div className="w-full flex justify-center mt-1">
              {/* <span className="italic text-slate-400">Sin datos</span> */}
            </div>
          ) : (
            <Card
              key={certificateData?.id}
              className="overflow-hidden bg-blue-100 text-primary"
            >
              <CardContent className={cn("p-2")}>
                {certificateData.collaboratorFullname ? (
                  <div
                    className={cn(
                      "flex flex-wrap h-full relative text-xs font-medium text-[10px] gap-1"
                    )}
                  >
                    <span className="leading-4 flex flex-col border border-slate-500 p-1 rounded-sm">
                      <span className="font-semibold">Colaborador</span>
                      {certificateData?.collaboratorFullname}
                    </span>
                    <span className="leading-4 flex flex-col border border-slate-500 p-1 rounded-sm">
                      <span className="font-semibold">documento</span>
                      {certificateData?.collaboratorTypeDoc}{" "}
                      {certificateData.collaboratorNumDoc}
                    </span>
                    <span className="leading-4 flex flex-col border border-slate-500 p-1 rounded-sm">
                      <span className="font-semibold">Arl</span>

                      {certificateData?.collaboratorArlName}
                    </span>

                    <span className="leading-4 flex flex-col border border-slate-500 p-1 rounded-sm">
                      <span className="font-semibold">Curso</span>
                      <span className="">{certificateData?.courseName}</span>
                    </span>

                    <span className="leading-4 flex flex-col border border-slate-500 p-1 rounded-sm">
                      <span className="font-semibold">Nivel</span>
                      <span className="">{certificateData?.levelName}</span>
                    </span>

                    <span className="leading-4 flex flex-col border border-slate-500 p-1 rounded-sm">
                      <span className="font-semibold">Reentrenamiento</span>
                      {certificateData.dueDate &&
                        formatDateOf(certificateData.dueDate!)}
                    </span>
                    <span className="leading-4 flex flex-col border border-slate-500 p-1 rounded-sm">
                      <span className="font-semibold">fin curso</span>
                      {certificateData.certificateDate &&
                        formatDateOf(certificateData.certificateDate!)}
                    </span>
                    <span className="leading-4 flex flex-col border border-slate-500 p-1 rounded-sm">
                      <span className="font-semibold">inicio curso</span>
                      {certificateData.startDate &&
                        formatDateOf(certificateData.startDate!)}
                    </span>

                    <span className="leading-4 flex flex-col border border-slate-500 p-1 rounded-sm">
                      <span className="font-semibold">Creado</span>
                      {certificateData.createdAt &&
                        formatDateOf(certificateData.createdAt!)}
                    </span>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex flex-wrap h-full relative text-xs font-medium text-[10px] gap-1"
                    )}
                  >
                    {JSON.stringify(certificateData)}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </li>
  );
};
