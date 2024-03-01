import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { TabsCorselevel } from "./_components/tabs-courselevel";
import { DeactivateCourselevel } from "./_components/deactivate-courselevel";
import { authOptions } from "@/lib/authOptions";

const EditCourseLevelPage = async ({
  params,
}: {
  params: { courseId: string; levelId: string };
}) => {
  const isEdit = !!params.levelId && params.levelId !== "crear";
  const session = await getServerSession(authOptions);

  const crumbs = [
    { label: "Cursos", path: `/admin/entrenamiento/cursos/${params.courseId}` },
    { label: "nivel", path: "nivel", click: false },
    { label: isEdit ? "Editar" : "Crear", path: isEdit ? "editar" : "crear" },
  ];
  const { courseId, levelId } = params;

  const courseLevel = await db.courseLevel.findUnique({
    where: {
      id: levelId,
      active: true,
    },
    include: {
      requiredDocuments: {
        where: {
          active: true,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      course: {
        select: {
          name: true,
        },
      },
    },
  });

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (levelId !== "crear" && !courseLevel) {
    redirect("/admin/entrenamiento/cursos");
  }

  return (
    <div className="">
      <div>
        <TitleOnPage
          text={
            <div>
              {isEdit ? (
                <div>
                  Editar nivel:{" "}
                  <span className="font-semibold text-2xl">
                    {courseLevel?.name}
                  </span>
                </div>
              ) : (
                <div>Crear nivel</div>
              )}
            </div>
          }
          bcrumb={crumbs}
        >
          <DeactivateCourselevel
            level={courseLevel}
            course={courseLevel?.course.name}
            canManagePermissions={session?.user.canManagePermissions || false}
          />
        </TitleOnPage>
      </div>
      <div className="w-full flex flex-col gap-3">
        <TabsCorselevel
          courseLevel={courseLevel}
          courseId={courseId}
          courseName={course?.name}
          canManagePermissions={session?.user.canManagePermissions || false}
        />
      </div>
    </div>
  );
};

export default EditCourseLevelPage;
