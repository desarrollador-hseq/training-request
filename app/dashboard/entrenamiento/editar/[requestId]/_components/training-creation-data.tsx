"use client";

import * as z from "zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course, CourseLevel, TrainingRequest } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const formSchema = z.object({
  courseId: z.string().min(1, {
    message: "Curso es requerido",
  }),
  createdAt: z.string().datetime(),
});

interface EditTrainingRequestProps {
  trainingRequest: TrainingRequest & { course: Course | null };
  courseLevels: CourseLevel[];
  isAdmin: boolean;
}

export const TrainingCreationData = ({
  trainingRequest,
  courseLevels,
  isAdmin,
}: EditTrainingRequestProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      createdAt:
        format(trainingRequest.updatedAt, "dd LLLL y", { locale: es }) ||
        undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await axios.post("/api/training-requests", values);
      router.push(`/dashboard/entrenamiento/${data.id}`);
      toast.success("Solicitud creada");
    } catch {
      console.log(
        "Ocurrió un error inesperado, por favor intentelo nuevamente"
      );
      toast.error(
        "Ocurrió un error inesperado, por favor intentelo nuevamente"
      );
    }
  };

  return (
    <div className="flex md:items-center md:justify-start h-full w-full">
      <div className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8 w-full"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de entrenamiento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!isAdmin}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-slate-100 border-slate-300">
                            <SelectValue
                              className="text-red-500"
                              placeholder="Selecciona el tipo de entrenameinto"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">altura</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="ml-6 text-[0.8rem] text-red-500 font-medium" />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="createdAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de creación</FormLabel>
                      <Input {...field} disabled={!isAdmin || isSubmitting} />
                      <FormMessage className="ml-6 text-[0.8rem] text-red-500 font-medium" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* <div className="flex items-center gap-x-2">
                <Link href="/dashboard/">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={!isValid || isSubmitting}>
                  Continuar
                </Button>
              </div> */}
          </form>
        </Form>
      </div>
    </div>
  );
};
