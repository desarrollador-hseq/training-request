import Link from "next/link";
import { TrainingRequest } from "@prisma/client";
import { Eye } from "lucide-react";
import { SubtitleSeparator } from "@/components/subtitle-separator";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDateOf } from "@/lib/utils";

interface CollaboratorAndCourse extends TrainingRequest {
  course: { name: string | null | undefined };
  collaborators: { collaboratorId: string | null | undefined }[];
}

interface ListLatestRequestsAddedProps {
  trainingRequests: CollaboratorAndCourse[];
}

const stateEsp = {
  PENDING: { text: "No enviada", icon: "🕒" },
  ACTIVE: { text: "Activa", icon: "✅" },
  EXECUTED: { text: "Ejecutada", icon: "✔️" },
  CANCELLED: { text: "Cancelada", icon: "❌" },
};

export const ListLatestRequestsAdded = ({
  trainingRequests,
}: ListLatestRequestsAddedProps) => {
  return (
    <Card className="overflow-hidden">
      <SubtitleSeparator text="Últimas solicitudes" />

      <CardContent className="overflow-x-auto">
        <div className="flex flex-col gap-1 min-w-[900px]">
          <div className="grid grid-cols-5 place-content-center place-items-center h-full font-bold my-2">
            <span>Curso</span>
            <span># de colaboradores</span>
            <span>Estado</span>
            <span>Creada</span>
            <span>{"   "}</span>
          </div>
          {trainingRequests.length === 0 ? (
            <h4 className="italic text-slate-400">Sin Resultados</h4>
          ) : (
            trainingRequests.map((req, index) => (
              <Card
                key={req?.id}
                className="overflow-hidden bg-blue-100 text-primary"
              >
                <CardContent className={cn("p-3")}>
                  <div
                    className={cn(
                      "grid grid-cols-5 place-content-center place-items-center h-full relative text-sm font-medium text-blue-900"
                    )}
                  >
                    <span className="">{req?.course?.name}</span>

                    <span className="">{req?.collaborators?.length}</span>

             
                   
                    <span> {stateEsp[`${req?.state}`].text}</span>

                    <span className="">{req?.createdAt && formatDateOf(req?.createdAt!)}</span>

                    <div className="flex justify-center items-center max-w-[15px] absolute right-0 top-0 bottom-0">
                      <Link
                        href={`/dashboard/entrenamiento/solicitudes/editar/${req.id}`}
                      >
                        {" "}
                        <Eye className="w-4 h-4 text-blue-700" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
