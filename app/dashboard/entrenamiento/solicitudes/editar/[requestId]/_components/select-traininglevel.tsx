"use client";

import { useEffect, useState } from "react";
import { Collaborator, CourseLevel } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { SimpleModal } from "@/components/simple-modal";
import { Card, CardContent } from "@/components/ui/card";

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
import { CollaboratorsTable } from "@/app/dashboard/entrenamiento/colaboradores/_components/collaborators-table";
import { columnsCollaboratorTable } from "@/app/dashboard/entrenamiento/colaboradores/_components/collaborators-table-columns";


interface SelectTrainingLevel {
  courseLevels: CourseLevel[];
  collaborators: Collaborator[];
}

export const SelectTrainingLevel = ({ courseLevels, collaborators }: SelectTrainingLevel) => {
  const [levelSelected, setLevelSelected] = useState<string | null>();
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [collaboratorsSelected, setCollaboratorsSelected] = useState<Collaborator[] | null | undefined>();

  useEffect(() => {
    setOpenSheet(!!levelSelected);
  }, [levelSelected]);

  const handleLevelSelected = (level: string | null) => {
    setOpenSheet(false);
    setLevelSelected(level);
    setOpenSheet(true);
  };


  useEffect(() => {
    console.log({collaboratorsSelected})
  }, [collaboratorsSelected])
  




  return (
    <div>
      <SimpleModal textBtn="Añadir" title="Selecciona un nivel de curso">
        <div className="grid place-content-center">
          {courseLevels.map((clevel) => (
            <Button
              key={clevel.id}
              variant="ghost"
              className="min-h-[100px] max-w-[300px]  flex justify-center"
              onClick={() => handleLevelSelected(clevel.name)}
            >
              <Card className="h-full">
                <CardContent className="p-2 flex items-center h-full">
                  <p>{clevel.name}</p>
                </CardContent>
              </Card>
            </Button>
          ))}
        </div>
      </SimpleModal>

      <div className="grid grid-cols-2 gap-2">
        <Sheet open={openSheet} onOpenChange={() => handleLevelSelected(null)}>
          <SheetTrigger asChild>
            <Button variant="outline">abrir</Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
                {levelSelected}
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <CollaboratorsTable columns={columnsCollaboratorTable} data={collaborators} setCollaboratorsSelected={setCollaboratorsSelected} />
            </div>
            <SheetFooter>
              <SheetClose onClick={() => handleLevelSelected(null)} asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
