import Link from "next/link";
import { Pencil } from "lucide-react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { RequestsTable } from "./_components/requests-table";
import { columnsRequestTable } from "./_components/requests-table-columns";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { TitleOnPage } from "@/components/title-on-page";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      collaborators: {
        include: {
          collaborator: true,
          courseLevel: true
        },
      },
    },
  });


  return (
    <div>
      <div className="flex items-center">
        <TitleOnPage text="Listado de solicitudes" />
        <div>
          <Link
            href="/dashboard/entrenamiento/solicitudes/crear"
            className={cn(buttonVariants())}
          >
            Crear
          </Link>
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
