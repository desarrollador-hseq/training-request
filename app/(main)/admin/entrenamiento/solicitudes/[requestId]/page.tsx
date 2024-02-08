import Link from "next/link";
import { ArrowLeftToLine } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { TitleOnPage } from "@/components/title-on-page";
import { EditRequestForm } from "./_components/edit-request-form";

const crumbs = [
  { label: "empresas", path: "/admin/entrenamiento/empresas" },
  { label: "editar", path: "/editar" },
];

const EditRequestPage = async ({
  params,
}: {
  params: { requestId: string };
}) => {
  const trainingRequest = await db.trainingRequest.findUnique({
    where: {
      id: params.requestId,
      active: true,
    },
    include: {
      company: true,
      collaborators: {
        include: {
          collaborator: true
        }
      },
      course: true,
    },
  });

  const courses = await db.course.findMany({
    where: {
      active: true,
    },
  });

  return (
    <div>
      {trainingRequest ? (
        <div className="w-full">
          <div className="flex justify-between items-center">
            <div className="w-full flex justify-between items-center">
              <div>
                <TitleOnPage
                  text={
                    <div>
                      Editar Solicitud de:
                      <span className="font-normal">
                        {" "}
                        {trainingRequest.course.name} -{" "}
                        {trainingRequest.company.businessName}
                      </span>
                    </div>
                  }
                  bcrumb={crumbs}
                />
              </div>

              {/* <DeactivateCompany company={company} /> */}
            </div>
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
                  courses={courses}
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
