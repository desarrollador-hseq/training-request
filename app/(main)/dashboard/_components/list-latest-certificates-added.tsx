import Link from "next/link";
import { Certificate } from "@prisma/client";
import { Eye } from "lucide-react";
import { SubtitleSeparator } from "@/components/subtitle-separator";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDateOf } from "@/lib/utils";

export const ListLatestCertificatesAdded = ({
  certificates,
}: {
  certificates: Certificate[];
}) => {
  return (
    <Card className="overflow-hidden">
      <SubtitleSeparator text="Últimos Certificados" />

      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="grid grid-cols-5 place-content-center place-items-center h-full font-bold my-2">
            <span>Colaborador</span>
            <span>Curso</span>
            <span>Nivel</span>
            <span>Reentrenamiento</span>
            <span>Creado</span>
            <span>{"   "}</span>
          </div>
          {certificates.length === 0 ? (
            <div className="w-full flex justify-center mt-6">
              <h4 className="italic text-slate-400">Sin Resultados</h4>
            </div>
          ) : (
            certificates.map((cert, index) => (
              <Card
                key={cert?.id}
                className="overflow-hidden bg-blue-100 text-primary"
              >
                <CardContent className={cn("p-3")}>
                  <div
                    className={cn(
                      "grid grid-cols-5 place-content-center place-items-center h-full relative text-sm font-medium text-blue-900"
                    )}
                  >
                    <span className="leading-4">
                      {cert?.collaboratorFullname}
                    </span>

                    <span className="flex gap-2">
                      <span className="">{cert?.courseName}</span>
                    </span>

                    <span className="flex gap-2">
                      <span className="">{cert?.levelName}</span>
                    </span>

                    <span className="">{cert.dueDate && formatDateOf(cert.dueDate!)}</span>

                    <span className="">{cert.createdAt && formatDateOf(cert.createdAt!)}</span>
                    <div className="flex justify-center items-center max-w-[15px] absolute right-0 top-0 bottom-0">
                      <Link
                        href={`/dashboard/entrenamiento/certificados/${cert.id}`}
                      >
                        <Eye className="w-4 h-4 text-secondary" />
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
