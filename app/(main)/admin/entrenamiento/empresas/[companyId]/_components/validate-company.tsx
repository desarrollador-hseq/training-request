"use client";

import { Banner } from "@/components/banner";
import { useLoading } from "@/components/providers/loading-provider";
import { SimpleModal } from "@/components/simple-modal";
import { Company } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export const ValidateCompany = ({ company }: { company: Company }) => {
  const { setLoadingApp } = useLoading();
  const router = useRouter();
  const handleValid = async () => {
    setLoadingApp(true);
    try {
      await axios.patch(`/api/companies/${company.id}`, { isValid: true });
      toast.info("Se ha verificado la empresa correctamente");
      router.refresh();
    } catch (error) {
      toast.error(
        "Ocurrió un error inesperado, por favor intentelo nuevamente"
      );
      console.log("error al eliminar la empresa" + error);
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