import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Collaborator, CourseLevel } from "@prisma/client";
import { Calendar, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PickSuggestedDate } from "./pick-suggested-date";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import axios from "axios";
import { toast } from "sonner";
import { useLoading } from "@/components/providers/loading-provider";

interface ModalSuggestedDateProps {
  courseLevel: CourseLevel | null | undefined;
  trainingRequestCollaborator: any | null | undefined;
  suggestedDate: Date | undefined;
  isDisallowed: boolean;
  trainingRequestId: string;
}

export const ModalSuggestedDate = ({
  courseLevel,
  trainingRequestCollaborator,
  trainingRequestId,
  suggestedDate,
}: ModalSuggestedDateProps) => {
  const [openModals, setOpenModals] = useState<{ [key: string]: boolean }>({});
  const [date, setDate] = useState<Date | undefined>(suggestedDate);
  const [dateUpdated, setDateUpdated] = useState(false);
  const { setLoadingApp } = useLoading();

  useEffect(() => {
    if (!dateUpdated) return;
    if (date == suggestedDate) return;

    const updateDate = async () => {
      setLoadingApp(true);
      try {
        await axios.patch(
          `/api/training-requests/${trainingRequestId}/members/${trainingRequestCollaborator.collaborator.id}`,
          { suggestedDate: date }
        );
        toast.success("Fecha sugerida actualizada");
      } catch (error) {
        toast.error(
          "Ocurrió un error al actualzar la fecha sugerida del colaborador"
        );
      } finally {
        handleCloseModal(trainingRequestCollaborator?.id!, courseLevel?.id!);
        setLoadingApp(false);
      }
    };
    updateDate();
  }, [date, dateUpdated, trainingRequestId, trainingRequestCollaborator]);

  const handleOpenModal = (collaboratorId: string, courseLevelId: string) => {
    setOpenModals((prevOpenModals) => ({
      ...prevOpenModals,
      [`${collaboratorId}-${courseLevelId}`]: true,
    }));
  };

  const handleCloseModal = (collaboratorId: string, courseLevelId: string) => {
    setOpenModals((prevOpenModals) => ({
      ...prevOpenModals,
      [`${collaboratorId}-${courseLevelId}`]: false,
    }));
  };

  return (
    <div>
      {courseLevel?.id && (
        <AlertDialog
          open={
            openModals[`${trainingRequestCollaborator?.id}-${courseLevel.id}`]
          }
          onOpenChange={() =>
            handleCloseModal(trainingRequestCollaborator?.id!, courseLevel.id)
          }
        >
          <Button
            variant="outline"
            onClick={() =>
              handleOpenModal(trainingRequestCollaborator?.id!, courseLevel.id)
            }
            className="border-accent font-semibold text-slate-600"
          >
            {!!date ? format(date, "P", { locale: es }) : <Calendar />}
          </Button>

          <AlertDialogContent
            className={" max-h-fit min-h-[300px] min-w-[90px] max-w-fit "}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="font-bold">
              (Opcional) Seleciona una fecha sugerida para el inicio del entrenamiento
                del colaborador.
              </AlertDialogTitle>
              <span className="text-lg italic text-slate-600 text-center">
                {trainingRequestCollaborator?.collaborator?.fullname}
              </span>
            </AlertDialogHeader>
            <PickSuggestedDate
              setDate={setDate}
              date={date}
              isDisallowed={false}
              scheduledDate={suggestedDate}
              setDateUpdated={setDateUpdated} // Agrega el manejador para cambiar la fecha
            />
            <AlertDialogFooter>
              <Button
                className="w-fit h-fit flex rounded-md justify-center items-center p-1 hover:bg-slate-50"
                variant="outline"
                onClick={() =>
                  handleCloseModal(
                    trainingRequestCollaborator?.id!,
                    courseLevel.id
                  )
                }
              >
                <X className="text-red-500" />
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
