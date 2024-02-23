"use client";

import {
  Collaborator,
  CourseLevel,
  TrainingRequestCollaborator,
} from "@prisma/client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";

interface Collaboratorss extends TrainingRequestCollaborator {
  collaborator:
    | (Collaborator & {
        trainingRequestsCollaborators:
          | TrainingRequestCollaborator[]
          | null
          | undefined;
      })
    | null
    | undefined;
  courseLevel: CourseLevel | null | undefined;
}

interface CollaboratorsSimpleTableProps {
  collaborators: Collaboratorss[] | null | undefined;
}

export const CollaboratorListTable = ({
  collaborators,
}: CollaboratorsSimpleTableProps) => {
  return (
    <Table className={cn("bg-blue-100 w-full")}>
      <TableHeader className="w-full">
        <TableRow className="bg-slate-600 hover:bg-slate-600">
          <TableHead className="text-white">Nombre completo</TableHead>
          <TableHead className="text-white">N° Documento</TableHead>
          <TableHead className="text-white">Correo electrónico</TableHead>
          <TableHead className="text-white">Teléfono</TableHead>
          <TableHead className="text-white">Nivel</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="relative">
        {collaborators?.map(({ collaborator, courseLevel }: any, index) => (
          <TableRow
            // className={cn("font-semibold", !isPending && "opacity-60")}
            className={cn(
              "font-semibold",
              collaborators[index].isDisallowed &&
                "bg-red-700 hover:bg-red-800 text-white z-40"
            )}
            key={collaborator.id + courseLevel?.id}
          >
            <TableCell>{collaborator.fullname}</TableCell>
            <TableCell>{collaborator.numDoc}</TableCell>
            <TableCell>{collaborator.email}</TableCell>
            <TableCell>{collaborator.phone}</TableCell>

            <TableCell>{courseLevel?.name}</TableCell>
            {/* agregar Documentos de colaborador a solicitud */}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="w-full">
        <TableRow className="w-full">
          <TableCell colSpan={4} className="bg-blue-400/20"></TableCell>
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
