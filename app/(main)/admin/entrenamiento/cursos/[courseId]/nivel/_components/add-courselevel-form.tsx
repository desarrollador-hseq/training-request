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

interface AddCourseLevelFormProps {
  courseLevel?: CourseLevel | null;
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
}: AddCourseLevelFormProps) => {
  const router = useRouter();
  const isEdit = useMemo(() => courseLevel, [courseLevel]);

  if (isEdit && !courseLevel) {
    router.replace("/admin/entrenameinto/cursos");
    toast.error("Curso no encontrado, redirigiendo...");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: courseLevel?.name || "",
      hours: courseLevel?.hours || undefined,
      monthsToExpire: courseLevel?.monthsToExpire || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { watch } = form;

  useEffect(() => {
    console.log({watch: watch()})
  }, [watch()])
  

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit) {
        await axios.patch(
          `/api/courses/${courseLevel?.courseId}/${courseLevel?.id}`,
          values
        );
        toast.success("Nivel actualizado");
      } else {
        const { data } = await axios.post(
          `/api/courses/${courseLevel?.courseId}/course-levels`,
          values
        );
        toast.success("Nivel creado");
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
                <InputForm control={form.control} label="Nombre" name="name" />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Número de horas"
                  name="hours"
                  type="number"
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Meses para reentrenamiento"
                  name="monthsToExpire"
                  type="number"
                />
              </div>
            </div>
          </div>

          <Button
            disabled={isSubmitting || !isValid}
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
