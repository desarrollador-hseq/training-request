"use client";

import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  AlertCircle,
  ChevronDownSquare,
  ChevronUpSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContentTable } from "@/components/collapsible-content-table";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTablePagination } from "@/components/datatable-pagination";
import { SubtitleSeparator } from "@/components/subtitle-separator";
import { CollaboratorListTable } from "./collaborator-list-table";
import { TooltipInfo } from "@/components/tooltip-info";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function RequestsTable<TData, TValue>({
  data,
  columns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [idOpenCollapsible, setIdOpenCollapsible] = useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleCollapsible = (idOpen: string) => {
    if (idOpenCollapsible === idOpen) {
      setIdOpenCollapsible("");
    } else {
      setIdOpenCollapsible(idOpen);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar por tipo"
          value={
            (table.getColumn("courseId")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("courseId")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <Collapsible
                  key={row.id}
                  asChild
                  open={idOpenCollapsible === row.id}
                >
                  <>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        "relative",
                        idOpenCollapsible === row.id &&
                          "bg-slate-200 border-b-0 hover:bg-slate-200 "
                      )}
                    >
                      {row.getVisibleCells().map((cell: any) => (
                        <TableCell key={cell.id} className="relative">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}

                      {row.original.collaborators.length > 0 && (
                        <CollapsibleTrigger
                          onClick={() => handleCollapsible(row.id)}
                          asChild
                          className="max-h-max flex items-center my-auto"
                        >
                          <TableCell className="flex justify-end">
                            <Button
                              variant="ghost"
                              className="h-full my-auto text-slate-500"
                            >
                              {idOpenCollapsible !== row.id ? (
                                <ChevronDownSquare />
                              ) : (
                                <ChevronUpSquare />
                              )}
                            </Button>
                          </TableCell>
                        </CollapsibleTrigger>
                      )}

                      {/* Verificar si algún colaborador está inhabilitado */}
                      {row.original.collaborators.some(
                        (collaborator: any) => collaborator.isDisallowed
                      ) && (
                        <TableCell className="absolute w-5 h-full top-0 m-0 right-1 rounded-ful flex items-center justify-start">
                          <span className="w-4 absolute bg-red-500 h-4 rounded-full flex items-center">
                            {" "}
                            <TooltipInfo text="Se ha encontrado un colaborador inhabilitado en la solicitud">
                              <AlertCircle className="w-4 h-4 text-white" />
                            </TooltipInfo>
                          </span>
                        </TableCell>
                      )}
                    </TableRow>
                    <CollapsibleContentTable
                      colSpan={7}
                      openCollapsible={idOpenCollapsible === row.id}
                    >
                      <div className="bg-slate-200">
                        <Card className="bg-slate-100 overflow-hidden rounded-b-lg">
                          <CardHeader className="p-0 h-8">
                            <SubtitleSeparator
                              text="Datos de Colaboradores incritos "
                              className="bg-secondary"
                            />
                          </CardHeader>
                          <CardContent className="bg-slate-200 p-0">
                            {row.original?.collaborators && (
                              <CollaboratorListTable
                                collaborators={row.original?.collaborators}
                              />
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </CollapsibleContentTable>
                  </>
                </Collapsible>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-1 py-2"></div>
      <DataTablePagination table={table} />
    </div>
  );
}
