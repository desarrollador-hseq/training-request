import { redirect } from "next/navigation";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";

import { DeactivateCollaborator } from "./_components/deactivate-collaborator";
import { TabsEditCollaborator } from "./_components/tabs-edit-collaborator";

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
        <TabsEditCollaborator collaborator={collaborator} />
      </div>
    </div>
  );
};

export default EditCollaborator;
