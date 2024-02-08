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
  Ban,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  ChevronDownSquare,
  ChevronUpSquare,
  GraduationCap,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { DataTablePagination } from "@/components/datatable-pagination";
import TableColumnFiltering from "@/components/table-column-filtering";
import { AdminCollaboratorTableCollapsibleContent } from "./admin-collaborator-table-collapsible-content";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] &
    {
      wasCertified: boolean | undefined;
      isDisallowed: boolean | undefined;
      isScheduled: boolean | undefined;
      trainingRequestId: string | undefined;
    }[];
}

export function AdminCollaboratorsCertificateTable<TData, TValue>({
  data: initialData,
  columns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [idOpenCollapsible, setIdOpenCollapsible] = useState("");
  const [data, setData] = useState(initialData);
  const [filtering, setFiltering] = useState("");

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
    getRowId: (row: any) => row.id,
    onGlobalFilterChange: setFiltering,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: filtering,
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
          placeholder="Buscar en todas las columnas"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border border-input overflow-hidden">
        <Table className="">
          <TableHeader className="bg-primary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-primary hover:bg-primary"
              >
                <TableHead />
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-2 text-secondary-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getCanFilter() ? (
                      <div className=" flex flex-col justify-around">
                        <TableColumnFiltering
                          column={header.column}
                          table={table}
                        />
                      </div>
                    ) : (
                      <div className="h-6"></div>
                    )}
                  </TableHead>
                ))}

                <TableHead />
                <TableHead />
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <Collapsible
                  key={row.id + index}
                  asChild
                  open={idOpenCollapsible === row.id}
                >
                  <>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className={`text-sm ${
                        idOpenCollapsible === row.id && "bg-blue-100 font-bold"
                      }`}
                    >
                      <TableCell className="max-w-[60px] flex">
                        {initialData[index]?.wasCertified! &&
                          initialData[index]?.isScheduled! && (
                            <GraduationCap className="w-4 h-4" />
                          )}
                        {initialData[index]?.isScheduled! &&
                          !initialData[index]?.wasCertified! && (
                            <CalendarClock className="w-4 h-4" />
                          )}
                        {initialData[index]?.isDisallowed! && (
                          <Ban className="w-4 h-4" />
                        )}
                      </TableCell>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="p-2">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-4 w-8 p-0">
                              <span className="sr-only">abrir menu</span>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="flex flex-col"
                          >
                            <DropdownMenuItem
                              asChild
                              className="cursor-pointer"
                            >
                              <Link
                                className="flex justify-center"
                                href={`/admin/entrenamiento/certificados/generar/${row.original.collaborator.id}/${initialData[index].trainingRequestId}`}
                              >
                                <CalendarDays className="w-4 h-4 mr-2" />
                                Certificar
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>

                      {/*------- collapsible trigger -------*/}
                      {row.original.collaborator.certificates.length > 0 && (
                        <CollapsibleTrigger
                          onClick={() => handleCollapsible(row.id)}
                          asChild
                        >
                          <td className="h-full p-1">
                            <Button variant="ghost">
                              {idOpenCollapsible !== row.id ? (
                                <ChevronDownSquare />
                              ) : (
                                <ChevronUpSquare />
                              )}
                            </Button>
                          </td>
                        </CollapsibleTrigger>
                      )}
                    </TableRow>
                    <AdminCollaboratorTableCollapsibleContent
                      collaborator={row.original.collaborator}
                      openCollapsible={!!idOpenCollapsible}
                      certificates={row.original.collaborator.certificates}
                    />
                  </>
                </Collapsible>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 2}
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
