"use client";

import {
  Collaborator,
  Company,
  Course,
  CourseLevel,
  TrainingRequest,
  TrainingRequestCollaborator,
} from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminRequestsTable } from "./admin-requests-table";
import { adminRequestTablecolumns } from "./admin-requests-table-columns";
import useTabManager from "@/hooks/useTabManager";
import { adminRequestsActivesTablecolumns } from "./admin-requests-actives-table-columns";

interface TabsRequestProps {
  trainingRequest:
    | (TrainingRequest &
        {
          course: Course | null | undefined;
          company: Company | null | undefined;
          collaborators:
            | (TrainingRequestCollaborator &
                {
                  collaborator: Collaborator | null | undefined;
                  courseLevel: CourseLevel | null | undefined;
                })[]
            | null
            | undefined;
        })[]
    | null
    | undefined;
}

export const TabsRequest = ({ trainingRequest }: TabsRequestProps) => {
  const { activeTab, handleTabChange } = useTabManager({
    initialTab: "activas",
  });

  const actives = trainingRequest?.filter((req) => req.state === "ACTIVE") || [];
  const executed = trainingRequest?.filter((req) => req.state === "EXECUTED") || [];
  const cancelled = trainingRequest?.filter((req) => req.state === "CANCELLED") || [];

  return (
    <Tabs
      defaultValue="activas"
      onValueChange={handleTabChange}
      value={activeTab}
      className="w-full flex flex-col items-center"
    >
      <Card className="w-full rounded-sm shadow-md ">
        <CardHeader className="flex justify-center items-center">
          <TabsList className="w-[70%]">
            <TabsTrigger className="w-full" value="activas">
              Activas
            </TabsTrigger>
            <TabsTrigger className="w-full" value="ejecutadas">
              Ejecutadas
            </TabsTrigger>
            <TabsTrigger className="w-full" value="canceladas">
              Canceladas
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="activas">
            <AdminRequestsTable
              columns={adminRequestTablecolumns}
              data={actives}
            />
          </TabsContent>
          <TabsContent value="ejecutadas">
            <AdminRequestsTable
              columns={adminRequestTablecolumns}
              data={executed}
            />
          </TabsContent>
          <TabsContent value="canceladas">
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
