"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { FileCheck } from "lucide-react";
import { useLoading } from "@/components/providers/loading-provider";
import { SimpleModal } from "@/components/simple-modal";

interface ValidateDocumentsProps {
  collaboratorId?: string;
  trainingRequestId?: string;
  canManagePermissions: boolean;
  canManageRequest: boolean;
}

export const ValidateDocuments = ({
  collaboratorId,
  trainingRequestId,
  canManagePermissions,
  canManageRequest,
}: ValidateDocumentsProps) => {
  const { setLoadingApp } = useLoading();
  const router = useRouter();
  const onClick = async () => {
    setLoadingApp(true);
    try {
      await axios.patch(
        `/api/training-requests/${trainingRequestId}/members/${collaboratorId}/valid-documents`
      );
      toast.success("Documentos válidados correctamente");
      router.refresh();
    } catch (error) {
      console.log("Ocurrió un error al validar documentos");
      toast.success("Ocurrió un error al validar documentos");
    } finally {
      setLoadingApp(false);
    }
  };
  return (
    <div className="w-full flex justify-center px-6 mt-3">
      <SimpleModal
        large={false}
        btnClass="max-w-fit w-full"
        textBtn={
          <span className="flex items-center gap-2">
            <FileCheck /> Validar todos los documentos{" "}
          </span>
        }
        onAcept={onClick}
        btnDisabled={!(canManagePermissions || canManageRequest)}
        title="¿Desea validar los documentos actuales?"
      >
        <h3>
          Si los documentos actuales del presente colaborador son correctos,
          presione aceptar
        </h3>
      </SimpleModal>
    </div>
  );
};
