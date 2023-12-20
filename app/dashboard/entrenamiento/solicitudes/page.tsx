import { getServerSession } from "next-auth";
import { RequestsTable } from "./_components/requests-table";
import { columnsRequestTable } from "./_components/requests-table-columns";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { TitleOnPage } from "@/components/title-on-page";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

const RequestTrainingPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    return redirect("/dashboard");
  }

  const trainingRequests = await db.trainingRequest.findMany({
    where: {
      companyId: session.user.id,
    },
    include: {
      course: true,
      members: {
        include: {
            courseLevel: true
        }
      },
      
    },
  });

  return (
    <div>
      <div className="flex items-center">
        <TitleOnPage text="Listado de solicitudes" />
        <div>
          <Button className="bg-accent">Crear</Button>
        </div>
      </div>

      <Card className="min-h-screen">
        <CardContent className="flex">
          <RequestsTable
            data={trainingRequests}
            columns={columnsRequestTable}
          />
          
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestTrainingPage;
