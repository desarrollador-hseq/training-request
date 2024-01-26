import { TitleOnPage } from "@/components/title-on-page";
import { AddCourseForm } from "../[courseId]/_components/add-course-form";

const crumbs = [
  { label: "Cursos", path: "/admin/entrenamiento/cursos" },
  { label: "Crear", path: "crear" },
];

const CreateCollaborator = async () => {
  return (
    <div className="">
      <div className="w-full flex justify-between items-center">
        <div className="w-full flex justify-between items-center">
          <div>
            <TitleOnPage text={`Crear Curso`} bcrumb={crumbs} />
            <span className="text-slte-300"></span>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-3">
        <AddCourseForm />
      </div>
    </div>
  );
};

export default CreateCollaborator;
