import Link from "next/link";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { AdminCoursesTable } from "./_components/admin-courses-table";
import { columnsAdminCoursesTable } from "./_components/admin-courses-table-columns";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const crumbs = [{ label: "Cursos", path: "cursos" }];

const CoursesPage = async () => {
  const courses = await db.course.findMany({
    where: {
      active: true,
    },
    include: {
      courseLevels: true,
    },
    orderBy: {
      name: "desc",
    },
  });
  return (
    <div>
      <div className="flex items-center">
        <TitleOnPage text="Cursos" bcrumb={crumbs} />
        <Link className={cn(buttonVariants())} href={`/admin/entrenamiento/cursos/crear`}>
          Crear
        </Link>
      </div>

      <Card>
        <CardContent>
          <AdminCoursesTable
            columns={columnsAdminCoursesTable}
            data={courses}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursesPage;
