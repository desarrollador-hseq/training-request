import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { Suspense } from "react";
import { RequiredDocument } from "@prisma/client";
import { IdentificationFileForm } from "../../../../colaboradores/[collaboratorId]/_components/identification-file-form";
import { Loader2 } from "lucide-react";

export const TabsDocumentRequired = ({
  documentsRequired,
  collaboratorId,
}: {
  documentsRequired: RequiredDocument[];
  collaboratorId: string;
}) => {
  return (
    <div className="w-full">
      <Tabs
        defaultValue={"0"}
        className="w-full h-full flex flex-col items-center max-w-full"
      >
        <TabsList className="w-[80%] my-2 relative max-w-5xl" defaultValue={`0`}>
          {documentsRequired?.map((doc, index) => (
            <TabsTrigger key={doc.id} className="w-full max-w-5xl" value={`${index}`}>
              {doc.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {documentsRequired?.map((doc, index) => (
          <TabsContent
            key={doc.id}
            value={`${index}`}
            className="w-full max-w-[1000px] max-h-full"
          >
            <IdentificationFileForm
              label={doc.name!}
              collaboratorId={collaboratorId!}
              courseLevelId={doc.courseLevelId!}
              documentRequiredId={doc.id}
              field={doc.name!}
              ubiPath="colaboradores/documentos"
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
