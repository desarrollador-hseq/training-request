"use client";

import { TrainingRequest } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminRequestsTable } from "./admin-requests-table";
import { adminRequestTablecolumns } from "./admin-requests-table-columns";
import useTabManager from "@/hooks/useTabManager";

interface TabsRequestProps {
  requests: TrainingRequest[];
}

export const TabsRequest = ({ requests }: TabsRequestProps) => {
  const { activeTab, handleTabChange } = useTabManager({
    initialTab: "solicitud",
  });

  const actives = requests.filter((req) => req.state === "ACTIVE");
  const executed = requests.filter((req) => req.state === "EXECUTED");
  const cancelled = requests.filter((req) => req.state === "CANCELLED");

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
              Activas
            </TabsTrigger>
            <TabsTrigger className="w-full" value="executed">
              Ejecutadas
            </TabsTrigger>
            <TabsTrigger className="w-full" value="cancelled">
              Canceladas
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="solicitud">
            <AdminRequestsTable
              columns={adminRequestTablecolumns}
              data={actives}
            />
          </TabsContent>
          <TabsContent value="executed">
            <AdminRequestsTable
              columns={adminRequestTablecolumns}
              data={executed}
            />
          </TabsContent>
          <TabsContent value="cancelled">
            <AdminRequestsTable
              columns={adminRequestTablecolumns}
              data={cancelled}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};
