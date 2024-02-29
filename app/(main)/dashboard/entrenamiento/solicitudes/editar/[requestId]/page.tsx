import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Info } from "lucide-react";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { TrainingCreationData } from "./_components/training-creation-data";
import { TitleOnPage } from "@/components/title-on-page";
import { SubtitleSeparator } from "@/components/subtitle-separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Banner } from "@/components/banner";
import { CollaboratorsSimpleTable } from "./_components/collaborators-simple-table";
import { SelectCollaborators } from "./_components/select-collaborators";
import { SendTraining } from "./_components/send-training";
import { TooltipInfo } from "@/components/tooltip-info";

const crumbs = [
  { label: "solicitudes", path: "/dashboard/entrenamiento/solicitudes" },
  { label: "editar", path: "editar" },
];

const TrainingRequestPage = async ({
  params,
}: {
  params: { requestId: string };
}) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    return redirect("/dashboard");
  }

  const isAdmin = session.user?.role === "ADMIN";

  const trainingRequest = await db.trainingRequest.findUnique({
    where: {
      id: params.requestId,
    },
    include: {
      course: true,
      collaborators: {
        include: {
          collaborator: {
            include: {
              documents: true,
              trainingRequestsCollaborators: {
                where: { trainingRequestId: params.requestId },
              },
            },
          },
          courseLevel: {
            include: {
              requiredDocuments: {
                where: {
                  active: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!trainingRequest) {
    return redirect("/dashboard/entrenamiento");
  }

  const courseLevels = await db.courseLevel.findMany({
    where: {
      courseId: trainingRequest.courseId!,
      active: true,
    },
    include: {
      requiredDocuments: true,
    },
  });

  const collaborators = await db.collaborator.findMany({
    where: {
      companyId: isAdmin ? trainingRequest.companyId : session.user.id,
      active: true,
    },
    include: {
      trainingRequestsCollaborators: true,
    },
  });
  const hasCourseLevelIds = trainingRequest.collaborators.every(
    (col) => col.courseLevelId
  );

  let isCompleteDocuments = false;

  // Verificar si todos los colaboradores tienen los documentos adjuntados para el nivel de curso correspondiente
  if (
    trainingRequest &&
    courseLevels &&
    courseLevels.length > 0 &&
    trainingRequest.collaborators
  ) {
    isCompleteDocuments =
      trainingRequest.collaborators.length === 0
        ? false
        : trainingRequest.collaborators.every(
            ({ collaborator, courseLevel }) => {
              if (!collaborator || !courseLevel) {
                return false; // Si no hay colaborador o nivel de curso, no está completo
              }
              // Obtener los documentos requeridos para este nivel de curso
              const requiredDocuments = courseLevel.requiredDocuments;

              // Verificar si el colaborador tiene adjuntados todos los documentos requeridos para este nivel de curso
              return requiredDocuments.every((document) => {
                return (
                  collaborator.documents &&
                  collaborator.documents.some((attachedDocument) => {
                    return attachedDocument.requiredDocumentId === document.id;
                  })
                );
              });
            }
          );
  }

  const requiredFields = [
    trainingRequest.courseId,
    trainingRequest.collaborators.length,
    hasCourseLevelIds,
    isCompleteDocuments,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);
  const isPending = trainingRequest.state === "PENDING";

  return (
    <div className="">
      {trainingRequest.state === "PENDING" && (
        <Banner label="Solicitud no enviada">
          <TooltipInfo text="La solicitud fue creada, pero no enviada. Cuando seleccione a los colaboradores y agregue sus documentos, podrá enviarla.">
            <Info />
          </TooltipInfo>
        </Banner>
      )}

      <TitleOnPage text={`Editar solicitud de entrenamiento `} bcrumb={crumbs}>
        <div className="flex flex-col items-end">
          <SendTraining
            isAdmin={isAdmin}
            trainingRequestId={params.requestId}
            disabled={isComplete}
            isPending={isPending}
          />
          {!isComplete && (
            <span className="text-slate-200 text-xs">
              completar todos los requisitos {completionText}{" "}
            </span>
          )}
        </div>
      </TitleOnPage>

      <div className="flex flex-col gap-3">
        <Card>
          <CardHeader className="mb-3">
            <div className="p-0 overflow-hidden rounded-md bg-blue-50">
              <div className="p-0">
                <SubtitleSeparator text="Datos de creación" />
              </div>
              <div>
                <TrainingCreationData
                  trainingRequest={trainingRequest!}
                  courseLevels={courseLevels}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="">
            <div className="p-0 overflow-hidden rounded-md bg-blue-50">
              <div className="p-0">
                <SubtitleSeparator text="Datos de Colaboradores">
                  {/* Sheet para agregar colaboradores */}
                  <SelectCollaborators
                    isPending={isPending}
                    canManageRequests={session?.user?.canManageRequests || false}
                    canManagePermissions={session?.user?.canManagePermissions || false}
                    trainingRequestId={trainingRequest.id}
                    collaborators={collaborators}
                    collaboratorSelected={trainingRequest.collaborators.map(
                      (col) => col.collaborator
                    )}
                  />
                </SubtitleSeparator>
              </div>
              {/* Listar colaboradores de una solicitud y con collapsible de documentos */}
              <div className="p-2">
                <CollaboratorsSimpleTable
                   canManageRequests={session?.user.canManageRequests || false}
                   canManagePermissions={session?.user.canManagePermissions || false}
                  collaborators={trainingRequest.collaborators}
                  trainingRequestId={trainingRequest.id}
                  // courseId={trainingRequest.courseId}
                  coursesLevel={courseLevels}
                  isPending={isPending}
                  isAdmin={isAdmin}
                  trainingRequest={trainingRequest}
                  courseLevels={courseLevels}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingRequestPage;
