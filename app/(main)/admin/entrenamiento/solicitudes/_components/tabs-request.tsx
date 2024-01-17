"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import qs from "query-string";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminRequestsTable } from "./admin-requests-table";
import { AdminCollaboratorsTable } from "../../colaboradores/_components/admin-collaborators-table";
import { columnsAdminCollaboratorTable } from "../../colaboradores/_components/admin-collaborators-table-columns";
import { adminRequestTablecolumns } from "./admin-requests-table-columns";

interface TabsRequestProps {
  requests: any;
  trainingRequestCollaborators: any;
}

export const TabsRequest = ({
  requests,
  trainingRequestCollaborators,
}: TabsRequestProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(initialTab || "solicitud");

  useEffect(() => {
    if (!searchParams.get("tab")) {
      handleTabChange("solicitud");
    }
  }, []);
  useEffect(() => {
    setActiveTab(searchParams.get("tab")!);
  }, [searchParams.get("tab")]);
  const handleTabChange = (value: any) => {
    setActiveTab(value);
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          tab: value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

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
              data={trainingRequestCollaborators.map((m) => m)}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};
