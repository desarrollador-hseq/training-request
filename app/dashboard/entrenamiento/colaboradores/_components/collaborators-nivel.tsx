"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronDownSquare, ChevronUpSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { CollapsibleContentTable } from "@/components/collapsible-content-table";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTablePagination } from "@/components/datatable-pagination";
import { Collaborator, CourseLevel } from "@prisma/client";
import axios from "axios";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setCollaboratorsSelected: Dispatch<
    SetStateAction<Collaborator[] | null | undefined>
  >;
  collaboratorsSelected: Collaborator[] | null | undefined;
  allLevelsByCourse?: CourseLevel[] | null | undefined;

  rowSelection?: {
    onRowSelectionChange: (data: TData[]) => void;
  };
}

export function CollaboratorsTable<TData, TValue>({
  data: initialData,
  columns,
  collaboratorsSelected,
  setCollaboratorsSelected,
  allLevelsByCourse,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [idOpenCollapsible, setIdOpenCollapsible] = useState("");
  const [data, setData] = useState(initialData);
  const [levelsCourse, setLevelCourses] = useState();
  const [collaboratorsSelectedTable, setCollaboratorsSelectedTable] =
    useState();
  const [selectedRows, setSelectedRows] = useState<any>([]);
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
    getRowId: (row) => row.id,
    meta: {
      updateData: (rowIndex: any, columnId: any, value: any) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value,
                }
              : row
          )
        ),
    },
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    setSelectedRows(
      table.getGroupedSelectedRowModel().rows.map((ma) => ma.original)
    );

   
  }, [table.getGroupedSelectedRowModel().rows]);

  useEffect(() => {
    setCollaboratorsSelected(table.getGroupedSelectedRowModel().rows.map((ma) => ma.original))
  }, [  table.getGroupedSelectedRowModel().rows])
  

  const initialSelection = collaboratorsSelected?.reduce(
    (acc: any, row: any) => {
      acc[row.id] = true;
      return acc;
    },
    {}
  );

  useEffect(() => {
    table.setRowSelection(initialSelection);
  }, []);

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
          placeholder="Buscar por documento"
          value={(table.getColumn("numDoc")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("numDoc")?.setFilterValue(event.target.value)
          }
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
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
              table.getRowModel().rows.map((row) => (
                <Collapsible
                  key={row.id}
                  asChild
                  open={idOpenCollapsible === row.id}
                >
                  <>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        idOpenCollapsible === row.id &&
                          "bg-slate-100 border-b-0 hover:bg-slate-100"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                      {/*------- collapsible trigger -------*/}
                      <CollapsibleTrigger
                        onClick={() => handleCollapsible(row.id)}
                        asChild
                      >
                        <td className="flex justify-center items-center">
                          <Button variant="ghost">
                            {idOpenCollapsible !== row.id ? (
                              <ChevronDownSquare />
                            ) : (
                              <ChevronUpSquare />
                            )}
                          </Button>
                        </td>
                      </CollapsibleTrigger>
                    </TableRow>

                    {/* {
                      row.original.certificate
                    } */}
                    <CollapsibleContentTable
                      colSpan={5}
                      openCollapsible={idOpenCollapsible === row.id}
                    >
                      <div>
                        <Card className="bg-slate-200">
                          <CardHeader>
                            <h3>Datos de formacion</h3>
                          </CardHeader>
                          <CardContent>item</CardContent>
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
