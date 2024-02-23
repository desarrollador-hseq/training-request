"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useLoading } from "@/components/providers/loading-provider";
import { Button } from "@/components/ui/button";

export const SendTraining = ({
  trainingRequestId,
  disabled,
  isPending,
  isAdmin
}: {
  trainingRequestId: string;
  disabled: boolean;
  isPending: boolean;
  isAdmin?: boolean;
}) => {
  const { setLoadingApp } = useLoading();
  const router = useRouter();

  const onclick = async () => {
    if (isPending || isAdmin) {
      setLoadingApp(true);
      try {
        await axios.patch(`/api/training-requests/${trainingRequestId}/`, {
          state: "ACTIVE",
          activeFrom: new Date()
        });

        // Notificacion de correo a admins

        //se verifica que no sea admin, si es admin no se envia la notificacion al correo
        if(!isAdmin) {
          try {
            await axios.post(`/api/mail/requests-created`, { trainingRequestId });
          } catch (emailError) {
            console.error(emailError);
          }
        }

        toast.success(isAdmin ? "Solicitud actualizada correctamente" : "Solicitud enviada correctamente");
        router.refresh();
      } catch (updateError) {
        console.error(updateError);
        toast.error("Ocurrió un error al enviar la solicitud");
      } finally {
        setLoadingApp(false);
      }
    }
  };

  return (
    <div>
      {(isPending || isAdmin) && (
        <Button disabled={!disabled} onClick={onclick} variant="primary">
          {isAdmin ? "Actualizar" : "Enviar"}
        </Button>
      )}
    </div>
  );
};
