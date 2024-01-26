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

interface CertificateWithCollaborator extends Certificate {
  collaborator:
    | (Collaborator & { company: Company | undefined | null })
    | null
    | undefined;
  courseLevel:
    | (CourseLevel & { course: Course | undefined | null })
    | null
    | undefined;
}

export const columnsAdminCertificatesTable: ColumnDef<CertificateWithCollaborator>[] = [
  {
    accessorKey: "fullname",
    accessorFn: (value) => value.collaborator?.fullname,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Colaborador
          <ArrowUpDown className="ml-2 h-3 w-3" />
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
    accessorFn: (value) => value.collaborator?.numDoc,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          # Documento
          <ArrowUpDown className="ml-2 h-3 w-3" />
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
    accessorFn: (value) => value.collaborator?.company?.businessName,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Empresa
          <ArrowUpDown className="ml-2 h-3 w-3" />
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
    accessorFn: (value) => value.collaborator?.company?.nit,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          NIT
          <ArrowUpDown className="ml-2 h-3 w-3" />
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
    accessorFn: (value) => value.courseLevel?.course?.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Nombre del curso
          <ArrowUpDown className="ml-2 h-3 w-3" />
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
    accessorFn: (value) => value.courseLevel?.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Nivel de curso
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original?.courseLevel?.name;
      return <div className="capitalize">{name}</div>;
    },
  },
  {
    accessorKey: "fileUrl",
    accessorFn: (value) => value.fileUrl,
    enableColumnFilter: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Link
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original?.fileUrl;
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
  //           <ArrowUpDown className="ml-2 h-3 w-3" />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => (
  //       <div className="capitalize text-center text-sm">{row.getValue("date")}</div>
  //     ),
  //   },
];
