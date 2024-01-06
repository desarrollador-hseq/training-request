"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Collaborator } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AddCollaboratorForm } from "../../_components/add-collaborator-form";
import { IdentificationFileForm } from "./identification-file-form";
import { Button } from "@/components/ui/button";

export const TabsEditCollaborator = ({
  collaborator,
}: {
  collaborator: Collaborator;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(initialTab || "informacion");

  useEffect(() => {
    if (!searchParams.get("tab")) {
      handleTabChange("informacion");
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
      defaultValue="informacion"
      onValueChange={handleTabChange}
      value={activeTab}
      className="w-full flex flex-col items-center"
    >
      <TabsList className="w-[70%]">
        <TabsTrigger className="w-full" value="informacion">
          Información
        </TabsTrigger>
        <TabsTrigger className="w-full" value="archivos">
         Gestionar documentos
        </TabsTrigger>
      </TabsList>
      {/*--------- datos ---------*/}
      <TabsContent value="informacion">
        <Card>
          <CardContent className="min-h-screen">
            <div className="p-0 overflow-hidden rounded-md">
              {collaborator && (
                <AddCollaboratorForm
                  collaborator={collaborator}
                  handleTabChange={handleTabChange}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      {/*--------- archivos ---------*/}
      <TabsContent value="archivos" className="w-full min-w-full">
        <Card className="w-full min-w-full">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-1 mb-7">
            <IdentificationFileForm
             label="Documento de identidad"
              collaboratorId={collaborator.id}
              file={collaborator.identificationFile}
              fileType="identificationFile"
            />
            <IdentificationFileForm
             label="Seguridad social vigente"
              collaboratorId={collaborator.id}
              file={collaborator.socialSecurityFile}
              fileType="socialSecurityFile"
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
