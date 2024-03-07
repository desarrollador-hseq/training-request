import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";

import { TabsRequest } from "./_components/tabs-request";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const crumbs = [{ label: "solicitudes", path: "solicitudes" }];

const AdminRequestPage = async () => {
  const trainingRequest = await db.trainingRequest.findMany({
    where: { active: true, company: { active: true } },
    include: {
      course: true,
      company: true,
      collaborators: {
        include: {
          collaborator: true,
          courseLevel: true,
        },
      },
    },
    orderBy: {
      activeFrom: "desc",
    },
  });

  return (
    <div>
      <TitleOnPage text="Solicitudes" bcrumb={crumbs}>
        <Link
          href={`/admin/entrenamiento/solicitudes/crear`}
          className={cn(buttonVariants())}
        >
          Crear por una empresa
        </Link>
      </TitleOnPage>
      <TabsRequest trainingRequest={trainingRequest} />
    </div>
  );
};

export default AdminRequestPage;
