import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { AddCourseLevelForm } from "../_components/add-courselevel-form";

const EditCourseLevelPage = async ({
  params,
}: {
  params: { courseId: string; levelId: string };
}) => {
  const crumbs = [
    { label: "Cursos", path: `/admin/entrenamiento/cursos/${params.courseId}` },
    { label: "nivel", path: "nivel" },
    { label: "editar", path: "editar" },
  ];
  const { courseId, levelId } = params;

  const courseLevel = await db.courseLevel.findUnique({
    where: {
      id: levelId,
      active: true,
    },
  });

  return (
    <div className="">
      <div className="w-full flex justify-between items-center">
        <div className="w-full flex justify-between items-center">
          <div>
            <TitleOnPage text={`Editar Nivel`} bcrumb={crumbs} />
            <span className="text-slte-300"></span>
          </div>
          {/* <DeactivateCollaborator collaborator={collaborator} /> */}
        </div>
      </div>
      <div className="w-full flex flex-col gap-3">
        <AddCourseLevelForm courseLevel={courseLevel} />
      </div>
    </div>
  );
};

export default EditCourseLevelPage;
