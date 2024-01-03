
import { redirect } from "next/navigation";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { AddCollaboratorForm } from "../_components/add-collaborator-form";
import { DeactivateCollaborator } from "./_components/deactivate-collaborator";


const EditCollaborator = async ({
  params,
}: {
  params: { collaboratorId: string };
}) => {
  const { collaboratorId } = params;

  const collaborator = await db.collaborator.findUnique({
    where: {
      id: collaboratorId,
      active: true,
    },
  });

  if (!collaborator) {
    return redirect("/dashboard/entrenamiento/colaboradores");
  }

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div className="w-full flex justify-between items-center">
          <div>
            <TitleOnPage text={`Editar Colaborador`} />
            <span className="text-slte-300">
              Lorem ipsum dolor sit amet consectetur.
            </span>
          </div>
          <DeactivateCollaborator collaborator={collaborator} />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Card>
          <CardContent className="min-h-screen">
            <div className="p-0 overflow-hidden rounded-md">
              {collaborator && (
                <AddCollaboratorForm collaborator={collaborator} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditCollaborator;
