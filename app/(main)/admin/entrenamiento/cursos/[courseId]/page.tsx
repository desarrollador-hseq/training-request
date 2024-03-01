import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Ban } from "lucide-react";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { AddCourseForm } from "./_components/add-course-form";
import { Separator } from "@/components/ui/separator";
import { AdminSimpleCourselevels } from "../_components/admin-simple-courselevels";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DeactivateCourse } from "./_components/deactivate-course";
import { authOptions } from "@/lib/authOptions";

const crumbs = [
  { label: "Cursos", path: "/admin/entrenamiento/cursos" },
  { label: "Editar", path: "editar" },
];

const EditCoursePage = async ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  const session = await getServerSession(authOptions);

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      active: true,
    },
    include: {
      courseLevels: {
        where: {
          active: true,
        },
      },
    },
  });

  if (!course) {
    redirect("/admin/entrenamiento/cursos/");
  }

  return (
    <div className="">
      <div className="w-full flex justify-between items-center">
        <TitleOnPage
          text={
            <span>
              Editar Curso:{" "}
              <span className="font-semibold text-2xl">{course?.name}</span>
            </span>
          }
          bcrumb={crumbs}
        >
          <div className="flex gap-5">
            <DeactivateCourse course={course} canManagePermissions={session?.user.canManagePermissions || false} />
            <Link
              className={cn(buttonVariants())}
              href={`/admin/entrenamiento/cursos/${course?.id}/nivel/crear`}
            >
              Agregar Nivel
            </Link>
          </div>
        </TitleOnPage>
      </div>
      <div className="w-full flex flex-col gap-3">
        <AddCourseForm course={course} canManagePermissions={session?.user.canManagePermissions || false} />
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
                <Link
                  className={cn(buttonVariants())}
                  href={`/admin/entrenamiento/cursos/${course?.id}/nivel/crear`}
                >
                  Agregar
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EditCoursePage;
