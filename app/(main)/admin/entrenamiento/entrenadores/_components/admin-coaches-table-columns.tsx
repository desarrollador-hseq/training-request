"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Coach } from "@prisma/client";
import { ArrowUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModalImage from "react-modal-image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export const columnsAdminCoachesTable: ColumnDef<Coach>[] = [
  {
    accessorKey: "fullname",
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
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("fullname")}</div>
    ),
  },
  {
    accessorKey: "position",
    maxSize: 100,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Cargo como entrenador
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("position")}</div>
    ),
  },
  {
    accessorKey: "licence",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Licencia
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-center text-sm">
        {row.getValue("licence")}
      </div>
    ),
  },
  {
    accessorKey: "imgSignatureUrl",
    header: ({ column }) => {
      return <div>Firma</div>;
    },
    enableColumnFilter: false,
    cell: ({ row }) => {
      const url = row.original.imgSignatureUrl;
      const existUrl = !!url;

      return (
        <div
          className={cn(
            "bg-slate-50 border border-slate-400",
          
          )}
        >
          {existUrl ? (
            <div style={{ }}>
              {/* <ModalImage
                small={"/eye-icon-blue.png"}
                hideDownload
                color="white"
                large={url}
              /> */}
              <Image 
               src={`${url}`}
               alt=""
               priority
               width={100}
               height={100}
               style={{width: "auto", height: "auto", maxWidth: 100, maxHeight: 100}}
              />
            </div>
          ) : (
           <X className="w-4 h-4 text-slate-300" />
          )}
        </div>
      );
    },
  },
];
