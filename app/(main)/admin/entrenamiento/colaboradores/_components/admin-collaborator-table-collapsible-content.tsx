"use client";
import { cn } from "@/lib/utils";
import { CollapsibleContent } from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SubtitleSeparator } from "@/components/subtitle-separator";
import { Certificate, Collaborator, Course, CourseLevel } from "@prisma/client";
import { format } from "date-fns";
import { Ban, Link2 } from "lucide-react";
import { es } from "date-fns/locale";

interface CertificateWithCourseLevel extends Certificate {
  courseLevel: CourseLevel & { course: Course | null | undefined };
}
type CollaboratorTableCollapsibleContentProps = {
  openCollapsible: boolean;
  certificates: CertificateWithCourseLevel[];
  collaborator: Collaborator;
};

export const AdminCollaboratorTableCollapsibleContent = ({
  openCollapsible,
  certificates,
  collaborator,
}: CollaboratorTableCollapsibleContentProps) => {
  return (
    <CollapsibleContent asChild className="CollapsibleContent w-full ">
      <TableRow
        className={cn(openCollapsible && "bg-slate-100 hover:bg-slate-100")}
      >
        <TableCell className="animation" colSpan={12}>
          <Card className="bg-slate-100 overflow-hidden border-2 border-secondary">
            <CardHeader className="p-0">
              <SubtitleSeparator
                text={`${collaborator.fullname} - ${collaborator.numDoc}`}
              />
            </CardHeader>
            <CardContent className="bg-blue-100 px-0">
              <Table>
                <TableHeader className="bg-blue-300 hover:bg-blue-300 text-primary">
                  <TableRow className="hover:bg-blue-300">
                    <TableHead className="text-primary">Curso</TableHead>
                    <TableHead className="text-primary">Nivel</TableHead>
                    <TableHead className="text-primary">Fecha</TableHead>
                    <TableHead className="text-primary">Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates &&
                    certificates.map((certificate) => (
                      <TableRow key={certificate.id} className="border border-b-primary">
                        {certificate && (
                          <>
                            <TableCell>
                              {certificate?.courseLevel?.course?.name}
                            </TableCell>
                            <TableCell>
                              {certificate?.courseLevel?.name}
                            </TableCell>
                            <TableCell>
                              {format(certificate?.certificateDate!, "PPP", {
                                locale: es,
                              })}
                            </TableCell>
                            <TableCell>
                              {certificate?.fileUrl ? (
                                <a
                                  href={certificate?.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <div className="bg-emerald-700 px-1 rounded-sm w-[28px] flex justify-center">
                                    <Link2 className="w-6 h-6 text-center text-white" />
                                  </div>
                                </a>
                              ) : (
                                <div className="bg-red-700 px-1 rounded-sm p-1 w-[28px] flex justify-center cursor-not-allowed">
                                  <Ban className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TableCell>
      </TableRow>
    </CollapsibleContent>
  );
};