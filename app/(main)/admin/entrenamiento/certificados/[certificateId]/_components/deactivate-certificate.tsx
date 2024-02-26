"use client";

import { Certificate } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useLoading } from "@/components/providers/loading-provider";
import { SimpleModal } from "@/components/simple-modal";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const DeactivateCertificate = ({
  certificate,
}: {
  certificate: Certificate;
}) => {
  const { loadingApp, setLoadingApp } = useLoading();
  const router = useRouter();
  const [pass, setPass] = useState("");

  const handleDelete = async () => {
    if (!pass || pass.length < 5) {
      toast.error("Ingrese una contraseña válida");
      return;
    }
    setLoadingApp(true);
    try {
      await axios.delete(`/api/certificates/${certificate.id}`, {
        data: { pass: pass },
      });
      toast.info("Se ha eliminado el certificado correctamente");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverResponse = error.response;
        if (serverResponse && serverResponse.status === 400) {
          const errorMessage = serverResponse.data;
          if (typeof errorMessage === "string") {
            toast.error(errorMessage);
          }
        } else {
          toast.error("Ocurrió un error inesperado");
        }
      } else {
        console.error(error);
        toast.error("Ocurrió un error inesperado");
      }
    } finally {
      setLoadingApp(false);
      setPass("");
    }
  };

  const content = (
    <p className="font-normal inline">
      ¿Desea eliminar el certificado de:{" "}
      <span className="font-bold "> {certificate.collaboratorFullname}</span> -
      <span className="font-bold "> {certificate.courseName}</span> -
      <span className="font-bold "> {certificate.levelName}</span> ?
    </p>
  );

  return (
    <div>
      {certificate.active && (
        <SimpleModal
          large={false}
          textBtn={<Trash />}
          title="¿Eliminar certificado?"
          onAcept={handleDelete}
        >
          {content}
          <Card className="max-w-[400px] mt-4 justify-self-center self-center mx-auto bg-red-700 text-white">
            <CardHeader className="text-center text-sm">
              Ingresa la contraseña de la cuenta de administrador actual, y
              preciona en aceptar para eliminar
            </CardHeader>
            <CardContent>
              <Input
                type="password"
                className="max-w-[300px] mx-auto text-slate-600 bg-red-200"
                onChange={(e) => setPass(e.target.value)}
                value={pass}
              />
            </CardContent>
          </Card>
        </SimpleModal>
      )}
    </div>
  );
};
