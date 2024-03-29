"use client";

import { Certificate, Coach } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTabManager from "@/hooks/useTabManager";
import { AddCertificateForm } from "../../_components/add-certificate-form";
import { FileUploadForm } from "@/components/file-upload-form";
import { DeactivateCertificate } from "./deactivate-certificate";
import { SendCertificate } from "./send-certificate";

interface TabsEditCertificateProps {
  coaches: Coach[];
  certificate: Certificate;
  baseUrl: string;
  companyEmail?: string | null;
  companyContact?: string | null;
  canManagePermissions: boolean;
}

export const TabsEditCertificate = ({
  coaches,
  certificate,
  baseUrl,
  canManagePermissions,
  companyContact,
  companyEmail
}: TabsEditCertificateProps) => {
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
        <SendCertificate
          canManagePermissions={canManagePermissions}
          certificate={certificate}
          companyContact={companyContact}
          companyEmail={companyEmail}
        />
        <CardHeader className="flex justify-center items-center">
          <TabsList className="w-[70%]">
            <TabsTrigger className="w-full" value="datos">
              Datos
            </TabsTrigger>
            <TabsTrigger className="w-full relative" value="fichas">
              Ficha
              <span className="absolute right-2">
                {certificate.fileUrl && "✅"}
              </span>
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="datos">
            <AddCertificateForm
              coaches={coaches}
              certificate={certificate}
              baseUrl={`${baseUrl}`}
              isCreate={false}
              canManagePermissions={canManagePermissions}
              trainingRequestId=""
              // certAlreadyExists
            />
            <DeactivateCertificate
              certificate={certificate}
              canManagePermissions={canManagePermissions}
            />
          </TabsContent>
          <TabsContent value="fichas">
            <FileUploadForm
              apiUrl={`/api/upload/file`}
              field="fileUrl"
              label="Ficha de entrenamiento"
              ubiPath="certificados/fichas"
              update={`/api/certificates/${certificate.id}/file`}
              file={certificate.fileUrl}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};
