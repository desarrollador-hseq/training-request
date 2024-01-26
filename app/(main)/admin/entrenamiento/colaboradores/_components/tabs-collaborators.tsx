"use client";

import {
  Certificate,
  Collaborator,
  CourseLevel,
  TrainingRequestCollaborator,
} from "@prisma/client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTabManager from "@/hooks/useTabManager";
import { AdminCollaboratorsTable } from "./admin-collaborators-table";
import { columnsAdminCollaboratorTable } from "./admin-collaborators-table-columns";
interface TabsCollaboratorsProps {
  courseLevel: CourseLevel | null | undefined;
  collaborators: Collaborator &
    {
      trainingRequestsCollaborators:
        | TrainingRequestCollaborator[]
        | null
        | undefined;
      certificates: Certificate | null | undefined;
    }[];
}

export const TabsCollaborators = ({
  collaborators,
}: TabsCollaboratorsProps) => {
  const { activeTab, handleTabChange } = useTabManager({
    initialTab: "por-certificar",
  });

  console.log({ col: collaborators.filter((col) =>
    col.trainingRequestsCollaborators?.map(
      (tr) => tr.isScheduled && !tr.wasCertified
    ))});

  const toCertificate = collaborators.filter(col => col.isScheduled && !col.wasCertified)

  return (
    <Tabs
      defaultValue="por-certificar"
      onValueChange={handleTabChange}
      value={activeTab}
      className="w-full flex flex-col items-center"
    >
      <Card className="w-full rounded-sm shadow-md ">
        <CardHeader className="flex justify-center items-center">
          <TabsList className="w-[70%]">
            <TabsTrigger className="w-full" value="por-certificar">
              Por certificar
            </TabsTrigger>
            <TabsTrigger className="w-full" value="todos">
              Todos
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="por-certificar">
            <AdminCollaboratorsTable
              columns={columnsAdminCollaboratorTable}
              data={toCertificate}
            />
          </TabsContent>
          <TabsContent value="todos">
          <AdminCollaboratorsTable
            columns={columnsAdminCollaboratorTable}
            data={collaborators}
          />
        </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};
