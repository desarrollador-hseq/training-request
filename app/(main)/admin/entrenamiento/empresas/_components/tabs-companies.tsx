"use client";

import React, { useEffect, useState } from "react";
import { Company } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTabManager from "@/hooks/useTabManager";
import { AdminCollaboratorsTable } from "./admin-companies-table";
import { columnsAdminCompaniesTable } from "./admin-companies-table-columns";

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
            <AdminCollaboratorsTable
              columns={columnsAdminCompaniesTable}
              data={toValidate}
            />
          </TabsContent>
          <TabsContent value="activas">
            <AdminCollaboratorsTable
              columns={columnsAdminCompaniesTable}
              data={actives}
            />
          </TabsContent>
          <TabsContent value="inactivas">
            <AdminCollaboratorsTable
              columns={columnsAdminCompaniesTable}
              data={inactives}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};
