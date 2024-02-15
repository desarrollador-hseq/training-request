
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { CreateTrainingForm } from "./_components/create-training-form";
import { Card } from "@/components/ui/card";
import { TitleOnPage } from "@/components/title-on-page";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NotCollaborators } from "./_components/not-collaborators";

const bcrumb = [
  { label: "Solicitud", path: "/dashboard/entrenamiento/solicitudes" },
  { label: "Crear", path: "crear" },
];

const CreateTrainingPage = async () => {
  const session = await getServerSession(authOptions);
  const courses = await db.course.findMany({ where: { active: true } });
  const collaborators = await db.collaborator.findMany({
    where: {
      companyId: session?.user.id,
      active: true,
    },
  });

  return (
    <div>
      <TitleOnPage text="Crear Solicitud" bcrumb={bcrumb} />

      <Card>
        <CreateTrainingForm courses={courses} />
        {collaborators.length < 1 && (
          <div>
            <NotCollaborators open={true} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default CreateTrainingPage;
