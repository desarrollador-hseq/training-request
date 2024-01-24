"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { TrainingRequestCollaborator } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminRequestsTable } from "./admin-requests-table";
import { AdminCollaboratorsTable } from "../../colaboradores/_components/admin-collaborators-table";
import { columnsAdminCollaboratorTable } from "../../colaboradores/_components/admin-collaborators-table-columns";
import { adminRequestTablecolumns } from "./admin-requests-table-columns";
import useTabManager from "@/hooks/useTabManager";

interface TabsRequestProps {
  requests: any;
  trainingRequestCollaborators: any;
}

export const TabsRequest = ({
  requests,
  trainingRequestCollaborators,
}: TabsRequestProps) => {

  const { activeTab, handleTabChange } = useTabManager({
    initialTab: "solicitud",
  });



  return (
    <Tabs
      defaultValue="solicitud"
      onValueChange={handleTabChange}
      value={activeTab}
      className="w-full flex flex-col items-center"
    >
      <Card className="w-full rounded-sm shadow-md ">
        <CardHeader className="flex justify-center items-center">
          <TabsList className="w-[70%]">
            <TabsTrigger className="w-full" value="solicitud">
              Solicitudes
            </TabsTrigger>
            <TabsTrigger className="w-full" value="colaboradores">
              Todos los Caloboradores
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="solicitud">
            <div className="min-h-screen">
              <div className="flex">
                <AdminRequestsTable
                  data={requests}
                  columns={adminRequestTablecolumns}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="colaboradores">
            <AdminCollaboratorsTable
              columns={columnsAdminCollaboratorTable}
              data={trainingRequestCollaborators.map((m: TrainingRequestCollaborator) => m)}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};
