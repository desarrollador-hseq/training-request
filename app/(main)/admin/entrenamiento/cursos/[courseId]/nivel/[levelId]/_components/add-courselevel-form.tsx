"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course, CourseLevel } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { InputForm } from "@/components/input-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLoading } from "@/components/providers/loading-provider";

interface AddCourseLevelFormProps {
  courseLevel?: CourseLevel | null;
  courseId?: string | null;
  courseName?: string | null;
  canManagePermissions: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nombre del curso es requerido",
  }),
  hours: z.coerce.number(),
  monthsToExpire: z.coerce.number(),
});

export const AddCourseLevelForm = ({
  courseLevel,
  courseId,
  courseName,
  canManagePermissions,
}: AddCourseLevelFormProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const isLevel = useMemo(() => courseLevel !== null, [courseLevel]);
  const isEdit = useMemo(() => isLevel && courseLevel, [courseLevel, isLevel]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: courseLevel?.name || "",
      hours: courseLevel?.hours || undefined,
      monthsToExpire: courseLevel?.monthsToExpire || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!canManagePermissions) {
      toast.error("Sin permisos para proceder");
      return;
    }
    setLoadingApp(true);
    try {
      if (isEdit) {
        await axios.patch(
          `/api/courses/${courseId}/course-levels/${courseLevel?.id}`,
          values
        );
        toast.success("Nivel actualizado");
      } else {
        const { data } = await axios.post(
          `/api/courses/${courseId}/course-levels`,
          values
        );
        toast.success("Nivel creado");
      }
      router.push(`/admin/entrenamiento/cursos/${courseId}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoadingApp(false);
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
            <div className="space-y-4 flex flex-col justify-center">
              <div className="w-full flex items-center justify-center gap-2 bg-secondary p-2 rounded-md text-white">
                <h2 className="font-semibold text-xl ">Curso de </h2>
                <p>{courseName}</p>
              </div>
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
                  label="Número de horas"
                  name="hours"
                  type="number"
                  disabled={!canManagePermissions}
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Meses para reentrenamiento"
                  name="monthsToExpire"
                  type="number"
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
