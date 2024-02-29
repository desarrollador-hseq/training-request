import Link from "next/link";
import { ArrowLeftToLine } from "lucide-react";
import { getServerSession } from "next-auth";
import { AdminScheduleCollaboratorForm } from "./_components/admin-schedule-collaborator-form";
import { db } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TitleOnPage } from "@/components/title-on-page";
import { Banner } from "@/components/banner";
import { authOptions } from "@/lib/authOptions";

const crumbs = [
  { label: "solicitudes", path: "solicitudes" },
  { label: "colaborador", path: "colaborador" },
  { label: "programar", path: "programar" },
];

const AdminScheduleCollaborator = async ({
  params,
}: {
  params: { requestId: string; collaboratorId: string };
}) => {
  const session = await getServerSession(authOptions) 

  const trainingRequestCollaborator =
    await db.trainingRequestCollaborator.findUnique({
      where: {
        collaboratorId_trainingRequestId: {
          trainingRequestId: params.requestId,
          collaboratorId: params.collaboratorId,
        },
      },
      include: {
        collaborator: {
          include: {
            company: true,
          },
        },
        trainingRequest: true,
        courseLevel: {
          select: {
            id: true,
            name: true,
            hours: true,
            course: {
              select: {
                id: true,
                name: true,
                shortName: true,
              },
            },
            requiredDocuments: {
              where: {
                collaboratorCourseLevelDocument: {
                  every: {
                    collaboratorId: params.collaboratorId,
                  },
                },
              },
              select: {
                id: true,
                name: true,
                collaboratorCourseLevelDocument: {
                  select: {
                    id: true,
                    documentLink: true,
                    requiredDocumentId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

  const courseLevels = await db.courseLevel.findMany({
    where: {
      courseId: trainingRequestCollaborator?.courseLevel?.course.id!,
      active: true,
    },
  });

  return (
    <div>
      <TitleOnPage
        text="Programar entrenamiento"
        bcrumb={crumbs}
      />
      {trainingRequestCollaborator ? (
        <Card className="overflow-hidden relative">
          <CardHeader className="relative p-0 m-0 mb-2 space-y-0">
            {trainingRequestCollaborator.isDisallowed && (
              <Banner
                variant="danger"
                label="Colaborador no cumple con los requisitos"
              />
            )}
          </CardHeader>
          <CardContent className="">
            <AdminScheduleCollaboratorForm
              courseLevels={courseLevels}
              trainingRequestCollaborator={trainingRequestCollaborator}
              canManageRequests={session?.user.canManageRequests || false}
              canManagePermissions={session?.user.canManagePermissions || false}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="w-full">
          <Card className="w-full bg-red-800 flex  flex-col px-3">
            <CardHeader className="w-fit flex justify-start">
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
            </CardHeader>
            <CardContent>
              <h2 className="text-white text-xl text-center">
                No se encontro el colaborador con esta solicitud
              </h2>
            </CardContent>
            <div />
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminScheduleCollaborator;
