"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Pencil, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { InputForm } from "@/components/input-form";
import { SimpleModal } from "@/components/simple-modal";
import { useLoading } from "@/components/providers/loading-provider";

interface AddDocumentRequiredFormProps {
  requiredDocument?:
    | { id: string | null; name: string | null }
    | null
    | undefined;
  courseLevelId?: string | null;
  canManagePermissions: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
});

export const AddDocumentRequiredForm = ({
  requiredDocument,
  courseLevelId,
  canManagePermissions
}: AddDocumentRequiredFormProps) => {
  const { setLoadingApp } = useLoading();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);
  const isEdit = useMemo(() => requiredDocument, [requiredDocument]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: requiredDocument?.name || "",
    },
  });

  useEffect(() => {
    !isEdit && setIsEditing(true);
  }, [isEdit]);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if(!canManagePermissions) {
      toast.error("Sin permisos para proceder")
      return
    }
    setLoadingApp(true);
    try {
      if (!isEdit) {
        await axios.post(
          `/api/course-levels/${courseLevelId}/required-document`,
          values
        );
      } else {
        await axios.patch(
          `/api/course-levels/${courseLevelId}/required-document/${requiredDocument?.id}`,
          values
        );
      }

      toast.success("Documento requerido actualizado");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoadingApp(false);
      form.reset()
    }
  };

  const onDeleteDocument = async () => {
    if(!canManagePermissions) {
      toast.error("Sin permisos para proceder")
      return
    }
    setLoadingApp(true);

    try {
      await axios.delete(
        `/api/course-levels/${courseLevelId}/required-document/${requiredDocument?.id}`
      );
      toast.info("Documento requerido eliminado");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoadingApp(false);

    }
  };

  return (
    <div className="w-full mt-6 border bg-slate-300 rounded-md p-4 text-zinc-800 max-h-[200px]">
      <div className="font-medium flex items-center justify-between">
        {isEdit && (
          <Button
            onClick={toggleEdit}
            disabled={!canManagePermissions}
            variant="default"
            className="bg-slate-500 hover:bg-slate-700 p-2 h-fit gap-1"
          >
            {isEditing ? (
              <>
                <X className="h-5 w-5 " /> 
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4" /> editar
              </>
            )}
          </Button>
        )}
        {!isEdit && (
          <span className="w-full font-bold text-center">
            Agregar Documento requerido
          </span>
        )}
        {!isEditing && isEdit && (
          <SimpleModal
            onAcept={onDeleteDocument}
            large={false}
            btnClass="p-2 h-fit bg-red-700 hover:bg-red-600"
            textBtn={<Trash className="w-4 h-4" />}
            title="Eliminar documento requerido"
            btnDisabled={!canManagePermissions}
          >
            ¿Desea eliminar el documento: ({requiredDocument?.name})?
          </SimpleModal>
        )}
      </div>

      {!isEditing && (
        <div>
          <p className={cn("text-md font-semibold mt-2 italic")}>
            {requiredDocument ? requiredDocument.name : ""}
          </p>
        </div>
      )}
      {(isEditing || !!!requiredDocument) && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <InputForm control={form.control} label="" name="name" disabled={!canManagePermissions} />

            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting || !canManagePermissions}
                className="bg-secondary"
                type="submit"
              >
                {isEdit ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
