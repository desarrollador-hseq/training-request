"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Certificate,
  Collaborator,
  Company,
  Course,
  CourseLevel,
} from "@prisma/client";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TabsCertificatesProps {
  certificates: Certificate & {
    courseLevel:
      | (CourseLevel & { course: Course | undefined | null })
      | null
      | undefined;
    collaborator:
      | (Collaborator & { company: Company | undefined | null })
      | null
      | undefined;
  };
}

export const columnsAdminCertificatesTable: ColumnDef<
  Certificate & {
    courseLevel:
      | (CourseLevel & { course: Course | undefined | null })
      | null
      | undefined;
    collaborator:
      | (Collaborator & { company: Company | undefined | null })
      | null
      | undefined;
  }
>[] = [
  {
    accessorKey: "fullname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Nombre del colaborador
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
    accessorKey: "numDoc",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Documento del colaborador
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
    accessorKey: "companyName",
    maxSize: 100,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Empresa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const name = row.original?.collaborator?.company?.businessName;
        return <div className="capitalize">{name}</div>;
      },
  },
  {
    accessorKey: "companyNit",
    maxSize: 100,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          NIT empresa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const nit = row.original?.collaborator?.company?.nit;
        return <div className="capitalize">{nit}</div>;
      },
  },
  {
    accessorKey: "courseName",
    maxSize: 100,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
         Nombre del curso
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const name = row.original?.courseLevel?.course?.name;
        return <div className="capitalize">{name}</div>;
      },
  },
  {
    accessorKey: "courseLevelName",
    maxSize: 100,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Nivel de curso
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const name = row.original?.courseLevel?.name;
        return <div className="capitalize">{name}</div>;
      },
  },
  //   {
  //     accessorKey: "date",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           className="font-semibold"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           date
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => (
  //       <div className="capitalize text-center text-sm">{row.getValue("date")}</div>
  //     ),
  //   },
];
