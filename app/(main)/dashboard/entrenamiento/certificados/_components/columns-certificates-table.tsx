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
  courseLevel: { monthsToExpire: number | undefined | null };
}

export const columnCertificatesTable: ColumnDef<CertificateWithCollaborator>[] =
  [
    {
      accessorKey: "fullname",
      accessorFn: (value) => value.collaboratorFullname,
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
        const name = row.original?.collaboratorFullname;
        return <div className="capitalize">{name}</div>;
      },
    },
    {
      accessorKey: "numDoc",
      accessorFn: (value) => value.collaboratorNumDoc,
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
        const name = row.original?.collaboratorNumDoc;
        return <div className="capitalize">{name}</div>;
      },
    },
    {
      accessorKey: "companyName",
      accessorFn: (value) => value.companyName,
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
        const name = row.original?.companyName;
        return <div className="capitalize">{name}</div>;
      },
    },
    {
      accessorKey: "companyNit",
      accessorFn: (value) => value.companyNit,
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
        const nit = row.original?.companyNit;
        return <div className="capitalize">{nit}</div>;
      },
    },
    {
      accessorKey: "courseName",
      accessorFn: (value) => value.courseName,
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
        const name = row.original?.courseName;
        return <div className="capitalize">{name}</div>;
      },
    },
    {
      accessorKey: "courseLevelName",
      accessorFn: (value) => value.levelName,
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
        const name = row.original?.levelName;
        return <div className="capitalize">{name}</div>;
      },
    },
    // {
    //   accessorKey: "fileUrl",
    //   accessorFn: (value) => value.fileUrl,
    //   enableColumnFilter: false,
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
    //       >
    //         Link
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     const name = row.original?.fileUrl;
    //     return <div className="capitalize">{name}</div>;
    //   },
    // },
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
