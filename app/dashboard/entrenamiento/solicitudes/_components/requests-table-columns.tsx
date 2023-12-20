"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { Collaborator, Course, TrainingRequest } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stateEsp = {
  PENDING: { text: "Pendiente", icon: "🕒" },
  ACTIVE: { text: "Activo", icon: "✅" },
  EXECUTED: { text: "Ejecutado", icon: "✔️" },
  PROGRAMMED: { text: "Programado", icon: "📅" },
  CANCELLED: { text: "Cancelado", icon: "❌" },
  // Agrega más estados según sea necesario
};

export const columnsRequestTable: ColumnDef<
  TrainingRequest & { course?: Course | null; members?: Collaborator[] | null }
>[] = [
  {
    accessorKey: "courseId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo den entrenamiento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (value) => `${value?.course?.name}`,
    cell: ({ row }) => {
      const course = row.original.course;
      return <div className="capitalize">{course?.name}</div>;
    },
  },
  {
    accessorKey: "state",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const state = row.original.state;
      const stateTr = stateEsp[state] || state;

      return (
        <div>
          {stateTr.icon} {stateTr.text}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha de Creación
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {format(new Date(row.original.createdAt), "dd LLLL y", { locale: es })}
      </div>
    ),
  },
  {
    id: "numCollaborators",
    header: "# Colaboradores",
    cell: ({ row }) => {
      const numCol = row.original.members?.length;

      return <span className="font-semibold">{numCol}</span>
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <Link
          href={`/dashboard/entrenamiento/solicitudes/editar/${id}`}
        >
          <Button variant="default">
            <Pencil className="w-5 h-5" />
          </Button>
        </Link>
      );
    },
  },
  
];
