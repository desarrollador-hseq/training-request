"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { Collaborator, Company, Course, TrainingRequest } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stateEsp = {
  PENDING: { text: "No enviada", icon: "🕒" },
  ACTIVE: { text: "Activa", icon: "✅" },
  EXECUTED: { text: "Ejecutada", icon: "✔️" },
  PROGRAMMED: { text: "Programada", icon: "📅" },
  CANCELLED: { text: "Cancelada", icon: "❌" },
};

export const adminRequestTablecolumns: ColumnDef<
  TrainingRequest & { course?: Course | null; company: Company | null; collaborators?: Collaborator[] | null }
>[] = [
  {
    accessorKey: "companyId",
    accessorFn: (value) => `${value?.company?.businessName}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Empresa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const company = row.original.company;
      return <div className="capitalize font-bold">{company?.businessName}</div>;
    },
  },
  {
    accessorKey: "courseId",
    accessorFn: value => value.course?.name,
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
    cell: ({ row }) => {
      const course = row.original.course;
      return <div className="capitalize">{course?.name}</div>;
    },
  },
  {
    accessorKey: "state",
    accessorFn: value => value.state,
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
      const numCol = row.original.collaborators?.length;

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
