import { TitleOnPage } from "@/components/title-on-page";
import { Card, CardContent } from "@/components/ui/card";
import { AddCollaboratorForm } from "../_components/add-collaborator-form";

const bcrumbs = [
  { label: "Colaboradores", path: "/dashboard/entrenamiento/colaboradores" },
  { label: "Registrar", path: "/registrar" },
];


export const AddCollaboratorPage = () => {
  return (
    <div className="w-full">
      <div>
        <TitleOnPage text={`Registrar Colaborador`} bcrumb={bcrumbs}  />
      </div>
      <div className="flex flex-col gap-3">
        <Card>
          <CardContent className="min-h-screen">
            <div className="p-0 overflow-hidden rounded-md">
              <AddCollaboratorForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddCollaboratorPage;
