import { db } from "@/lib/db";
import { User, Users2 } from "lucide-react";
import { getServerSession } from "next-auth";
import React from "react";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    redirect("/");
  }

  const collaborators = await db.collaborator.findMany({
    where: {
      companyId: session.user.id,
      active: true,
    },
  });

  const trainingRequests = await db.trainingRequest.findMany({
    where: {
      companyId: session.user.id,
    },
  });

  return (
    <div>
      <h2 className="text-2xl">Panel</h2>

      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="p-5 bg-white rounded shadow-sm">
          <div className="flex items-center space-x-4 h-[80px]">
            <div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-400">
                <User />
              </div>
            </div>
            <div>
              <div className="text-gray-400">Customers</div>
              <div className="text-2xl font-bold text-gray-900">1375</div>
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
              <div className="text-gray-400">MRR</div>
              <div className="text-2xl font-bold text-gray-900">25</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
