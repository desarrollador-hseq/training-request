"use client";

import * as z from "zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { useEffect } from "react";

const formSchema = z.object({
  courseId: z.string().min(1, {
    message: "Curso es requerido",
  }),
});

export const CreateTrainingForm = ({ courses }: { courses?: Course[] }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    if (!courses || courses.length === 0) {
      toast.error("Error al obtener los cursos, por favor recargue la página");
    }
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await axios.post("/api/training-requests", values);
      router.push(`/dashboard/entrenamiento/solicitudes/editar/${data.id}`);
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
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-start h-full p-6">
      <div className="">
        <h1 className="text-2xl font-semibold">
          Crear solicitud de entrenamiento
        </h1>
        <p className="text-sm text-slate-600">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores
          beatae fugit natus, rerum culpa iure.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
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
                        {courses?.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="ml-6 text-[0.8rem] text-red-500 font-medium" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-x-2">
              <Link href="/dashboard/">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continuar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
