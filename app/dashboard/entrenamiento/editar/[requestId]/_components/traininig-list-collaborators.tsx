"use client";
import { Collaborator, CourseLevel } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCaption,
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
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface TrainingListCollaboratorsProps {
  collaborators: Collaborator & { courseLevel?: CourseLevel | null }[];
  trainingRequestId: string
}

export const TrainingListCollaborators = ({
  collaborators,
  trainingRequestId,
}: TrainingListCollaboratorsProps) => {
    const router = useRouter();
  const handleRemove = async (id: string) => {
    try {
      const { data } = await axios.delete(`/api/training-requests/${trainingRequestId}/members/${id}`);
      toast.success("Colaborador removido de la solicitud");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    }
  };

  return (
    <Table>
      {/* <TableCaption>A list </TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="">Nombre completo</TableHead>
          <TableHead>N° Documento</TableHead>
          <TableHead>Correo electrónico</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Nivel</TableHead>
          <TableHead className="text-right">Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {collaborators?.map((collaborator) => (
          <TableRow key={collaborator.id} className="font-semibold">
            <TableCell>{collaborator.fullname}</TableCell>
            <TableCell>{collaborator.numDoc}</TableCell>
            <TableCell>{collaborator.email}</TableCell>
            <TableCell>{collaborator?.numDoc}</TableCell>
            <TableCell>{collaborator?.courseLevel?.name}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-4 w-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Button
                    variant="ghost"
                    onClick={() => handleRemove(collaborator.id)}
                  >
                    <DropdownMenuItem>
                      <Trash className="w-4 h-4 mr-2 text-red-500" />
                      Quitar de la lista
                    </DropdownMenuItem>
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="w-full">
        <TableRow className="w-full">
          <TableCell colSpan={4}></TableCell>
          <TableCell className="text-right">
            Total colaboradores:{" "}
            <span className="font-bold"> {collaborators.length}</span>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
