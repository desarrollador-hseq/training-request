"use client";

import {
  Certificate,
  Collaborator,
  Company,
  Course,
  CourseLevel,
} from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTabManager from "@/hooks/useTabManager";
import { AdminCertificateTable } from "./admin-certificates-table";
import { columnsAdminCertificatesTable } from "./admin-certificates-table-columns";
import { isAfter, addMonths } from "date-fns";

interface CertificateWithCourseLevel extends Certificate {
  courseLevel: { monthsToExpire: number | undefined | null };
}

interface TabsCertificatesProps {
  certificates: CertificateWithCourseLevel[];
}

export const TabsCertificates = ({ certificates }: TabsCertificatesProps) => {
  const currentDate = new Date();
  const { activeTab, handleTabChange } = useTabManager({
    initialTab: "activos",
  });

  const certificatesNotExpired = certificates.filter((cer) => {
    if (cer.certificateDate && cer.dueDate) {
      const expirationDate = addMonths(
        cer.certificateDate,
        cer?.courseLevel?.monthsToExpire!
      );
      return isAfter(expirationDate, currentDate);
    }
    return false;
  });

  const certificatesExpired = certificates.filter((cer) => {
    if (cer.dueDate && cer.certificateDate) {
      const expirationDate = addMonths(
        cer.certificateDate,
        cer.courseLevel.monthsToExpire!
      );
      return isAfter(currentDate, expirationDate);
    }
    return false;
  });

  return (
    <Tabs
      defaultValue="activos"
      onValueChange={handleTabChange}
      value={activeTab}
      className="w-full flex flex-col items-center"
    >
      <Card className="w-full rounded-sm shadow-md ">
        <CardHeader className="flex justify-center items-center">
          <TabsList className="w-[70%]">
            <TabsTrigger className="w-full" value="activos">
              Activos
            </TabsTrigger>
            <TabsTrigger className="w-full" value="vencidos">
              Vencidos
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="activos">
            <AdminCertificateTable
              columns={columnsAdminCertificatesTable}
              data={certificatesNotExpired}
            />
          </TabsContent>

          <TabsContent value="vencidos">
            <AdminCertificateTable
              columns={columnsAdminCertificatesTable}
              data={certificatesExpired}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};
