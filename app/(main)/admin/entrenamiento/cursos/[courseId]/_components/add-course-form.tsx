"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { InputForm } from "@/components/input-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

interface AddCourseFormProps {
  course?: Course | null;
  canManagePermissions: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nombre del curso es requerido",
  }),
  shortName: z.string().min(1, {
    message: "Nombre corto del curso es requerido",
  }),
  resolution: z.string().optional(),
});

export const AddCourseForm = ({
  course,
  canManagePermissions,
}: AddCourseFormProps) => {
  const router = useRouter();
  const isEdit = useMemo(() => course, [course]);

  if (isEdit && !course) {
    router.replace("/admin/entrenamiento/cursos");
    toast.error("Curso no encontrado, redirigiendo...");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: course?.name || "",
      shortName: course?.shortName || "",
      resolution: course?.resolution || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!canManagePermissions) {
      toast.error("sin permisos para proceder");
      return;
    }
    try {
      if (isEdit) {
        await axios.patch(`/api/courses/${course?.id}`, values);
        toast.success("Curso actualizado");
      } else {
        const { data } = await axios.post(`/api/courses/`, values);
        toast.success("Curso creado");
      }
      router.push(`/admin/entrenamiento/cursos`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    }
  };
  return (
    <div className="max-w-[1500px] w-full h-full mx-auto bg-white rounded-md shadow-sm overflow-y-hidden p-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-8 p-2"
        >
          <div className="grid grid-cols-1 gap-6 mt-1 mb-7 w-full max-w-[50%]">
            <div className="space-y-4">
              <div>
                <InputForm
                  control={form.control}
                  label="Nombre"
                  name="name"
                  disabled={!canManagePermissions}
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Nombre corto"
                  name="shortName"
                  disabled={!canManagePermissions}
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Resolución"
                  name="resolution"
                  disabled={!canManagePermissions}
                />
              </div>
            </div>
          </div>

          <Button
            disabled={isSubmitting || !isValid || !canManagePermissions}
            className="w-full max-w-[500px] gap-3"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Actualizar" : "Crear"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
