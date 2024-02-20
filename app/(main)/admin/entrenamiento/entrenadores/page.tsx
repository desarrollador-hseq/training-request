import Link from "next/link";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { TableDefault } from "@/components/table-default";
import { columnsAdminCoachesTable } from "./_components/admin-coaches-table-columns";

const crumbs = [{ label: "Entrenadores", path: "entrenadores" }];

const CoachesPage = async () => {
  const coaches = await db.coach.findMany({
    where: {
      active: true,
    },
    orderBy: {
      fullname: "desc",
    },
  });
  return (
    <div>
      <TitleOnPage text="entrenadores" bcrumb={crumbs}>
        <Link
          className={cn(buttonVariants())}
          href={`/admin/entrenamiento/entrenadores/crear`}
        >
          Crear
        </Link>
      </TitleOnPage>

      <Card>
        <CardContent>
          <TableDefault
            columns={columnsAdminCoachesTable}
            data={coaches}
            editHref={{btnText: "Editar", href: `/admin/entrenamiento/entrenadores`}}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachesPage;