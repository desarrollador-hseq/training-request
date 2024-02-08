"use client";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Collaborator, Company, Course, TrainingRequest } from "@prisma/client";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const stateEsp = {
  PENDING: { text: "No enviada", icon: "🕒" },
  ACTIVE: { text: "Activa", icon: "✅" },
  EXECUTED: { text: "Ejecutada", icon: "✔️" },
  PROGRAMMED: { text: "Programada", icon: "📅" },
  CANCELLED: { text: "Cancelada", icon: "❌" },
};

export const adminRequestsActivesTablecolumns: ColumnDef<
  TrainingRequest & {
    course?: Course | null;
    company: Company | null;
    collaborators?: Collaborator[] | null;
  }
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
      return (
        <div className="capitalize font-bold">{company?.businessName}</div>
      );
    },
  },
  {
    accessorKey: "courseId",
    accessorFn: (value) => value.course?.name,
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
    accessorFn: (value) => value.state,
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
          Activación
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {format(new Date(row.original.activeFrom || row.original.createdAt), "dd LLLL y", { locale: es })}
      </div>
    ),
  },
  {
    id: "numCollaborators",
    header: "# Colaboradores",
    cell: ({ row }) => {
      const numCol = row.original.collaborators?.length;

      return <span className="font-semibold">{numCol}</span>;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link
              href={`/admin/entrenamiento/solicitudes/${id}`}
              className="w-full"
            >
              <Button variant="default" className="w-full flex gap-3">
                <Pencil className="w-5 h-5" />
                Editar
              </Button>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
