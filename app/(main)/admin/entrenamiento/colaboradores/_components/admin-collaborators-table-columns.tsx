"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Certificate,
  Collaborator,
  Company,
  Course,
  CourseLevel,
  TrainingRequestCollaborator,
} from "@prisma/client";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrainingRequestCollaboratorWithCourseLevel
  extends TrainingRequestCollaborator {
  courseLevel?: {
    name?: string | null;
    course?: {
      shortName?: string | null;
    } | null;
  } | null;

  collaborator:
    | (Collaborator & {
        certificates?: CertificateWithCourseLevel[] | null;
        company?: {
          nit?: string | null;
        } | null;
      })
    | null
    | undefined;
}

interface CertificateWithCourseLevel extends Certificate {
  courseLevel?:
    | (CourseLevel & {
        course:
          | {
              name?: string | null | undefined;
            }
          | null
          | undefined;
      })
    | null;
}

export const columnsAdminCollaboratorTable: ColumnDef<TrainingRequestCollaboratorWithCourseLevel>[] =
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
        return <div className="max-w-[200px] truncate">{name}</div>;
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
        const name = row.original?.collaborator?.company?.nit;
        return <div className="capitalize">{name}</div>;
      },
    },
    {
      accessorKey: "courseName",
      accessorFn: (value) => value.courseLevel?.course?.shortName,
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
        const name = row.original.courseLevel?.course?.shortName;
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
    // {
    //   accessorKey: "email",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         className="hover:bg-secondary/30 hover:text-secondary-foreground"
    //       >
    //         Email
    //         <ArrowUpDown className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     const name = row.original?.collaborator?.email;
    //     return <div className="lowercase">{name}</div>;
    //   },
    // },
    // {
    //   accessorKey: "phone",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         className="hover:bg-secondary/30 hover:text-secondary-foreground"
    //       >
    //         Teléfono
    //         <ArrowUpDown className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     const name = row.original?.collaborator?.phone;
    //     return <div className="capitalize">{name}</div>;
    //   },
    // },
  ];
