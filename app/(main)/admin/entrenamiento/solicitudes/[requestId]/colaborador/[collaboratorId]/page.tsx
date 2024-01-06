import Link from "next/link";
import React from "react";
import { AdminScheduleCollaboratorForm } from "./_components/admin-schedule-collaborator-form";
import { db } from "@/lib/db";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeftFromLine, ArrowLeftToLine } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TitleOnPage } from "@/components/title-on-page";

const AdminScheduleCollaborator = async ({
  params,
}: {
  params: { requestId: string; collaboratorId: string };
}) => {
  const trainingRequestCollaborator =
    await db.trainingRequestCollaborator.findUnique({
      where: {
        collaboratorId_trainingRequestId: {
          trainingRequestId: params.requestId,
          collaboratorId: params.collaboratorId,
        },
      },
      include: {
        collaborator: true,
        trainingRequest: true,
        courseLevel: true,
      },
    });

  console.log({ trainingRequestCollaborator });

  return (
    <div>
      <TitleOnPage text="Programar Entrenamiento de colaborador" />
      {trainingRequestCollaborator ? (
        <>
          <Card>
            <CardHeader>

            </CardHeader>

            <CardContent>
              <AdminScheduleCollaboratorForm
                trainingRequestCollaborator={trainingRequestCollaborator}
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="w-full flex">
          <div className="w-full bg-red-600 flex justify-between items-center h-24 flex-col md:flex-row px-3">
            <Link
              href="/admin/entrenamiento/solicitudes"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "justify-self-start"
              )}
            >
              <ArrowLeftToLine className="w-4 h-4 mr-2" />
              Regresar
            </Link>
            <h2 className="text-white text-xl text-center">
              No se encontro el colaborador con esta solicitud
            </h2>
            <div />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminScheduleCollaborator;
