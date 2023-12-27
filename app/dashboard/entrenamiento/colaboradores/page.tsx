import React from "react";
import { CollaboratorsNivel, CollaboratorsTable } from "./_components/collaborators-nivel";
import { Card, CardContent } from "@/components/ui/card";
import { columnsCollaboratorTable } from "./_components/collaborators-table-columns";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { TitleOnPage } from "@/components/title-on-page";




const ListPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.role) {
      return redirect("/dashboard");
    }
  
  const collaborators = await db.collaborator.findMany({
    where: {
        companyId: session.user.id
    },
    // include: {
      
    //   // courseLevel: true,
    //   // requestTraining: {
    //   //   include: {
    //   //     certificate
    //   //   }
    //   // }
    // }
  })


  return (
    <div>
      <TitleOnPage text="Listado de colaboradores" />
      <Card className="min-h-screen">
        <CardContent>
          {/* <CollaboratorsTable columns={columnsCollaboratorTable} data={collaborators} /> */}
          <CollaboratorsNivel columns={columnsCollaboratorNivel} data={collaborators} />

        </CardContent>
      </Card>
    </div>
  );
};

export default ListPage;
