import { getServerSession } from "next-auth";
import { TitleOnPage } from "@/components/title-on-page";
import { AddCoachesForm } from "../_components/add-coaches-form";
import { authOptions } from "@/lib/authOptions";


const crumbs = [
  { label: "Cursos", path: "/admin/entrenamiento/cursos" },
  { label: "Crear", path: "crear" },
];

const CreateCoaches = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="">
      <TitleOnPage text={`Crear Curso`} bcrumb={crumbs} />

      <div className="w-full flex flex-col gap-3">
        <AddCoachesForm  canManagePermissions={session?.user.canManagePermissions || false} />
      </div>
    </div>
  );
};

export default CreateCoaches;
