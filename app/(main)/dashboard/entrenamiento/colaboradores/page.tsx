import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { columnsCollaboratorTable } from "./_components/table-collaborator-page/collaborators-table-columns";
import { TitleOnPage } from "@/components/title-on-page";
import { CollaboratorsTable } from "./_components/table-collaborator-page/collaborators-table";
import { buttonVariants } from "@/components/ui/button";
import { authOptions } from "@/lib/authOptions";

const bcrumbs = [
  { label: "Colaboradores", path: "/dashboard/entrenamiento/colaboradores" },
];

const ListCollaboratorsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) return redirect("/dashboard");

  const collaborators = await db.collaborator.findMany({
    where: {
      companyId: session.user.id,
      active: true,
    },
    include: {
      certificates: {
        include: {
          courseLevel: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center">
        <TitleOnPage text="Listado de colaboradores" bcrumb={bcrumbs}>
          <Link
            className={buttonVariants()}
            href="/dashboard/entrenamiento/colaboradores/crear"
          >
            Registrar
          </Link>
        </TitleOnPage>
      </div>
      <Card className="min-h-screen">
        <CardContent>
          <CollaboratorsTable
            columns={columnsCollaboratorTable}
            data={collaborators}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ListCollaboratorsPage;
