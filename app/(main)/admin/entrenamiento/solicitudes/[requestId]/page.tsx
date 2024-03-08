import Link from "next/link";
import { ArrowLeftToLine } from "lucide-react";
import { getServerSession } from "next-auth";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { TitleOnPage } from "@/components/title-on-page";
import { EditRequestForm } from "./_components/edit-request-form";
import { authOptions } from "@/lib/authOptions";

const crumbs = [
  { label: "empresas", path: "/admin/entrenamiento/empresas" },
  { label: "editar", path: "/editar" },
];

const EditRequestPage = async ({
  params,
}: {
  params: { requestId: string };
}) => {
  const session = await getServerSession(authOptions) 
  const trainingRequest = await db.trainingRequest.findUnique({
    where: {
      id: params.requestId,
      active: true,
    },
    include: {
      company: true,
      collaborators: {
        include: {
          collaborator: true,
          courseLevel: {
            select: {
              name: true,
            },
          },
        },
      },
      course: true,
    },
  });


  return (
    <div>
      {trainingRequest ? (
        <div className="w-full">
          <div>
            <TitleOnPage
              text={
                <div>
                  Editar Solicitud:
                  <span className="font-normal">
                    {" "}
                    {trainingRequest.course.name} -{" "}
                    {trainingRequest.company.businessName}
                  </span>
                </div>
              }
              bcrumb={crumbs}
            />

            {/* <DeactivateCompany company={company} /> */}
          </div>
          <div className="w-full flex flex-col gap-3">
            <Card className="rounded-sm">
              <CardHeader>
                <div className="relative">
                  {/* <ValidateCompany company={company} /> */}
                </div>
              </CardHeader>
              <CardContent>
                <EditRequestForm
                  trainingRequest={trainingRequest}
                  canManageRequests={session?.user?.canManageRequests || false}
                  canManagePermissions={session?.user?.canManagePermissions || false}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <Card className="w-full h-full bg-red-800 flex px-3">
            <CardHeader className="w-fit flex justify-start">
              <Link
                href="/admin/entrenamiento/solicitudes"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "justify-self-start"
                )}
              >
                <ArrowLeftToLine className="w-4 h-4 mr-2" />
                Regresar
              </Link>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-0">
              <h2 className=" text-white text-xl text-center">
                No se encontró la solicitud
              </h2>
            </CardContent>
            <div />
          </Card>
        </div>
      )}
    </div>
  );
};

export default EditRequestPage;
