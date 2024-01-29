"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InputForm } from "@/components/input-form";

interface AddDocumentRequiredFormProps {
  requiredDocument?:
    | { id: string | null; name: string | null }
    | null
    | undefined;
  courseLevelId?: string | null;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
});

export const AddDocumentRequiredForm = ({
  requiredDocument,
  courseLevelId,
}: AddDocumentRequiredFormProps) => {
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
  }, []);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

      toast.success("Porcentaje actualizado");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Ocurrió un error inesperado");
    }
  };

  return (
    <div className="w-full mt-6 border bg-slate-300 rounded-md p-4 text-zinc-800 max-h-[200px]">
      <div className="font-medium flex items-center justify-between">
        {isEdit && (
          <Button
            onClick={toggleEdit}
            variant="default"
            className="bg-slate-500 hover:bg-slate-700"
          >
            {isEditing ? (
              <>
                <X className="h-5 w-5 " />
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
        {!isEdit && (
          <span className="w-full font-bold text-center">
            Agregar Documento requerido
          </span>
        )}
      </div>

      {!isEditing && (
        <p className={cn("text-md font-semibold mt-2 italic")}>
          {requiredDocument ? requiredDocument.name : ""}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <InputForm control={form.control} label="" name="name" />

            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
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
