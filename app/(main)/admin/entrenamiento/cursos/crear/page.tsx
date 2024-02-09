import { TitleOnPage } from "@/components/title-on-page";
import { AddCourseForm } from "../[courseId]/_components/add-course-form";

const crumbs = [
  { label: "Cursos", path: "/admin/entrenamiento/cursos" },
  { label: "Crear", path: "crear" },
];

const CreateCollaborator = async () => {
  return (
    <div className="">
      <TitleOnPage text={`Crear Curso`} bcrumb={crumbs} />

      <div className="w-full flex flex-col gap-3">
        <AddCourseForm />
      </div>
    </div>
  );
};

export default CreateCollaborator;
