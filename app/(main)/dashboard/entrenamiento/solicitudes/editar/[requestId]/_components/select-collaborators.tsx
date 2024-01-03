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

interface SelectCollaboratorsProps {
  // courseLevels: CourseLevel[];
  collaborators: Collaborator[];
  collaboratorSelected: Collaborator[];
  trainingRequestId: string;
  isPending: boolean;
}

export const SelectCollaborators = ({
  collaborators,
  collaboratorSelected,
  trainingRequestId,
  isPending,
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
      {isPending && (
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetTrigger asChild>
            <Button variant="primary">Agregar</Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Seleccionar los colaboradores</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
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
            <SheetFooter>
              <SheetClose onClick={() => handleLevelSelected(null)} asChild>
                <Button onClick={handleUpdateCollaborators} type="submit">
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
