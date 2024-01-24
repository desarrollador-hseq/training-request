"use client";

import { useMemo } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Collaborator } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { phoneRegex } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddCollaboratorFormProps {
  collaborator?: Collaborator | null;
}
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
const formSchema = z.object({
  fullname: z.string().min(1, {
    message: "Nombre completo es requerido",
  }),
  docType: z.string().min(1, {
    message: "Tipo de documento requerido",
  }),
  numDoc: z
    .string()
    .min(1, {
      message: "Número de documento requerido",
    })
    .regex(phoneRegex, "Digite un Número de documento válido"),
  email: z
    .string()
    .email({
      message: "Email del colaborador es muy importante registrarlo",
    })
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(phoneRegex, "Digite teléfono móvil válido")
    .min(10, { message: "Ingrese al menos 10 digitos" })
    .max(13, { message: "son maximo 13 digitos de un teléfono movil válido" })
    .optional()
    .or(z.literal("")),
});

export const AddCollaboratorForm = ({
  collaborator,
}: AddCollaboratorFormProps) => {
  const router = useRouter();
  const isEdit = useMemo(() => collaborator, [collaborator]);

  if (isEdit && !collaborator) {
    router.replace("/admin/colaboradores/");
    toast.error("Colaborador no encontrado, redirigiendo...");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: collaborator?.fullname || "",
      docType: collaborator?.docType || "",
      numDoc: collaborator?.numDoc || "",
      email: collaborator?.email || "",
      phone: collaborator?.phone || "",
      // identificationFile: collaborator?.identificationFile || undefined,
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const { setValue, setError, watch, getValues } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit) {
        await axios.patch(`/api/collaborators/${collaborator?.id}`, values);
        toast.success("Colaborador actualizado");
      } else {
        const { data } = await axios.post(`/api/collaborators/`, values);
        toast.success("Colaborador creado");
      }
      router.push(`/dashboard/entrenamiento/colaboradores`);
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverResponse = error.response;
        if (serverResponse && serverResponse.status === 400) {
          const errorMessage = serverResponse.data;
          if (
            typeof errorMessage === "string" &&
            errorMessage.includes("Número de documento ya registrado")
          ) {
            setError("numDoc", {
              type: "manual",
              message: "Número de documento ya registrado",
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
    }
  };

  // const handleTab = () => {
  //   handleTabChange("archivos");
  // };

  return (
    <div className="max-w-[1500px] w-full h-full mx-auto bg-white rounded-md shadow-sm overflow-y-hidden p-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-8 p-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1 mb-7 w-full">
            <div className="space-y-4">
              <div>
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-sm font-semibold"
                        htmlFor="name"
                      >
                        Nombre completo
                      </FormLabel>

                      <FormControl>
                        <Input id="name" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage className="ml-6 text-[0.8rem] text-red-500 font-medium" />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="docType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Tipo de documento
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
                          <SelectItem value="CC">
                            Cédula de Ciudadanía
                          </SelectItem>
                          <SelectItem value="CE">
                            Cédula de Extranjería
                          </SelectItem>
                          <SelectItem value="TI">
                            Tarjeta de Identidad
                          </SelectItem>
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
                  name="numDoc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-sm font-semibold"
                        htmlFor="numDoc"
                      >
                        Número de documento
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="numDoc"
                          disabled={isSubmitting}
                          {...field}
                          className="text-primary"
                        />
                      </FormControl>

                      <FormMessage className="ml-6 text-[0.8rem] text-red-500 font-medium" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 2 Column */}
            <div className="space-y-4">
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-sm font-semibold flex justify-between"
                        htmlFor="email"
                      >
                        Correo Electrónico
                        <div className="text-xs text-slate-400 font-semibold text-end">
                          <span className="text-red-500 mr-1 text-base leading-normal">
                            *
                          </span>
                          Este campo es importante para enviar información al
                          colaborador
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input id="email" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage className="ml-6 text-[0.8rem] text-red-500 font-medium" />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-sm font-semibold flex justify-between"
                        htmlFor="phone"
                      >
                        Teléfono Móvil
                        <span className="text-xs text-slate-400 font-semibold text-end">
                          <span className="text-red-500 mr-1 text-base leading-normal">
                            *
                          </span>
                          Este campo es importante para enviar información al
                          colaborador
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input id="phone" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage className="ml-6 text-[0.8rem] text-red-500 font-medium" />
                    </FormItem>
                  )}
                />
              </div>

              {/* <div>
                <Button type="button" onClick={handleTab}>
                  Gestionar documentos
                </Button>
              </div> */}
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
