import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";

import { TabsRequest } from "./_components/tabs-request";
import { Card, CardContent } from "@/components/ui/card";

const crumbs = [{ label: "solicitudes", path: "solicitudes" }];

const AdminRequestPage = async () => {
  const requests = await db.trainingRequest.findMany({
    where: { active: true },
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
      <TitleOnPage text="Solicitudes" bcrumb={crumbs} />
      <TabsRequest
        requests={requests}
      />
    </div>
  );
};

export default AdminRequestPage;
