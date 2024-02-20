"use client";

import { Company } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTabManager from "@/hooks/useTabManager";
import { columnsAdminCompaniesTable } from "./admin-companies-table-columns";
import { TableDefault } from "@/components/table-default";

export const TabsCompanies = ({ companies }: { companies: Company[] }) => {
  const { activeTab, handleTabChange } = useTabManager({
    initialTab: "validar",
  });

  const actives = companies.filter(
    (com) => com.active && com.isValid && com.role !== "ADMIN"
  );
  const toValidate = companies.filter(
    (com) => com.active && !com.isValid && com.role !== "ADMIN"
  );
  const inactives = companies.filter(
    (com) => !com.active && com.role !== "ADMIN"
  );

  return (
    <Tabs
      defaultValue="validar"
      onValueChange={handleTabChange}
      value={activeTab}
      className="w-full flex flex-col items-center"
    >
      <Card className="w-full rounded-sm shadow-md ">
        <CardHeader className="flex justify-center items-center">
          <TabsList className="w-[70%]">
            <TabsTrigger className="w-full" value="validar">
              Por validar
            </TabsTrigger>
            <TabsTrigger className="w-full" value="activas">
              Activas
            </TabsTrigger>
            <TabsTrigger className="w-full" value="inactivas">
              Inactivas
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="validar">
            <TableDefault
              editHref={{
                btnText: "Editar",
                href: `/admin/entrenamiento/empresas`,
              }}
              columns={columnsAdminCompaniesTable}
              data={toValidate}
            />
          </TabsContent>
          <TabsContent value="activas">
            <TableDefault
              editHref={{
                btnText: "Editar",
                href: `/admin/entrenamiento/empresas`,
              }}
              columns={columnsAdminCompaniesTable}
              data={actives}
            />
          </TabsContent>
          <TabsContent value="inactivas">
            <TableDefault
              editHref={{
                btnText: "Editar",
                href: `/admin/entrenamiento/empresas`,
              }}
              columns={columnsAdminCompaniesTable}
              data={inactives}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};
