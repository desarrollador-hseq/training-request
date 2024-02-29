"use client";

import { useEffect, useState } from "react";
import { Collaborator } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useLoading } from "@/components/providers/loading-provider";
import { CollaboratorsSelectTable } from "../../../../colaboradores/_components/collaborators-select-table";
import { columnsCollaboratorSelectTable } from "../../../../colaboradores/_components/collaborators-select-table-columns";
import { cn } from "@/lib/utils";

interface SelectCollaboratorsProps {
  collaborators: Collaborator[];
  collaboratorSelected: Collaborator[];
  trainingRequestId: string;
  isPending: boolean;
  canManageRequests: boolean;
  canManagePermissions: boolean;
}

export const SelectCollaborators = ({
  collaborators,
  collaboratorSelected,
  trainingRequestId,
  isPending,
  canManageRequests,
  canManagePermissions,
}: SelectCollaboratorsProps) => {
  const router = useRouter();
  const [levelSelected, setLevelSelected] = useState<string | null>();
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const { setLoadingApp } = useLoading();

  const [collaboratorsSelected, setCollaboratorsSelected] = useState<
    Collaborator[] | null | undefined
  >();

  useEffect(() => {
    setOpenSheet(!!levelSelected);
  }, [levelSelected]);

  const handleLevelSelected = (level: string | null) => {
    setLevelSelected(level);
  };

  useEffect(() => {
    setCollaboratorsSelected(collaboratorSelected);
  }, [collaboratorSelected]);

  const handleUpdateCollaborators = async () => {
    setLoadingApp(true);
    try {
      const actualizar = await axios.post(
        `/api/training-requests/${trainingRequestId}/`,
        {
          collaborators: collaboratorsSelected,
        }
      );
      toast.success("actualizados correctamente");
      router.refresh();
    } catch (error) {
      console.log({ error });
      toast.error("Error al actualizar, por favor intentelo nuevamente");
    } finally {
      setLoadingApp(false);
    }
  };

  return (
    <div className="">
      {(isPending || canManagePermissions || canManageRequests) && (
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetTrigger asChild className="relative" >
            <div>
              <span className="relative flex w-fit h-fit">
                {collaboratorSelected.length === 0 && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-md bg-sky-400 opacity-75"></span>
                )}
                <span className="relative inline-flex rounded-full  bg-sky-500">
                  <Button variant="primary">Agregar</Button>
                </span>
              </span>
            </div>
          </SheetTrigger>
          <SheetContent side="top">
            <SheetHeader>
              <SheetTitle>Añadir colaboradores a la solicitud</SheetTitle>
              <SheetDescription className="text-[16px] mt-1">
                Selecciona todos los colaboradores que desees agregar a la
                solicitud. Recuerda que los colaboradores resaltados ya están
                seleccionados. Una vez que hayas completado la selección, haz
                clic en el botón de guardar.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <CollaboratorsSelectTable
                collaboratorsSelected={collaboratorsSelected}
                columns={columnsCollaboratorSelectTable}
                data={collaborators}
                setCollaboratorsSelected={setCollaboratorsSelected}
              />
            </div>
            <SheetFooter className={cn("flex justify-center items-center")}>
              <SheetClose onClick={() => handleLevelSelected(null)} asChild>
                <Button
                  className="w-[300px]"
                  onClick={handleUpdateCollaborators}
                  type="submit"
                >
                  Guardar
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};
