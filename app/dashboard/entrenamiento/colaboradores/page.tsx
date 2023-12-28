import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { columnsCollaboratorTable } from "./_components/table-collaborator-page/collaborators-table-columns";
import { TitleOnPage } from "@/components/title-on-page";
import { CollaboratorsTable } from "./_components/table-collaborator-page/collaborators-table";

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
          courseLevel: true
        }
      },
    },
  });

  return (
    <div>
      <TitleOnPage text="Listado de colaboradores" />
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
