"use client";

import {
  Certificate,
  Collaborator,
  Company,
  Course,
  CourseLevel,
  TrainingRequestCollaborator,
} from "@prisma/client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTabManager from "@/hooks/useTabManager";

import { columnsAdminCollaboratorTable } from "./admin-collaborators-table-columns";
import { TableDefault } from "@/components/table-default";
import { AdminCollaboratorsCertificateTable } from "./admin-collaborators-certificate-table";

interface TrainingRequestCollaboratorWithCourseLevel extends TrainingRequestCollaborator {
  courseLevel?: {
    name?: string | null ;
    course?: {
      name?: string | null;
    } | null ;
  } | null ;

  collaborator: Collaborator & {
    certificates?: CertificateWithCourseLevel[] | null;
    company?: {
      nit?: string | null;
    } | null;
  } | null | undefined;
}

interface CertificateWithCourseLevel extends Certificate {
  courseLevel?: CourseLevel & {
    course: {
      name?: string | null | undefined;
    }
  } | null ;
}


interface trainingRequestCollaborator {
  trainingRequestCollaborator: TrainingRequestCollaboratorWithCourseLevel[];
}

export const TabsCollaborators = ({
  trainingRequestCollaborator,
}: trainingRequestCollaborator) => {
  const { activeTab, handleTabChange } = useTabManager({
    initialTab: "por-certificar",
  });

  console.log({ fir: trainingRequestCollaborator });

  const toCertificate = trainingRequestCollaborator.filter(
    (col) => col?.isScheduled && !col?.wasCertified
  );

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
            <AdminCollaboratorsCertificateTable
              columns={columnsAdminCollaboratorTable}
              data={toCertificate}
             
            />
          </TabsContent>
          <TabsContent value="todos">
            <AdminCollaboratorsCertificateTable
              columns={columnsAdminCollaboratorTable}
              data={trainingRequestCollaborator}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};
