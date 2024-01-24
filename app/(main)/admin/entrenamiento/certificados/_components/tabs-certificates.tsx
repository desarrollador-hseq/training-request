"use client";

import { Certificate } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTabManager from "@/hooks/useTabManager";
import { AdminCertificateTable } from "./admin-certificates-table";
import { columnsAdminCertificatesTable } from "./admin-certificates-table-columns";

interface TabsCertificatesProps {
  certificates: Certificate &
    {
      courseLevel: {
        name:
          | string
          | undefined
          | (null & { course: { name: string | undefined | null } });
      };
      collaborator: {
        fullname: string | undefined | null;
        numDoc: string | undefined | null;
        email: string | undefined | null;
        company: {
          businessName: string | undefined | null;
          nit: string | undefined | null;
        };
      };
    }[];
}

export const TabsCertificates = ({
  certificates,
}: {
  certificates: TabsCertificatesProps;
}) => {
  const { activeTab, handleTabChange } = useTabManager({
    initialTab: "activas",
  });

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
              Por activas
            </TabsTrigger>
            <TabsTrigger className="w-full" value="activas">
              Activas
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="activas">
            <AdminCertificateTable
              columns={columnsAdminCertificatesTable}
              data={certificates}
            />
          </TabsContent>
          {/* <TabsContent value="activas">
            <AdminCertificateTable
              columns={columnsAdminCertificatesTable}
              data={actives}
            />
          </TabsContent> */}
        </CardContent>
      </Card>
    </Tabs>
  );
};
