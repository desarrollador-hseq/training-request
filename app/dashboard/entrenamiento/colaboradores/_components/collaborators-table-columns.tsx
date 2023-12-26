"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Collaborator } from "@prisma/client";
import { CollaboratorCourseLevel } from "./collaborators-courselevel";



export const columnsCollaboratorTable: ColumnDef<Collaborator>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Seleccionar todo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullname",
    header: "Nombre completo",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("fullname")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "numDoc",
    header: () => <div className="">N° Documento</div>,
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("numDoc")}</div>
    ),
  },
  // {
  //   id: "courseLevel",
  //   accessorKey: "courseLevel",
  //   header: () => <div className="">Nivel de curso</div>,
  //   cell: ({ column, row , table}) => {

  //     const courseId = row.original.courseId;

  //     return <CollaboratorCourseLevel courseId={courseId} column={column} row={row} table={table} />;
  //   },
  //   accessorFn: (value) => value.courseLevel.name,
  // },
  
];
