"use client";

import { Certificate, Coach, Company } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTabManager from "@/hooks/useTabManager";
import { TableDefault } from "@/components/table-default";
import { AddCertificateForm } from "./add-certificate-form";
import { FileUploadForm } from "@/components/file-upload-form";

interface TabsEditCertificateProps {
    coaches: Coach[];
    certificate: Certificate;
    baseUrl: string;
}

export const TabsEditCertificate = ({ coaches, certificate , baseUrl}: TabsEditCertificateProps) => {
  const { activeTab, handleTabChange } = useTabManager({
    initialTab: "datos",
  });

  return (
    <Tabs
      defaultValue="datos"
      onValueChange={handleTabChange}
      value={activeTab}
      className="w-full flex flex-col items-center"
    >
      <Card className="w-full rounded-sm shadow-md ">
        <CardHeader className="flex justify-center items-center">
          <TabsList className="w-[70%]">
            <TabsTrigger className="w-full" value="datos">
              Datos
            </TabsTrigger>
            <TabsTrigger className="w-full" value="fichas">
              Ficha
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="datos">
            <AddCertificateForm
              coaches={coaches}
              certificate={certificate}
              baseUrl={`${baseUrl}`}
            />
          </TabsContent>
          <TabsContent value="fichas">
           <FileUploadForm 
            apiUrl=""
            field=""
            label=""
            ubiPath=""
            update=""
            file=""

           />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};
