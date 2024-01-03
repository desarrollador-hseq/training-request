import { Building2, User, Users2 } from "lucide-react";
import { db } from "@/lib/db";

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

  return (
    <div>
      <h2 className="text-2xl">Panel</h2>
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
                  <div className="text-2xl font-bold text-gray-900">{admins.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
