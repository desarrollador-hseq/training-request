"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Company } from "@prisma/client";
import { Banner } from "@/components/banner";
import { useLoading } from "@/components/providers/loading-provider";
import { SimpleModal } from "@/components/simple-modal";

export const ValidateCompany = ({
  company,
  canManageCompany,
  canManagePermissions,
}: {
  company: Company;
  canManageCompany: boolean;
  canManagePermissions: boolean;
}) => {
  const { setLoadingApp } = useLoading();
  const router = useRouter();
  const handleValid = async () => {
    setLoadingApp(true);
    try {
      await axios.patch(`/api/companies/${company.id}/validate`);

      await axios.post(`/api/mail/company-validate`, {
        company,
      });

      toast.info("Se ha verificado la empresa correctamente");
      router.refresh();
    } catch (error) {
      toast.error(
        "Ocurrió un error inesperado, por favor intentelo nuevamente"
      );
      console.log("error activate" + error);
    } finally {
      setLoadingApp(false);
    }
  };
  return (
    <div>
      {!company.isValid && (
        <div>
          <Banner variant="warning" label="Empresa no validada" />

          <SimpleModal
            btnDisabled={!(canManageCompany || canManagePermissions)}
            textBtn="Validar"
            title="Activar Empresa"
            btnClass="absolute top-2 right-1 bg-emerald-600 hover:bg-emerald-700"
            large={false}
            onAcept={handleValid}
          >
            <h2>
              ¿Desea validar la empresa de nombre{" "}
              <span className="font-bold">{company.businessName}</span>?
            </h2>
          </SimpleModal>
        </div>
      )}
    </div>
  );
};
