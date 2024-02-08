"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDateOf } from "@/lib/utils";
import {
  Collaborator,
} from "@prisma/client";
import {
  Ban,
  Calendar,
  CalendarSearch,
  Eye,
  GraduationCap,
  Loader2,
  Pencil,
} from "lucide-react";
import Link from "next/link";

export const ListCollaboratorsRequest = ({
  collaborators,
}: {
  collaborators: {
    collaborator?: Collaborator | null | undefined;
    isScheduled: boolean | null | undefined;
    wasCertified: boolean | null | undefined;
    isDisallowed: boolean | null | undefined;
    startDate: Date | undefined | null;
    endDate: Date | undefined | null;
    trainingRequestId: string | null | undefined;
  }[];
}) => {
  console.log({ collaborators });

  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-5 place-content-center place-items-center h-full font-bold">
        <span>Nombre</span>
        <span>Documento</span>
        <span>Email</span>
        <span>Teléfono</span>
        <span>Programado para:</span>
        <span>{"   "}</span>
      </div>
      {collaborators.map(({ collaborator: col }, index) => (
        <Card key={col?.id} className="overflow-hidden">
          <CardContent
            className={cn(
              "p-3",
              !collaborators[index].isScheduled &&
                !collaborators[index].wasCertified &&
                "bg-blue-50 ",
              collaborators[index].isScheduled && "bg-emerald-600 text-white",
              collaborators[index].isDisallowed && "bg-red-600 text-white",
              collaborators[index].wasCertified && "bg-blue-600 text-white",
            )}
          >
            <div
              className={cn(
                "grid grid-cols-5 place-content-center place-items-center h-full relative"
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
                      <Loader2 className="w-4 h-4 animate-spin text-secondary" />
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
