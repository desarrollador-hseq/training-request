import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TrainingCreationData } from "./_components/training-creation-data";
import { TitleOnPage } from "@/components/title-on-page";
import { SubtitleSeparator } from "@/components/subtitle-separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Banner } from "@/components/banner";
import { CollaboratorsSimpleTable } from "./_components/collaborators-simple-table";
import { SelectCollaborators } from "./_components/select-collaborators";
import { SendTraining } from "./_components/send-training";

const crumbs = [
  {label: "solicitudes", path: "/dashboard/entrenamiento/solicitudes"},
  {label: "editar", path: "editar"},
]

const TrainingRequestPage = async ({
  params,
}: {
  params: { requestId: string };
}) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    return redirect("/dashboard");
  }

  const trainingRequest = await db.trainingRequest.findUnique({
    where: {
      id: params.requestId,
    },
    include: {
      course: true,
      collaborators: {
        include: {
          collaborator: true,
          courseLevel: true,
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
    },
  });
  const collaborators = await db.collaborator.findMany({
    where: {
      companyId: session.user.id,
      active: true,
    },
    include: {
      trainingRequestsCollaborators: true
    }
  });
  const hasCourseLevelIds = trainingRequest.collaborators.every(col => col.courseLevelId);

  const requiredFields = [
    trainingRequest.courseId,
    trainingRequest.collaborators.length,
    hasCourseLevelIds,
  ];


  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);
  const isPending = trainingRequest.state === "PENDING"

  return (
    <div className="">
      {trainingRequest.state === "PENDING" && (
        <Banner label="Solicitud no enviada" />
      )}

      <div className="flex justify-between items-center">
        <div>
          <TitleOnPage text={`Editar solicitud de entrenamiento `} bcrumb={crumbs} />
          <span className="text-slte-300">
            complete todos los item {completionText}{" "}
          </span>
        </div>
      <SendTraining trainingRequestId={params.requestId} disabled={isComplete} isPending={isPending}  />
      </div>
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
                <SubtitleSeparator text="Datos de Colaboradores" >
                  {/* Sheet para agregar colaboradores */}
                <SelectCollaborators
                  isPending={isPending}
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
                  collaborators={trainingRequest.collaborators}
                  trainingRequestId={trainingRequest.id}
                  courseId={trainingRequest.courseId}
                  coursesLevel={courseLevels}
                  isPending={isPending}
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
