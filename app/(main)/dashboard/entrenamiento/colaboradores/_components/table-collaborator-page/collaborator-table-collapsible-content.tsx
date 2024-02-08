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
import { Certificate, Collaborator, CourseLevel } from "@prisma/client";
import { format } from "date-fns";
import { Ban, Link2 } from "lucide-react";
import { es } from "date-fns/locale";

interface CertificateWithCourseLevel extends Certificate {
  courseLevel: CourseLevel;
}
type CollaboratorTableCollapsibleContentProps = {
  openCollapsible: boolean;
  certificates: CertificateWithCourseLevel[];
  collaborator: Collaborator;
};

export const CollaboratorTableCollapsibleContent = ({
  openCollapsible,
  certificates,
  collaborator,
}: CollaboratorTableCollapsibleContentProps) => {
  return (
    <CollapsibleContent asChild className="CollapsibleContent w-full">
      <TableRow
        className={cn(openCollapsible && "bg-slate-100 hover:bg-slate-100")}
      >
        <TableCell className="animation" colSpan={7}>
          <Card className="bg-slate-100 overflow-hidden border-2 border-secondary">
            <CardHeader className="p-0">
              <SubtitleSeparator
                text={`Datos de formacion anterior | ${collaborator.fullname} - ${collaborator.numDoc}`}
              />
            </CardHeader>
            <CardContent className="">
              <Table className="">
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates &&
                    certificates.map((certificate) => (
                      <TableRow>
                        {certificate && (
                          <>
                            <TableCell>
                              {certificate.courseLevel.name}
                            </TableCell>
                            <TableCell>
                              {format(certificate.certificateDate!, "PPP", {
                                locale: es,
                              })}
                            </TableCell>
                            <TableCell>
                              {certificate.fileUrl ? (
                                <a
                                  href={certificate.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <div className="bg-emerald-700 px-1 rounded-sm w-[28px] flex justify-center">
                                    <Link2 className="w-6 h-6 text-center" />
                                  </div>
                                </a>
                              ) : (
                                <div className="bg-red-700 px-1 rounded-sm p-1 w-[28px] flex justify-center cursor-not-allowed">
                                  <Ban className="w-4 h-4" />
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

{
  /* <Card className="grid grid-cols-3 grid-rows-1 gap-2 bg-accent text-white p-1 px-3">
<div className="flex flex-col items-center border-b md:border-r md:border-b-0 border-white">
  <h5 className="font-bold">Título</h5>
  <p>{certificate.courseLevel.name}</p>
</div>
<div className="flex flex-col items-center border-b md:border-r md:border-b-0 border-white">
  <h5 className="font-bold">fecha</h5>
  <p>
    {format(certificate.date!, "PPP", {
      locale: es,
    })}
  </p>
</div>
<div className="flex flex-col items-center">
  <h5 className="font-bold">Link</h5>
  {certificate.fileUrl ? (
    <a
      href={certificate.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="bg-emerald-700 px-1 rounded-sm w-[28px] flex justify-center">
        <Link2 className="w-6 h-6 text-center" />
      </div>
    </a>
  ) : (
    <div className="bg-red-700 px-1 rounded-sm p-1 w-[28px] flex justify-center cursor-not-allowed">
      <Ban className="w-4 h-4" />
    </div>
  )}
</div>
</Card> */
}
