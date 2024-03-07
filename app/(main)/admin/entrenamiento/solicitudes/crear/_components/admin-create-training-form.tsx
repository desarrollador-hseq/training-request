"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company, Course } from "@prisma/client";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AdminCreateTrainingFormProps {
  courses: Course[] | null;
  companies: Company[] | null;
}

const formSchema = z.object({
  courseId: z.string().min(1, {
    message: "Curso es requerido",
  }),
  companyId: z.string().min(1, {
    message: "Curso es requerido",
  }),
});

export const AdminCreateTrainingForm = ({
  courses,
  companies,
}: AdminCreateTrainingFormProps) => {
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
  }, [courses]);

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
          El primer paso es elegir el tipo de entrenamiento, posteriormente
          deberá seleccionar los colaboradores y adjuntar sus documentos
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8 max-w-[600px]"
          >
            <div>
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Empresa</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? companies?.find(
                                  (company) => company.id === field.value
                                )?.businessName
                              : "Selecciona una empresa"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command className="w-full">
                          <CommandInput placeholder="Buscar empresa" />
                          <CommandEmpty>Empresa no encontrada!</CommandEmpty>
                          <CommandGroup>
                            {companies?.map((company) => (
                              <CommandItem
                                value={`${company.businessName} - ${company.nit}`}
                                key={company.id}
                                onSelect={() => {
                                  form.setValue("companyId", company.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    company.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {company.businessName} - {company.nit}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                            placeholder="Selecciona el tipo de entrenamiento"
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

            <div className="flex items-center gap-x-2 w-full">
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
