import { SubtitleSeparator } from "@/components/subtitle-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CourseLevel } from "@prisma/client";
import { MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";

type AdminSimpleCourselevelsProps = {
  courseLevels: CourseLevel[];
  courseId: string;
};

export const AdminSimpleCourselevels = ({
  courseId,
  courseLevels,
}: AdminSimpleCourselevelsProps) => {
  return (
    <Card className="bg-slate-100 overflow-hidden border-2 border-secondary">
      <CardHeader className="p-0">
        <SubtitleSeparator text={`Nivel`} />
      </CardHeader>
      <CardContent className="w-full p-0">
        <Table className="w-full">
          <TableHeader className="bg-secondary/80  text-white">
            <TableRow>
              <TableHead className="text-secondary-foreground text-center">
                Nombre
              </TableHead>
              <TableHead className="text-secondary-foreground text-center">
                # horas
              </TableHead>
              <TableHead className="text-secondary-foreground text-center">
                reentrenamiento
              </TableHead>
              <TableHead className="text-secondary-foreground text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courseLevels &&
              courseLevels.map((level) => (
                <TableRow className="text-center font-semibold">
                  {level && (
                    <>
                      <TableCell>{level?.name}</TableCell>
                      <TableCell>{level?.hours}</TableCell>
                      <TableCell>{level?.monthsToExpire}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-4 w-8 p-0">
                              <span className="sr-only">abrir menu</span>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="flex flex-col"
                          >
                            <DropdownMenuItem
                              asChild
                              className="cursor-pointer"
                            >
                              <Link
                                className="flex justify-center"
                                href={`/admin/entrenamiento/cursos/${courseId}/nivel/${level.id}`}
                              >
                                <Pencil className="w-4 h-4 mr-2" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
