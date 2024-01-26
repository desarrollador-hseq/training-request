"use client";


import { ColumnDef } from "@tanstack/react-table";
import { Course, CourseLevel } from "@prisma/client";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CourseWithCourseLevel extends Course {
  courseLevels: CourseLevel[] | null | undefined;
}

export const columnsAdminCoursesTable: ColumnDef<CourseWithCourseLevel>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "shortName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Nombre corto (sms)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("shortName")}</div>,
  },
  {
    accessorKey: "numLevel",
    accessorFn: (value) => value.courseLevels?.length,
    enableColumnFilter: false,

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          # niveles
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const num = row.original?.courseLevels?.length;
      return <div className="capitalize">{num}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    enableColumnFilter: false,
    accessorFn: (value) => format(value.createdAt, "P", { locale: es }),
    maxSize: 100,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Creado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original?.createdAt;
      const nameFormated = format(name, "P", { locale: es });
      return <div className="capitalize">{nameFormated}</div>;
    },
  },
];
