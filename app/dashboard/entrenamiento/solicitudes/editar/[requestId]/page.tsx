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
import { Button } from "@/components/ui/button";
import { SelectCollaborators } from "./_components/select-collaborators";

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

  return (
    <div className="">
      {trainingRequest.state === "PENDING" && (
        <Banner label="Solicitud no enviada" />
      )}

      <div className="flex justify-between items-center">
        <div>
          <TitleOnPage text={`Editar solicitud de entrenamiento `} />
          <span className="text-slte-300">
            complete todos los item {completionText}{" "}
          </span>
        </div>
        <Button disabled={!isComplete}  >Enviar</Button>
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
                  trainingRequest={trainingRequest}
                  courseLevels={courseLevels}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="">
            <div className="p-0 overflow-hidden rounded-md bg-blue-50">
              <div className="p-0">
                <SubtitleSeparator text="Datos de Colaboradores" >
                <SelectCollaborators
                  trainingRequestId={trainingRequest.id}
                  collaborators={collaborators}
                  collaboratorSelected={trainingRequest.collaborators.map(
                    (col) => col.collaborator
                  )}
                />
                </SubtitleSeparator>
              </div>
              <div className="p-2">
                <CollaboratorsSimpleTable
                  collaborators={trainingRequest.collaborators}
                  trainingRequestId={trainingRequest.id}
                  courseId={trainingRequest.courseId}
                  coursesLevel={courseLevels}
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
