"use client";
import {
  Collaborator,
  CourseLevel,
  TrainingRequestCollaborator,
} from "@prisma/client";
import { MoreHorizontal, Trash } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  coursesLevel: CourseLevel[] | null;
  isPending: boolean;
}

export const CollaboratorsSimpleTable = ({
  collaborators,
  trainingRequestId,
  coursesLevel,
  isPending,
}: CollaboratorsSimpleTableProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();

  const handleRemove = async (id: string) => {
    setLoadingApp(true);
    try {
      const { data } = await axios.delete(
        `/api/training-requests/${trainingRequestId}/members/${id}`
      );
      toast.success("Colaborador removido de la solicitud");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoadingApp(false);
    }
  };

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
      {/* <TableCaption>A list </TableCaption> */}
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
            {/* <TableCell>{courseLevel?.name}</TableCell> */}

            <TableCell>
              <Select
                defaultValue={courseLevel ? courseLevel.id : ""}
                onValueChange={(e) => onChange(e, collaborator.id)}
                disabled={!isPending}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="🔴 Sin definir" />
                </SelectTrigger>
                <SelectContent>
                  {coursesLevel?.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>

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
                    <Button
                      variant="ghost"
                      onClick={() => handleRemove(collaborator.id)}
                      className="hover:bg-slate-300"
                    >
                      <Trash className="w-4 h-4 mr-2 text-red-500" />
                      Quitar de la lista
                    </Button>
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
