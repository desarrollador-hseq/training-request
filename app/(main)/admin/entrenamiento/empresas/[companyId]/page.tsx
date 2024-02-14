import Link from "next/link";
import { ArrowLeftToLine } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { EditCompanyForm } from "./_components/edit-company-form";
import { TitleOnPage } from "@/components/title-on-page";
import { DeactivateCompany } from "./_components/deactivate-company";
import { ValidateCompany } from "./_components/validate-company";

const crumbs = [
  { label: "empresas", path: "/admin/entrenamiento/empresas" },
  { label: "editar", path: "/editar" },
];

const EditCompanyPage = async ({
  params,
}: {
  params: { companyId: string };
}) => {
  const company = await db.company.findUnique({
    where: {
      id: params.companyId,
    },
  });

  return (
    <div>
      {company ? (
        <div className="w-full">
          <TitleOnPage
            text={
              <div>
                Editar empresa:
                <span className="font-normal">{company.businessName}</span>
              </div>
            }
            bcrumb={crumbs}
          >
            <DeactivateCompany company={company} />
          </TitleOnPage>

          <div className="w-full flex flex-col gap-3">
            <Card className="rounded-sm">
              <CardHeader>
                <div className="relative">
                  <ValidateCompany company={company} />
                </div>
              </CardHeader>
              <CardContent>
                <EditCompanyForm company={company} />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <Card className="w-full h-full bg-red-800 flex px-3">
            <CardHeader className="w-fit flex justify-start">
              <Link
                href="/admin/entrenamiento/empresas"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "justify-self-start"
                )}
              >
                <ArrowLeftToLine className="w-4 h-4 mr-2" />
                Regresar
              </Link>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-0">
              <h2 className=" text-white text-xl text-center">
                No se encontró la empresa
              </h2>
            </CardContent>
            <div />
          </Card>
        </div>
      )}
    </div>
  );
};

export default EditCompanyPage;
