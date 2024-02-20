import { TitleOnPage } from "@/components/title-on-page";
import { AddCoachesForm } from "../_components/add-coaches-form";


const crumbs = [
  { label: "Cursos", path: "/admin/entrenamiento/cursos" },
  { label: "Crear", path: "crear" },
];

const CreateCoaches = async () => {
  return (
    <div className="">
      <TitleOnPage text={`Crear Curso`} bcrumb={crumbs} />

      <div className="w-full flex flex-col gap-3">
        <AddCoachesForm />
      </div>
    </div>
  );
};

export default CreateCoaches;
