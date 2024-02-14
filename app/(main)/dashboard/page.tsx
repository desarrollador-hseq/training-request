import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Files, ScrollText, Users2 } from "lucide-react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { TitleOnPage } from "@/components/title-on-page";
import { Card } from "@/components/ui/card";
import { ListLatestCollaboratorsAdded } from "./_components/list-latest-collaborators-added";
import { ListLatestRequestsAdded } from "./_components/list-latest-requests-added";
import { ListLatestCertificatesAdded } from "./_components/list-latest-certificates-added";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    redirect("/");
  }

  const collaborators = await db.collaborator.findMany({
    where: {
      companyId: session.user.id,
      active: true,
    },
  });

  const trainingRequests = await db.trainingRequest.findMany({
    where: {
      companyId: session.user.id,
      active: true,
    },
    include: {
      course: {
        select: {
          name: true,
        },
      },
      collaborators: {
        select: {
          collaboratorId: true,
        },
      },
    },
  });
  const certificates = await db.certificate.findMany({
    where: {
      collaborator: { companyId: session.user.id, active: true },
      active: true,
    },
  });

  return (
    <div className="space-y-5">
      <TitleOnPage text="Panel" bcrumb={[]} />

      <div className="grid gap-7 grid-cols-2 xl:grid-cols-3 place-content-center">
       
        <Card className="p-3 flex justify-center">
          <div className="flex items-center space-x-4 h-[150px] lg:flex-row flex-col">
            <div className="flex items-center justify-center">
              <Files className=" w-12 h-12 rounded-full bg-red-50 text-red-400" />
            </div>
            <div className="flex flex-col justify-around  h-24">
              <div className="text-gray-700 font-bold text-2xl">
                Solicitudes
              </div>
              <div className="text-3xl font-bold text-secondary text-center">
                {trainingRequests.length}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-3 flex justify-center ">
          <div className="flex items-center space-x-4 h-[150px] lg:flex-row flex-col">
            <div className="flex items-center justify-center">
              <Users2 className=" w-12 h-12 rounded-full bg-red-50 text-red-400" />
            </div>
            <div className="flex flex-col justify-around  h-24">
              <div className="text-gray-700 font-bold text-2xl">
                Colaboradores
              </div>
              <div className="text-3xl font-bold text-secondary text-center">
                {collaborators.length}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-3 flex justify-center">
          <div className="flex items-center space-x-4 h-[150px] lg:flex-row flex-col">
            <div className="flex items-center justify-center">
              <ScrollText className=" w-12 h-12 rounded-full bg-red-50 text-red-400" />
            </div>
            <div className="flex flex-col justify-around  h-24">
              <div className="text-gray-700 font-bold text-2xl">
                Certificados
              </div>
              <div className="text-3xl font-bold text-secondary text-center">
                {certificates.length}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <ListLatestRequestsAdded trainingRequests={trainingRequests} />
      <ListLatestCollaboratorsAdded collaborators={collaborators} />
      <ListLatestCertificatesAdded certificates={certificates} />
    </div>
  );
};

export default DashboardPage;
