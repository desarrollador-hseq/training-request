"use client";

import { useRouter } from "next/navigation";
import {
  Collaborator,
  Company,
  Course,
  TrainingRequest,
  TrainingRequestCollaborator,
} from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { CardItemInfo } from "@/components/card-item-info";
import { useLoading } from "@/components/providers/loading-provider";
import { SubtitleSeparator } from "@/components/subtitle-separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ListCollaboratorsRequest } from "./list-collaborators-request";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface EditRequestFormProps {
  trainingRequest:
    | (TrainingRequest & {
        company: Company | null | undefined;
        course: Course | null | undefined;
        collaborators:
          | (TrainingRequestCollaborator & {
              collaborator: Collaborator | null | undefined;
              courseLevel:
                | { name: string | null | undefined }
                | null
                | undefined;
            })[]
          | null
          | undefined;
      })
    | null
    | undefined;
  canManageRequests: boolean;
  canManagePermissions: boolean;
}

export const EditRequestForm = ({
  trainingRequest,
  canManageRequests,
  canManagePermissions,
}: EditRequestFormProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();

  const stateEsp = [
    // { text: "No enviada", value: "PENDING" },
    { text: "Activa", value: "ACTIVE" },
    { text: "Ejectutada", value: "EXECUTED" },
    { text: "Cancelada", value: "CANCELLED" },
  ];

  const onChangeState = async (state: string) => {
    try {
      setLoadingApp(true);
      const { data } = await axios.patch(
        `/api/training-requests/${trainingRequest?.id}`,
        { state: state }
      );
      toast.success("Colaborador actualizado");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    }
    setLoadingApp(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-self-end self-end text-sm italic">
        {trainingRequest?.createdByAdmin !== "user" && (
          <span>
            Creada por: administración - {trainingRequest?.createdByAdmin}
          </span>
        )}
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
                    label="Empresa"
                    text={trainingRequest?.company?.businessName}
                  />
                  <CardItemInfo
                    label="curso"
                    // text={`${stateEsp[trainingRequest?.state].text}` || trainingRequest?.state}
                    text={trainingRequest?.course?.name}
                  />
                  <CardItemInfo
                    label="# Colaboradores"
                    text={trainingRequest?.collaborators?.length}
                  />
                  <CardItemInfo
                    label="Estado"
                    highlight
                    // text={`${stateEsp[trainingRequest?.state].text}` || trainingRequest?.state}
                    text={
                      <Select
                        defaultValue={trainingRequest?.state}
                        onValueChange={(e) => onChangeState(e)}
                        disabled={!canManagePermissions && !canManageRequests}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="🔴 Sin definir" />
                        </SelectTrigger>
                        <SelectContent>
                          {stateEsp?.map((course) => (
                            <SelectItem
                              key={course.value}
                              value={course.value!}
                            >
                              {course.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Link
            className={cn(
              buttonVariants(),
              "justify-self-end mb-3 hidden max-w-[200px]",
              canManagePermissions && "flex",
              canManageRequests && "flex"
            )}
            href={`/dashboard/entrenamiento/solicitudes/editar/${trainingRequest?.id}`}
          >
            Agregar colaboradores
          </Link>
          <ListCollaboratorsRequest
            collaborators={trainingRequest?.collaborators}
          />
        </CardContent>
      </Card>
    </div>
  );
};
