import { TitleOnPage } from "@/components/title-on-page";
import { Card, CardContent } from "@/components/ui/card";
import { AddCollaboratorForm } from "../_components/add-collaborator-form";

export const AddCollaboratorPage = () => {
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
        </div>
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
