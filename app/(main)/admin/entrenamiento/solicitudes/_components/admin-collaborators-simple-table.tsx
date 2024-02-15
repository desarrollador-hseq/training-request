"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Collaborator,
  CourseLevel,
  TrainingRequestCollaborator,
} from "@prisma/client";
import { CalendarClock, MoreHorizontal, Trash } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/components/providers/loading-provider";
import { cn } from "@/lib/utils";


interface CollaboratorsSimpleTableProps {
  collaborators:
    | (TrainingRequestCollaborator &
        {
          collaborators: { collaborator: Collaborator | null | undefined }[];
        }[])
    | null
    | undefined;
  trainingRequestId: string;
  courseId: string | null;
  isPending: boolean;
}

export const AdminCollaboratorsSimpleTable = ({
  collaborators,
  trainingRequestId,
  courseId,
  isPending,
}: CollaboratorsSimpleTableProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const [coursesLevel, setCoursesLevel] = useState<CourseLevel[]>([]);

  useEffect(() => {
    setLoadingApp(true);
    const getCourseLevels = async () => {
      try {
        const { data } = await axios.get<CourseLevel[]>(
          `/api/courses/${courseId}/course-levels`
        );
        setCoursesLevel(data);
      } catch (error) {
        console.log({ "get error": error });
      } finally {
        setLoadingApp(false);
      }
    };
    getCourseLevels();
  }, []);

  const onChange = async (courseLevelId: any, id: string) => {
    if (isPending) {
      setLoadingApp(true);
      try {
        const { data } = await axios.patch(
          `/api/training-requests/${trainingRequestId}/members/${id}`,
          { courseLevelId }
        );
        toast.success("Colaborador actualizado");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Ocurrió un error inesperado");
      } finally {
        setLoadingApp(false);
      }
    }
  };

  return (
    <Table className={cn("bg-blue-100", !isPending && "opacity-70")}>
      <TableHeader>
        <TableRow className="bg-slate-600 hover:bg-slate-600">
          <TableHead className="text-white">Nombre completo</TableHead>
          <TableHead className="text-white">N° Documento</TableHead>
          <TableHead className="text-white">Correo electrónico</TableHead>
          <TableHead className="text-white">Teléfono</TableHead>
          <TableHead className="text-white">Nivel</TableHead>
          {isPending && (
            <TableHead className="text-right text-white">Acción</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {collaborators?.map(({ collaborator, courseLevel }: any) => (
          <TableRow
            key={collaborator.id}
            className={cn("font-semibold", !isPending && "opacity-60")}
          >
            <TableCell>{collaborator.fullname}</TableCell>
            <TableCell>{collaborator.numDoc}</TableCell>
            <TableCell>{collaborator.email}</TableCell>
            <TableCell>{collaborator.phone}</TableCell>
            <TableCell>{courseLevel.name}</TableCell>

            {isPending && (
              <TableCell className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-4 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="hover:bg-slate-100"
                  >
                    <Link
                      href={`/admin/entrenamiento/solicitudes/${trainingRequestId}/colaborador/${collaborator.id}`}
                      className="hover:bg-slate-300 flex"
                    >
                      <Button className="">
                        <CalendarClock className="w-4 h-4 mr-2 " />
                        Programar
                      </Button>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="w-full">
        <TableRow className="w-full">
          <TableCell
            colSpan={isPending ? 5 : 4}
            className="bg-blue-400/20"
          ></TableCell>
          <TableCell className="text-right bg-blue-400/20">
            Total colaboradores:{" "}
            <span className="font-bold max-h-[5px]">
              {" "}
              {collaborators?.length}
            </span>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
