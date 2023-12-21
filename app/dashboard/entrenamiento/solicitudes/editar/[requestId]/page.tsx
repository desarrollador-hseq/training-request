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
import { SelectTrainingLevel } from "./_components/select-traininglevel";

const TrainingRequestPage = async ({
  params,
}: {
  params: { requestId: string };
}) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    return redirect("/dashboard");
  }

  const isAdmin = session.user.role === "ADMIN";

  const trainingRequest = await db.trainingRequest.findUnique({
    where: {
      id: params.requestId,
    },
    include: {
      course: true,
      members: {
        include: {
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
    },
  });

  const requiredFields = [
    trainingRequest.courseId,
    trainingRequest.members.length,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  const handleModal = () => {
    console.log("holaa");
  };

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
        <Button>Enviar</Button>
      </div>
      <div className="flex flex-col gap-3">
        <Card className="p-0 overflow-hidden rounded-md">
          <CardHeader className="p-0">
            <SubtitleSeparator text="Datos de creación" />
          </CardHeader>
          <CardContent>
            <TrainingCreationData
              trainingRequest={trainingRequest}
              courseLevels={courseLevels}
              isAdmin={isAdmin}
            />
          </CardContent>
        </Card>

        <Card className="p-0 overflow-hidden">
          <CardHeader className="p-0">
            <SubtitleSeparator text="Datos de Colaboradores" />
          </CardHeader>
          <CardContent>
            <SelectTrainingLevel courseLevels={courseLevels} collaborators={collaborators} />

            <CollaboratorsSimpleTable
              collaborators={trainingRequest.members}
              trainingRequestId={trainingRequest.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingRequestPage;
