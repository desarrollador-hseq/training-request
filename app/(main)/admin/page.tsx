import { Building2, User, Users2 } from "lucide-react";
import { db } from "@/lib/db";
import { TitleOnPage } from "@/components/title-on-page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AdminCollaboratorsTable } from "./entrenamiento/colaboradores/_components/admin-collaborators-table";
import { columnsAdminCollaboratorTable } from "./entrenamiento/colaboradores/_components/admin-collaborators-table-columns";
import { TrainingRequestCollaborator } from "@prisma/client";
import { AdminRequestsTable } from "./entrenamiento/solicitudes/_components/admin-requests-table";
import { adminRequestTablecolumns } from "./entrenamiento/solicitudes/_components/admin-requests-table-columns";
import { columnsAdminCollaboratorTableSimple } from "./entrenamiento/colaboradores/_components/admin-collaborators-table-columns-simple";

const crumbs = [{ label: "inicio", path: "inicio" }];

const AdminPage = async () => {
  const collaborators = await db.collaborator.findMany({
    where: {
      active: true,
    },
  });

  const trainingRequests = await db.trainingRequest.findMany({
    where: {
      NOT: { state: "CANCELLED", company: { NOT: { role: "ADMIN" } } },
    },
  });
  const companies = await db.company.findMany({
    where: {
      NOT: { role: "ADMIN" },
      active: true,
    },
  });
  const admins = await db.company.findMany({
    where: {
      role: "ADMIN",
      active: true,
    },
  });


  const requests = await db.trainingRequest.findMany({
    where: { state: "ACTIVE" },
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

  const trainingRequestCollaborator =
    await db.trainingRequestCollaborator.findMany({
      where: {
        isScheduled: true,
        trainingRequest: {
          state: "ACTIVE",
        },
      },
      include: {
        courseLevel: {
          select: {
            name: true,
            course: {
              select: {
                shortName: true,
              },
            },
          },
        },
        collaborator: {
          include: {
            company: {
              select: {
                nit: true,
              },
            },
            certificates: {
              include: {
                courseLevel: {
                  include: {
                    course: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    

  return (
    <div>
      <TitleOnPage text="Panel" bcrumb={crumbs} />
      <div className="flex items-center ">
        <div className="container  mx-auto my-12">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-5 bg-white rounded shadow-sm">
              <div className="flex items-center space-x-4 h-[80px]">
                <div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-400">
                    <Building2 />
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Empresas</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {companies.length}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 bg-white rounded shadow-sm">
              <div className="flex items-center space-x-4 h-[80px]">
                <div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 text-cyan-400">
                    <User />
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Solicitudes</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {trainingRequests.length}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 bg-white rounded shadow-sm ">
              <div className="flex items-center space-x-4 h-[80px]">
                <div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-400">
                    <Users2 />
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Colaboradores</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {collaborators.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white rounded shadow-sm">
              <div className="flex items-center space-x-4 h-[80px]">
                <div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-400">
                    <User />
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Administradores</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {admins.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Card className="bg-emerald-50">
          <CardHeader>
            <h3 className="text-3xl font-bold text-primary text-center">
              Solicitudes activas
            </h3>
          </CardHeader>
          <CardContent>
            <AdminRequestsTable
              columns={adminRequestTablecolumns}
              data={requests}
            />
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardHeader>
            <h3 className="text-3xl font-bold text-primary text-center">
              Colaboradores por programar
            </h3>
          </CardHeader>
          <CardContent>
            <AdminCollaboratorsTable
              columns={columnsAdminCollaboratorTableSimple}
              data={trainingRequestCollaborator.map(
                (m: TrainingRequestCollaborator) => m
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
