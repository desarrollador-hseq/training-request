"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FileDown, Info, Loader2, UploadCloud } from "lucide-react";
import { TitleOnPage } from "@/components/title-on-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SheetCollaboratorsLoadError } from "./_components/sheet-collaborators-load-error";
import { CollaboratorsExcelTable } from "./_components/collaborators-table";
import { TooltipInfo } from "@/components/tooltip-info";
import { useLoading } from "@/components/providers/loading-provider";

const bcrumbs = [
  { label: "Colaboradores", path: "/dashboard/entrenamiento/colaboradores" },
  { label: "Cargar", path: "/cargar" },
];
const UploadCollaboratorsExcel = () => {
  const [usersLoaded, setUsersLoaded] = useState<unknown[]>([]);
  const [listError, setListError] = useState([]);
  const [wasError, setWasError] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const { setLoadingApp } = useLoading();


  const onClick = async () => {
    setisSubmitting(true);
    setLoadingApp(true)
    const values = usersLoaded;
    try {
      const { data } = await axios.post(
        `/api/collaborators/upload-list`,
        values
      );

      console.log({valuesdata: data})

      if (data.failedInserts) {
        setListError(data.failedInserts);
        setWasError(true);
      }

      if (data.successfulInserts.length >= 1) {
        toast.success(
          `Se han añadido: ${data.successfulInserts.length} empleados correctamente. (${data.successfulInserts.length}/${usersLoaded.length})`,
        );
      }
    } catch (error) {
      console.log({ iserror: error });
    } finally {
      setisSubmitting(false);
      setLoadingApp(false)
    }
  };

  const handleDownloadTemplate = () => {
    // URL de la plantilla en el servidor
    const templateUrl = "/plantilla_colaboradores.xlsx";

    // Crear un elemento 'a' para iniciar la descarga
    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = "plantilla_colaboradores.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="">
      <TitleOnPage
        text="Cargar colaboradores desde un archivo"
        bcrumb={bcrumbs}
      >
        <div className="flex items-center gap-2">
          <Button onClick={handleDownloadTemplate} className="gap-2">
            <FileDown />
            Plantilla de excel
          </Button>
          <TooltipInfo text="Se debe descargar y llenar esta plantilla para cargar los colaboradores de la empresa">
            <Info className="text-white w-6 h-6" />
          </TooltipInfo>
        </div>
      </TitleOnPage>

      <Card>
        <CardHeader></CardHeader>
        <CardContent className="min-h-fit">
          <div className="p-0 overflow-hidden rounded-md">
            {isSubmitting ? (
              <div className="w-full h-fit flex justify-center items-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="w-full">
                <div className="w-full flex justify-end items-center my-3">
                  <Button
                    variant="secondary"
                    disabled={usersLoaded.length == 0}
                    onClick={onClick}
                    className="gap-2"
                  >
                    <UploadCloud /> Cargar
                  </Button>
                </div>

                <CollaboratorsExcelTable
                  setUsersLoaded={setUsersLoaded}
                  usersLoaded={usersLoaded}
                />

                {/* <AddEmployee /> */}

                {listError.length > 0 && (
                  <SheetCollaboratorsLoadError
                    failedInserts={listError}
                    wasError={wasError}
                    setWasError={setWasError}
                  />
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadCollaboratorsExcel;
