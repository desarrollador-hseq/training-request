import { getServerSession } from "next-auth";
import { TitleOnPage } from "@/components/title-on-page";
import { AddCourseForm } from "../[courseId]/_components/add-course-form";
import { authOptions } from "@/lib/authOptions";

const crumbs = [
  { label: "Cursos", path: "/admin/entrenamiento/cursos" },
  { label: "Crear", path: "crear" },
];

const CreateCollaborator = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="">
      <TitleOnPage text={`Crear Curso`} bcrumb={crumbs} />

      <div className="w-full flex flex-col gap-3">
        <AddCourseForm canManagePermissions={session?.user.canManagePermissions || false} />
      </div>
    </div>
  );
};

export default CreateCollaborator;
