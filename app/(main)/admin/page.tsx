import {
  BarChart3,
  BookOpen,
  Building2,
  KeyRound,
  KeySquare,
  Lock,
  PersonStanding,
  PieChart,
  ScrollText,
} from "lucide-react";
import { db } from "@/lib/db";
import { TitleOnPage } from "@/components/title-on-page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AdminRequestsTable } from "./entrenamiento/solicitudes/_components/admin-requests-table";
import { columnsAdminCollaboratorTableSimple } from "./entrenamiento/colaboradores/_components/admin-collaborators-table-columns-simple";
import { AdminCollaboratorsProgrammingTable } from "./entrenamiento/colaboradores/_components/admin-collaborators-programming-table";
import { KpiCard } from "@/components/kpi-card";
import { Separator } from "@/components/ui/separator";
import { adminRequestTablecolumns } from "./entrenamiento/solicitudes/_components/admin-requests-table-columns";
import { RequestReport } from "./_components/request-report";
import { ModalMoreReports } from "./_components/modal-more-reports";
import { SimpleModal } from "@/components/simple-modal";

const crumbs = [{ label: "inicio", path: "inicio" }];

const AdminPage = async () => {
  const courses = await db.course.findMany({
    where: {
      active: true,
    },
  });

  const trainingRequests = await db.trainingRequest.findMany({
    where: {
      NOT: [
        { state: "CANCELLED" },
        { state: "PENDING" },
        { company: { role: "ADMIN" } },
      ],
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

  const certificates = await db.certificate.findMany({
    where: {
      active: true,
    },
  });

  const requestsActives = await db.trainingRequest.findMany({
    where: { state: "ACTIVE", active: true },
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
  const requests = await db.trainingRequest.findMany({
    where: { NOT: { state: "PENDING" }, active: true },
    orderBy: {
      activeFrom: "desc",
    },
  });

  const trainingRequestCollaborator =
    await db.trainingRequestCollaborator.findMany({
      where: {
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
                active: true,
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

  const coaches = await db.coach.findMany({
    where: {
      active: true,
    },
  });

  return (
    <div>
      <TitleOnPage text="Panel" bcrumb={crumbs} />
      <div className="flex items-center w-full">
        <div className="w-full my-2">
          <div className=" gap-2">
            <div className="grid gap-2 sm:grid-cols-3 w-full">
              <KpiCard
                color="yellow"
                icon={<Building2 className="text-yellow-500 w-8 h-8" />}
                title="Empresas"
                number={companies.length}
                // btnStatistics={
                //   <SimpleModal
                //     textBtn={<BarChart3 />}
                //     title="Estadisticas"
                //     btnClass=" px-3 w-fit"
                //   >
                //     soon
                //   </SimpleModal>
                // }
              />
              <KpiCard
                color="cyan"
                icon={<ScrollText className="text-cyan-500 w-8 h-8" />}
                title="Solicitudes"
                number={trainingRequests.length}
                btnStatistics={
                  <SimpleModal
                    textBtn={<BarChart3 />}
                    title="Estadisticas"
                    btnClass=" px-3 w-fit"
                  >
                    <RequestReport requests={requests} />
                  </SimpleModal>
                }
              />
              <KpiCard
                color="blue"
                icon={<ScrollText className="text-blue-500 w-8 h-8" />}
                title="Certificados"
                number={certificates.length}
              />
              <KpiCard
                color="red"
                icon={<BookOpen className="text-red-500 w-8 h-8" />}
                title="Cursos"
                number={courses.length}
              />
              <KpiCard
                color="emerald"
                icon={<PersonStanding className="text-emerald-500 w-8 h-8" />}
                title="Entrenadores"
                number={coaches.length}
              />
              <KpiCard
                color="slate"
                icon={<KeySquare className=" text-slate-500 w-8 h-8" />}
                title="Administradores"
                number={admins.length}
              />
            </div>

            {/* <div>
            <RequestReport requests={requests} />
            </div> */}
          </div>
          {/* <ModalMoreReports requests={requests} companies={companies}  /> */}
        </div>
      </div>

      <Separator className="my-3 border-4 border-secondary/70 rounded-full" />

      <div className="flex flex-col gap-2">
        <Card className="bg-emerald-50">
          <CardHeader>
            <h3 className="text-3xl font-bold text-emerald-900 text-center">
              Solicitudes activas
            </h3>
          </CardHeader>
          <CardContent>
            <AdminRequestsTable
              columns={adminRequestTablecolumns}
              data={requestsActives.filter(
                (req) => req.company.active === true
              )}
            />
          </CardContent>
        </Card>
        <Separator className="my-3 border-4 border-secondary/70 rounded-full" />
        <Card className="bg-yellow-50">
          <CardHeader>
            <h3 className="text-3xl font-bold text-yellow-900 text-center">
              Colaboradores por programar
            </h3>
          </CardHeader>
          <CardContent>
            <AdminCollaboratorsProgrammingTable
              columns={columnsAdminCollaboratorTableSimple}
              data={trainingRequestCollaborator.filter(
                (traCol) => traCol?.collaborator?.company?.active === true
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
