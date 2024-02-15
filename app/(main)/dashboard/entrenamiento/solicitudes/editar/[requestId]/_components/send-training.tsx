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
}: {
  trainingRequestId: string;
  disabled: boolean;
  isPending: boolean;
}) => {
  const { setLoadingApp } = useLoading();
  const router = useRouter();

  const onclick = async () => {
    if (isPending) {
      setLoadingApp(true);
      try {
        await axios.patch(`/api/training-requests/${trainingRequestId}/`, {
          state: "ACTIVE",
          activeFrom: new Date()
        });

        // Notificacion de correo a admins
        try {
          await axios.post(`/api/mail/requests-created`, { trainingRequestId });
        } catch (emailError) {
          console.error(emailError);
        }

        toast.success("Solicitud enviada correctamente");
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
      {isPending && (
        <Button disabled={!disabled} onClick={onclick} variant="primary">
          Enviar
        </Button>
      )}
    </div>
  );
};
