"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTabManager from "@/hooks/useTabManager";
import { CourseLevel } from "@prisma/client";
import { AddCourseLevelForm } from "./add-courselevel-form";
import { AddDocumentRequiredForm } from "./add-document-required-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TabsCourselevelProps {
  courseLevel:
    | (CourseLevel & {
        requiredDocuments:
          | { name: string | null; id: string | null }[]
          | null
          | undefined;
        course: { name: string | null | undefined };
      })
    | null
    | undefined;
  courseId: string;
  courseName?: string | null;
}

export const TabsCorselevel = ({
  courseLevel,
  courseId,
  courseName,
}: TabsCourselevelProps) => {
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
            <TabsTrigger className="w-full" value="req">
              Documento requeridos
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="datos">
            <AddCourseLevelForm
              courseLevel={courseLevel}
              courseName={courseName}
              courseId={courseId}
            />
          </TabsContent>
          <TabsContent value="req">
            <div className="grid md:grid-cols-2 gap-2">
              <AddDocumentRequiredForm courseLevelId={courseLevel?.id} />
              <div className="flex flex-col gap-3">
                {courseLevel?.requiredDocuments?.map((req) => (
                  <AddDocumentRequiredForm
                    key={req.id}
                    requiredDocument={req}
                    courseLevelId={courseLevel.id}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};
