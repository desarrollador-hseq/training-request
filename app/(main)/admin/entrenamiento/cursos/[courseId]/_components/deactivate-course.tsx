"use client";

import { Course } from "@prisma/client";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/components/providers/loading-provider";

export const DeactivateCourse = ({
  course,
  canManagePermissions,
}: {
  course?: Course | null;
  canManagePermissions: boolean;
}) => {
  const { loadingApp, setLoadingApp } = useLoading();

  const handleDelete = async () => {
    if (!canManagePermissions) {
      toast.error("sin permisos para proceder");
      return;
    }
    setLoadingApp(true);
    try {
      await axios.delete(`/api/courses/${course?.id}`);
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
      el curso: <span className="font-bold "> {course?.name}</span>
    </p>
  );

  return (
    <div>
      {course && course.active && (
        <DeleteConfirmModal onConfirm={handleDelete} title={title}>
          <Button
            disabled={loadingApp || !canManagePermissions}
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
