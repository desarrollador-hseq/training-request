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
        
      </TabsContent>
    </Tabs>
  );
};
