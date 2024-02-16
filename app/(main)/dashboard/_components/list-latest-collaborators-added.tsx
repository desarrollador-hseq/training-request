import Link from "next/link";
import { Collaborator } from "@prisma/client";
import { Pencil } from "lucide-react";
import { SubtitleSeparator } from "@/components/subtitle-separator";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDateOf } from "@/lib/utils";

export const ListLatestCollaboratorsAdded = ({
  collaborators,
}: {
  collaborators: Collaborator[];
}) => {
  return (
    <Card className="overflow-hidden">
      <SubtitleSeparator text="Últimos colaboradores registrados" />
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="grid grid-cols-5 place-content-center place-items-center h-full font-bold my-2">
            <span>Nombre completo</span>
            <span>Documento</span>
            <span>Correo</span>
            <span>Teléfono móvil</span>
            <span>Creado</span>
            <span>{"   "}</span>
          </div>

          {collaborators.length === 0 ? (
            <h4 className="italic text-slate-400">Sin Resultados</h4>
          ) : (
            collaborators.map((col, index) => (
              <Card
                key={col?.id}
                className="overflow-hidden bg-blue-100 text-primary"
              >
                <CardContent className={cn("p-3")}>
                  <div
                    className={cn(
                      "grid grid-cols-5 place-content-center place-items-center h-full relative text-sm font-medium text-blue-900"
                    )}
                  >
                    <span className=" leading-4">{col?.fullname}</span>

                    <span className="flex gap-2">
                      <span className="">{col?.docType}</span>
                      <span className="font-normal">{col?.numDoc}</span>
                    </span>

                    <span className="">{col?.email}</span>

                    <span className="">{col?.phone}</span>

                    <span className="">{formatDateOf(col?.createdAt!)}</span>

                    <div className="flex justify-center items-center max-w-[15px] absolute right-0 top-0 bottom-0">
                      <Link
                        href={`/dashboard/entrenamiento/colaboradores/${col.id}`}
                      >
                        {" "}
                        <Pencil className="w-4 h-4 text-secondary" />
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
