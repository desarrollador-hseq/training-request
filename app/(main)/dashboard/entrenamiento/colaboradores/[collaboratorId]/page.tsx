import { redirect } from "next/navigation";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";

import { DeactivateCollaborator } from "./_components/deactivate-collaborator";
import { AddCollaboratorForm } from "../_components/add-collaborator-form";

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
      <div className="w-full flex justify-between items-center">
        <div className="w-full flex justify-between items-center">
          <div>
            <TitleOnPage text={`Editar Colaborador`} />
            <span className="text-slte-300"></span>
          </div>
          <DeactivateCollaborator collaborator={collaborator} />
        </div>
      </div>
      <div className="w-full flex flex-col gap-3">
        <AddCollaboratorForm collaborator={collaborator} />
      </div>
    </div>
  );
};

export default EditCollaborator;
