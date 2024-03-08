"use client";

import { isAfter } from "date-fns";
import { Certificate } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTabManager from "@/hooks/useTabManager";
import { columnsAdminCertificatesTable } from "./admin-certificates-table-columns";
import { TableDefault } from "@/components/table-default";

interface CertificateWithCourseLevel extends Certificate {
  courseLevel: { monthsToExpire: number | undefined | null };
}

interface TabsCertificatesProps {
  certificates: CertificateWithCourseLevel[];
}

export const TabsCertificates = ({ certificates }: TabsCertificatesProps) => {
  const currentDate = new Date();
  const { activeTab, handleTabChange } = useTabManager({
    initialTab: "por-enviar",
  });

  const certificatesToSend = certificates.filter((cer) => {
    if (!cer.wasSent && cer.active) {
      return true;
    }
    return false;
  });

  const certificatesNotExpired = certificates.filter((cer) => {
    if (cer.wasSent) {
      if (cer.active !== true) return false;
      if (cer.dueDate) {
        return isAfter(cer.dueDate, currentDate);
      } else {
        return true;
      }
    }
    return false;
  });

  const certificatesExpired = certificates.filter((cer) => {
    if (cer.wasSent) {
      if (cer.active !== true) return false;
      if (cer.dueDate) {
        return isAfter(currentDate, cer.dueDate);
      }
    }
    return false;
  });

  const certificatesDeleted = certificates.filter(
    (cert) => cert.active === false
  );

  return (
    <Tabs
      defaultValue="por-enviar"
      onValueChange={handleTabChange}
      value={activeTab}
      className="w-full flex flex-col items-center"
    >
      <Card className="w-full rounded-sm shadow-md ">
        <CardHeader className="flex justify-center items-center">
          <TabsList className="w-[70%]">
            <TabsTrigger className="w-full" value="por-enviar">
              Por enviar
            </TabsTrigger>
            <TabsTrigger className="w-full" value="activos">
              Activos
            </TabsTrigger>
            <TabsTrigger className="w-full" value="vencidos">
              Vencidos
            </TabsTrigger>
            <TabsTrigger className="w-full" value="inactivos">
              Inactivos
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="por-enviar">
            <TableDefault
              columns={columnsAdminCertificatesTable}
              data={certificatesToSend}
              editHref={{
                btnText: `Ver`,
                href: `/admin/entrenamiento/certificados`,
              }}
            />
          </TabsContent>
          <TabsContent value="activos">
            <TableDefault
              columns={columnsAdminCertificatesTable}
              data={certificatesNotExpired}
              editHref={{
                btnText: `Ver`,
                href: `/admin/entrenamiento/certificados`,
              }}
            />
          </TabsContent>

          <TabsContent value="vencidos">
            <TableDefault
              columns={columnsAdminCertificatesTable}
              data={certificatesExpired}
              editHref={{
                btnText: `Ver`,
                href: `/admin/entrenamiento/certificados`,
              }}
            />
          </TabsContent>
          <TabsContent value="inactivos">
            <TableDefault
              columns={columnsAdminCertificatesTable}
              data={certificatesDeleted}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};
