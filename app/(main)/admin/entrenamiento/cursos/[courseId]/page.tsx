import { redirect } from "next/navigation";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { AddCourseForm } from "./_components/add-course-form";
import { Separator } from "@/components/ui/separator";
import { AdminCoursesTableCollapsibleContent } from "../_components/admin-courses-table-collapsible-content";
import { AdminSimpleCourselevels } from "../_components/admin-simple-courselevels";
import { Card } from "@/components/ui/card";
import { Ban } from "lucide-react";
import Link from "next/link";

const crumbs = [
  { label: "Cursos", path: "/admin/entrenamiento/cursos" },
  { label: "Editar", path: "editar" },
];

const EditCoursePage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  const { courseId } = params;

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      active: true,
    },
    include: {
      courseLevels: true,
    },
  });

  return (
    <div className="">
      <div className="w-full flex justify-between items-center">
        <div className="w-full flex justify-between items-center">
          <div>
            <TitleOnPage text={`Editar Curso`} bcrumb={crumbs} />
            <span className="text-slte-300"></span>
          </div>
          {/* <DeactivateCollaborator collaborator={collaborator} /> */}
        </div>
      </div>
      <div className="w-full flex flex-col gap-3">
        <AddCourseForm course={course} />
        <Card>
          {course?.courseLevels && course?.courseLevels.length > 0 ? (
            <>
              <Separator />
              <AdminSimpleCourselevels
                courseId={course?.id}
                courseLevels={course?.courseLevels}
              />
            </>
          ) : (
            <div className="flex justify-center items-center">
              <div className="h-12 flex items-center gap-3">
                <Ban className="w-6 h-6 " />
                <h4 className="font-bold text-lg">Sin niveles</h4>
                <Link href={`/admin/entrenamiento/cursos/${course?.id}/nivel/crear`}>Agregar</Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EditCoursePage;
