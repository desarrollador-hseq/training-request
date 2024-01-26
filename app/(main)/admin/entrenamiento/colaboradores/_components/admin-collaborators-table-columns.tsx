"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Collaborator,
  Course,
  CourseLevel,
  TrainingRequestCollaborator,
} from "@prisma/client";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrainingCollaboratorWithCourseLevel
  extends TrainingRequestCollaborator {
  courseLevel:
    | (CourseLevel & { course: Course | null | undefined })
    | null
    | undefined;
  collaborator: Collaborator | null | undefined;
}

export const columnsAdminCollaboratorTable: ColumnDef<TrainingCollaboratorWithCourseLevel>[] =
  [
    {
      accessorKey: "fullname",
      accessorFn: (value) => value.collaborator?.fullname,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-secondary/30 hover:text-secondary-foreground"
          >
            Nombre completo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.original?.collaborator?.fullname;
        return <div className="capitalize">{name}</div>;
      },
    },
    {
      accessorKey: "docType",
      enableColumnFilter: false,
      header: "Tipo doc.",
      cell: ({ row }) => {
        const name = row.original?.collaborator?.docType;
        return <div className="capitalize">{name}</div>;
      },
    },
    {
      accessorKey: "numDoc",
      accessorFn: (value) => value.collaborator?.numDoc,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-secondary/30 hover:text-secondary-foreground"
          >
            Documento
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.original?.collaborator?.numDoc;
        return <div className="capitalize">{name}</div>;
      },
    },
    {
      accessorKey: "companyNit",
      accessorFn: (value) => value.collaborator?.company?.nit,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-secondary/30 hover:text-secondary-foreground"
          >
            NIT
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.original?.collaborator?.company.nit;
        return <div className="capitalize">{name}</div>;
      },
    },
    {
      accessorKey: "courseName",
      accessorFn: (value) => value.courseLevel?.course?.name,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-secondary/30 hover:text-secondary-foreground"
          >
            Curso
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.original.courseLevel?.course?.name;
        return <div className="capitalize">{name}</div>;
      },
    },
    {
      accessorKey: "courseLevelName",
      accessorFn: (value) => value.courseLevel?.name,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-secondary/30 hover:text-secondary-foreground"
          >
            Nivel
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.original.courseLevel?.name;
        return <div className="capitalize">{name}</div>;
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-secondary/30 hover:text-secondary-foreground"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.original?.collaborator?.email;
        return <div className="capitalize">{name}</div>;
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-secondary/30 hover:text-secondary-foreground"
          >
            Teléfono
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.original?.collaborator?.phone;
        return <div className="capitalize">{name}</div>;
      },
    },
  ];
