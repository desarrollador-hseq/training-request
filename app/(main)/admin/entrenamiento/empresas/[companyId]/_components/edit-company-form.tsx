"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { useLoading } from "@/components/providers/loading-provider";
import { InputForm } from "@/components/input-form";

const formSchema = z.object({
  businessName: z.string().min(1, {
    message: "Nombre de la empresa es requerido",
  }),
  nit: z.string().min(1, {
    message: "Nit es requerido",
  }),
  sector: z.string().min(1, {
    message: "Sector es requerido",
  }),
  nameContact: z.string().min(1, {
    message: "Nombre del contacto es requerido",
  }),
  email: z
    .string()
    .email({
      message: "Ingrese un correo válido",
    })
    .optional()
    .or(z.literal("")),
  phoneContact: z.string().min(5, {
    message: "digite al menos 5 caracteres",
  }),
});

const sectorsItem = [
  { value: "AGROPECUARIO", label: "Agropecuario" },
  { value: "SERVICIOS", label: "Servicios" },
  { value: "INDUSTRIAL", label: "Industrial" },
  { value: "TRANSPORTE", label: "Transporte" },
  { value: "COMERCIO", label: "Comercio" },
  { value: "FINANCIERO", label: "Financiero" },
  { value: "CONSTRUCCION", label: "Construcción" },
  { value: "MINEROYENERGETICO", label: "Minero y Energético" },
  { value: "COMUNICACIONES", label: "Comunicaciones" },
  { value: "OTRO", label: "Otro" },
];

export const EditCompanyForm = ({ company }: { company: Company }) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const isEdit = useMemo(() => company, [company]);

  if (isEdit && !company) {
    router.replace("/admin/colaboradores/");
    toast.error("Colaborador no encontrado, redirigiendo...");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: company.businessName || "",
      nit: company.nit || "",
      sector: company.sector || "",
      nameContact: company.nameContact || "",
      email: company.email || "",
      phoneContact: company.phoneContact || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const { setError } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoadingApp(true);

    try {
      await axios.patch(`/api/companies/${company?.id}`, values);
      toast.success("Empresa actualizada");

      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverResponse = error.response;
        if (serverResponse && serverResponse.status === 400) {
          const errorMessage = serverResponse.data;
          if (
            typeof errorMessage === "string" &&
            errorMessage.includes("Nit ya registrado en otra empresa")
          ) {
            setError("nit", {
              type: "manual",
              message: "Nit ya registrado en otra empresa",
            });
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error("Ocurrió un error inesperado");
        }
      } else {
        console.error(error);
        toast.error("Ocurrió un error inesperado");
      }
    } finally {
      setLoadingApp(false);
    }
  };
  return (
    <div className="max-w-[1500px] h-full w-full mx-auto p-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-1 p-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1 mb-7 w-full">
            <div className="space-y-4">
            <div>
                <InputForm 
                control={form.control}
                label="Razón social"
                name="businessName"
                />
              </div>
              <div>
                <InputForm 
                control={form.control}
                label="NIT"
                name="nit"
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Sector
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-slate-100 border-slate-300">
                            <SelectValue
                              className="text-red-500"
                              placeholder="Selecciona el tipo de documento"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sectorsItem.map((sector) => (
                            <SelectItem key={sector.value} value={sector.value}>
                              {sector.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="ml-6 text-[0.8rem] text-red-500 font-medium" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 2 Column */}
            <div className="space-y-4">
            <div>
                <InputForm 
                control={form.control}
                label="Nombre del contacto"
                name="nameContact"
                />
              </div>
              <div>
                <InputForm 
                control={form.control}
                label="Correo del contacto"
                name="email"
                />
              </div>
              <div>
                <InputForm 
                control={form.control}
                label="Teléfono del contacto"
                name="phoneContact"
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
