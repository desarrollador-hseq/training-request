"use client";

import { Course, CourseLevel } from "@prisma/client";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/components/providers/loading-provider";

export const DeactivateCourselevel = ({ level, course }: { level?: CourseLevel | null; course?: string | null }) => {
  const { loadingApp, setLoadingApp } = useLoading();

  const handleDelete = async () => {
    setLoadingApp(true);
    try {
      await axios.delete(`/api/courses/${course}/course-levels/${level?.id}`);
      toast.info("Se ha eliminado el curso correctamente");
    } catch (error) {
      toast.error(
        "Ocurrió un error inesperado, por favor intentelo nuevamente"
      );
      console.log("error al eliminar el curso" + error);
    } finally {
      setLoadingApp(false);
    }
  };

  const title = (
    <p className="font-normal inline">
      el nivel: <span className="font-bold "> {level?.name}</span>
    </p>
  );

  return (
    <div>
      {level && level?.active && (
        <DeleteConfirmModal onConfirm={handleDelete} title={title}>
          <Button
            disabled={loadingApp}
            variant="destructive"
            className="bg-red-700"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </DeleteConfirmModal>
      )}
    </div>
  );
};
