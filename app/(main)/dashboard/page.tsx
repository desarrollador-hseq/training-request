
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ClipboardCheck, ScrollText, UsersRound } from "lucide-react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { TitleOnPage } from "@/components/title-on-page";
import { KpiCard } from "@/components/kpi-card";
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
    orderBy: {
      createdAt: "desc"
    }
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
    orderBy: {
      createdAt: "desc"
    }
  });
  const certificates = await db.certificate.findMany({
    where: {
      collaborator: { companyId: session.user.id, active: true },
      active: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="space-y-5 mb-5">
      <TitleOnPage text="Panel" bcrumb={[]} />

      <div className="grid gap-7 grid-cols-2 xl:grid-cols-3 place-content-center">
        <KpiCard
          color="blue"
          icon={<ClipboardCheck className="text-blue-500 w-8 h-8" />}
          number={trainingRequests.length}
          title="Solicitudes"
        />
        <KpiCard
          color="emerald"
          icon={<UsersRound className="text-emerald-500 w-8 h-8" />}
          number={collaborators.length}
          title="Colaboradores"
        />
        <KpiCard
          color="yellow"
          icon={<ScrollText className="text-yellow-500 w-8 h-8" />}
          number={certificates.length}
          title="Certificados"
        />
      </div>

      <ListLatestRequestsAdded trainingRequests={trainingRequests} />
      <ListLatestCollaboratorsAdded collaborators={collaborators} />
      <ListLatestCertificatesAdded certificates={certificates} />
    </div>
  );
};

export default DashboardPage;
