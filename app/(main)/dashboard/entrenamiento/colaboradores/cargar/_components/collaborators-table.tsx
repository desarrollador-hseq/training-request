"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import { Cloud, X } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const CollaboratorsExcelTable = ({
  setUsersLoaded,
  usersLoaded,
}: {
  setUsersLoaded: Dispatch<SetStateAction<unknown[]>>;
  usersLoaded: unknown[];
}) => {
  let parsedData: unknown[] = [];
  const [file, setFile] = useState<File | null>();

  const { getRootProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
    accept: { "application/vnd.ms-excel": [".xlsx", ".xls"] },
  });

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      parsedData = XLSX.utils.sheet_to_json(sheet);

      const filteredData = (
        XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[]
      ).filter((row: Record<string, unknown>, index) => {
        if (index === 0) return;
        return Object.values(row).some(
          (cell) => cell !== null || cell !== undefined || cell !== ""
        );
      });

      try {
        setUsersLoaded(
          filteredData.map((row: Record<string, unknown>) => ({
            fullname: (row["Nombre completo"] as string).trim(),
            docType: (row["Tipo de documento"] as string).trim(),
            numDoc: ("" + row["# Documento"]).replace(/[.,]/g, "").trim(),
            email: (row["Correo Electrónico"] as string).trim(),
            phone: ("" + row["Teléfono móvil"]).trim(),
          }))
        );
      } catch (error) {
        setFile(null);
        setUsersLoaded([]);
        toast.error(
          "Hubo un error al cargar los colaboradores por favor verifica el archivo seleccionado"
        );
      }
    };
  }, [file]);

  const handleFilterList = (indexToRemove: number) => {
    setUsersLoaded((prevUsersLoaded) =>
    prevUsersLoaded.filter((_, index) => index !== indexToRemove)
  );
  };

  return (
    <div className="overflow-y-auto bg-white ">
      <div
        {...getRootProps()}
        className={`dropzone w-full flex justify-center mb-5 p-5 
        ${file ? "bg-emerald-800/80" : "bg-emerald-700/80"} 
        ${!file && "border-4 border-dashed border-emerald-700"}
        
        `}
        style={{
          borderRadius: "7px",
          color: "white",
        }}
      >
        <div className="min-h-[100px] max-w-max flex flex-col gap-3 items-center justify-center">
          {file ? (
            <div className="flex max-w-max  bg-emerald-600 items-center justify-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200 p-4">
              <div className="px-3 py-2 h-full grid place-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 32 32"
                >
                  <defs>
                    <linearGradient
                      id="IconifyId18d8a3c62096c18070"
                      x1="4.494"
                      x2="13.832"
                      y1="-2092.086"
                      y2="-2075.914"
                      gradientTransform="translate(0 2100)"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#18884f" />
                      <stop offset=".5" stopColor="#117e43" />
                      <stop offset="1" stopColor="#0b6631" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="#185c37"
                    d="M19.581 15.35L8.512 13.4v14.409A1.192 1.192 0 0 0 9.705 29h19.1A1.192 1.192 0 0 0 30 27.809V22.5Z"
                  />
                  <path
                    fill="#21a366"
                    d="M19.581 3H9.705a1.192 1.192 0 0 0-1.193 1.191V9.5L19.581 16l5.861 1.95L30 16V9.5Z"
                  />
                  <path fill="#107c41" d="M8.512 9.5h11.069V16H8.512Z" />
                  <path
                    d="M16.434 8.2H8.512v16.25h7.922a1.2 1.2 0 0 0 1.194-1.191V9.391A1.2 1.2 0 0 0 16.434 8.2"
                    opacity=".1"
                  />
                  <path
                    d="M15.783 8.85H8.512V25.1h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191"
                    opacity=".2"
                  />
                  <path
                    d="M15.783 8.85H8.512V23.8h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191"
                    opacity=".2"
                  />
                  <path
                    d="M15.132 8.85h-6.62V23.8h6.62a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191"
                    opacity=".2"
                  />
                  <path
                    fill="url(#IconifyId18d8a3c62096c18070)"
                    d="M3.194 8.85h11.938a1.193 1.193 0 0 1 1.194 1.191v11.918a1.193 1.193 0 0 1-1.194 1.191H3.194A1.192 1.192 0 0 1 2 21.959V10.041A1.192 1.192 0 0 1 3.194 8.85"
                  />
                  <path
                    fill="#fff"
                    d="m5.7 19.873l2.511-3.884l-2.3-3.862h1.847L9.013 14.6c.116.234.2.408.238.524h.017c.082-.188.169-.369.26-.546l1.342-2.447h1.7l-2.359 3.84l2.419 3.905h-1.809l-1.45-2.711A2.355 2.355 0 0 1 9.2 16.8h-.024a1.688 1.688 0 0 1-.168.351l-1.493 2.722Z"
                  />
                  <path
                    fill="#33c481"
                    d="M28.806 3h-9.225v6.5H30V4.191A1.192 1.192 0 0 0 28.806 3"
                  />
                  <path fill="#107c41" d="M19.581 16H30v6.5H19.581Z" />
                </svg>
              </div>
              <p className="px-3 py-2 h-full text-sm truncate text-white font-semibold max-w-[300px] text-ellipsis line-clamp-1">
                {file.name}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Cloud className="h-10 w-10 text-white mb-2" />
              <p className="mb-2 text-sm text-white">
                <span className="font-semibold text-base">
                  Click para subir
                </span>{" "}
                o arrastra el archivo Excel con la información de los
                colaboradores
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-auto">
        {usersLoaded.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre completo</TableHead>
                <TableHead>Tipo de documento</TableHead>
                <TableHead># Documento</TableHead>
                <TableHead>Correo Electrónico</TableHead>
                <TableHead>Teléfono móvil</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersLoaded.map((row, index) => {
                // if (index === 0) return;
                return (
                  <TableRow key={index}>
                    {Object.values(row!).map((value, index) => (
                      <TableCell key={index}>{value}</TableCell>
                    ))}
                    <TableCell key={index}>
                      <Button className="p-1 h-fit" onClick={(e) => handleFilterList(index)}>
                        <X className="w-5 h-5 " />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
