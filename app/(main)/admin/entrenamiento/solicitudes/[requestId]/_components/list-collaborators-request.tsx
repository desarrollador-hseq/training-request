"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDateOf } from "@/lib/utils";
import { Collaborator, TrainingRequestCollaborator } from "@prisma/client";
import {
  Ban,
  Calendar,
  CalendarSearch,
  Clock8,
  Eye,
  GraduationCap,
  Pencil,
} from "lucide-react";

interface ListCollaboratorsRequestProps {
  collaborators:
    | (TrainingRequestCollaborator & {
        collaborator: Collaborator | null | undefined;
        courseLevel: { name: string | null | undefined } | null | undefined;
      })[]
    | null
    | undefined;
}

export const ListCollaboratorsRequest = ({
  collaborators,
}: ListCollaboratorsRequestProps) => {
  return (
    <div className="flex flex-col gap-1 min-w-[900px]">
      <div className="grid grid-cols-6 place-content-center place-items-center h-full font-bold">
        <span>Nombre</span>
        <span>Documento</span>
        <span>Nivel</span>
        <span>Email</span>
        <span>Teléfono</span>
        <span>Programación</span>
        <span>{"   "}</span>
      </div>
      {collaborators?.map(({ collaborator: col, courseLevel }, index) => (
        <Card key={col?.id} className="overflow-hidden">
          <CardContent
            className={cn(
              "p-3",
              !collaborators[index].isScheduled &&
                !collaborators[index].wasCertified &&
                "bg-blue-50 ",
              collaborators[index].isScheduled && "bg-emerald-600 text-white",
              collaborators[index].isDisallowed && "bg-red-600 text-white",
              collaborators[index].wasCertified && "bg-blue-600 text-white"
            )}
          >
            <div
              className={cn(
                "grid grid-cols-6 place-content-center place-items-center h-full relative"
              )}
            >
              <div className="flex justify-center items-center max-w-[10px] absolute left-0 top-0 bottom-0">
                <span className="font-semibold">
                  {collaborators[index].isScheduled &&
                    !collaborators[index].wasCertified && (
                      <Calendar className="w-4 h-4" />
                    )}
                </span>
                <span className="font-semibold">
                  {collaborators[index].isDisallowed && (
                    <Ban className="w-4 h-4" />
                  )}
                </span>
                <span className="font-semibold">
                  {collaborators[index].wasCertified && (
                    <GraduationCap className="w-4 h-4" />
                  )}
                </span>
                <span className="font-semibold">
                  {!collaborators[index].isScheduled &&
                    !collaborators[index].wasCertified &&
                    !collaborators[index].isDisallowed && (
                      <Clock8 className="w-4 h-4 animate-spin text-secondary" />
                    )}
                </span>
              </div>

              <div className="flex justify-center items-center ml-5">
                <span className="font-semibold leading-4">{col?.fullname}</span>
              </div>
              <div className="flex flex-col ">
                <span className="flex gap-2">
                  <span className="font-semibold">{col?.docType}</span>
                  <span className="font-semibold">{col?.numDoc}</span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs">{courseLevel?.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs">{col?.email}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs">{col?.phone}</span>
              </div>
              <div className="flex flex-col">
                {collaborators[index].startDate && (
                  <span className="text-xs">
                    {formatDateOf(collaborators[index].startDate!)}
                  </span>
                )}
                {collaborators[index].endDate && (
                  <span className="text-xs">
                    {formatDateOf(collaborators[index].endDate!)}
                  </span>
                )}
              </div>

              <div className="flex justify-center items-center max-w-[10px] absolute right-0 top-0 bottom-0">
                {collaborators[index].isScheduled &&
                  !collaborators[index].wasCertified && (
                    <Link
                      href={`/admin/entrenamiento/solicitudes/${collaborators[index].trainingRequestId}/colaborador/${col?.id}`}
                      className="font-semibold rounded-sm bg-emerald-700 mr-1 "
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  )}
                {collaborators[index].isDisallowed && (
                  <Link
                    href={`/admin/entrenamiento/solicitudes/${collaborators[index].trainingRequestId}/colaborador/${col?.id}`}
                    className="font-semibold rounded-sm bg-red-700 mr-1 p-1"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>
                )}
                {/* {collaborators[index].wasCertified && (
                  <Link href={`/admin/entrenamiento/certificado/`} className="font-semibold rounded-sm bg-blue-700 mr-1 p-1">
                    <GraduationCap className="w-5 h-5" />
                  </Link>
                )} */}
                {!collaborators[index].isScheduled &&
                  !collaborators[index].wasCertified &&
                  !collaborators[index].isDisallowed && (
                    <Link
                      href={`/admin/entrenamiento/solicitudes/${collaborators[index].trainingRequestId}/colaborador/${col?.id}`}
                      className="font-semibold rounded-sm bg-secondary p-1 pl-1 mr-1"
                    >
                      <CalendarSearch className="w-5 h-5  text-white animate-bounce " />
                    </Link>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
