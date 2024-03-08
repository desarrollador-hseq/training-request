"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useLoading } from "@/components/providers/loading-provider";
import { SimpleModal } from "@/components/simple-modal";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface ButtonCreateCertificateProps {
  values: any;
  btnDisabled?: boolean;
  expeditionDate: Date;
  fullname: string;
  companyContact?: string | null;
  companyEmail?: string | null;
}

export const ButtonCreateCertificate = ({
  values,
  fullname,
  expeditionDate,
  btnDisabled,
  companyContact,
  companyEmail,
}: ButtonCreateCertificateProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const [notifyCertificate, setNotifyCertificate] = useState(true);

  const handleCreateCertificate = async () => {
    setLoadingApp(true);

    // Crear certificado
    try {
      const { data } = await axios.post(`/api/certificates/`, values);

      router.push(`/admin/entrenamiento/certificados/${data.id}`);

      toast.success("Certificado guardado correctamente");
    } catch (error) {
      toast.error(
        "Ocurrió un error al registrar la certificación , por favor intentalo nuevamente"
      );
    }

    setLoadingApp(false);
  };

  return (
    <SimpleModal
      btnDisabled={!!!expeditionDate || btnDisabled}
      btnClass="w-full max-w-[200px] py-8"
      textBtn={"Certificar"}
      onAcept={() => handleCreateCertificate()}
      large={false}
      title={"Certificar al colaborador"}
    >
      <div className="items-top flex flex-col space-x-2  my-3 p-2">
        <h5>¿Desea certificar al colaborador de nombre: {fullname}</h5>
        <div className="items-top flex space-x-2  my-3 p-2 max-w-[300px]">
          <Checkbox
            id="notify"
            checked={notifyCertificate}
            onCheckedChange={(e) => setNotifyCertificate(!!e)}
            className=""
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="notify"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Informar a la empresa
            </label>
          </div>
        </div>
      </div>
    </SimpleModal>
  );
};
