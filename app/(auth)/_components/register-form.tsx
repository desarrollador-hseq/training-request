"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Checkbox } from "@/components/ui/checkbox";
import PdfFullscreen from "@/components/pdf-fullscreen";
import { InputForm } from "@/components/input-form";
import { SelectForm } from "@/components/select-form";
import { TooltipInfo } from "@/components/tooltip-info";

const formSchema = z
  .object({
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
    password: z.string().min(5, {
      message: "digite al menos 5 caracteres",
    }),
    repeatPassword: z.string().min(5, {
      message: "digite al menos 5 caracteres",
    }),
    acceptTerms: z.literal<boolean>(true),
  })
  .superRefine(({ repeatPassword, password }, ctx) => {
    if (repeatPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden",
      });
    }
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

export const RegisterForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [viewPass, setViewPass] = useState(false);
  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      nit: "",
      sector: "",
      nameContact: "",
      email: "",
      phoneContact: "",
      password: "",
      repeatPassword: "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const { watch } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsEditing(true);
    setViewPass(false);
    console.log({ values });
    try {
      const signInResponse = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!signInResponse || signInResponse.ok !== true) {
        return toast.error("Correo Electrónico y/o Contraseña incorrectos", {
          description: "Por favor revisa los datos ingresados",
          position: "top-right",
        });
      }

      router.refresh();
      toast.success("Bienvenido");
      toggleEdit();
    } catch (error) {
      toast.error("Something went wrong");
      console.log("errorr", error);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-8">
          <div className="bg-teal-50/30 border-2 border-teal-100  p-3 flex flex-col rounded-sm">
            <h4 className="self-center mb-2 text-primary font-bold text-slate-500">
              Datos de la empresa
            </h4>
            {/* businessName */}
            <div>
              <InputForm
                control={form.control}
                isSubmitting={isSubmitting}
                label="Nombre Comercial"
                name="businessName"
              />
            </div>
            {/* nit */}
            <div>
              <InputForm
                control={form.control}
                isSubmitting={isSubmitting}
                label="Nit"
                name="nit"
              />
            </div>
            <div>
              <SelectForm
                control={form.control}
                isSubmitting={isSubmitting}
                label="Sector"
                name="sector"
                options={sectorsItem}
              />
            </div>
          </div>
          <div className="bg-blue-50/30 border-2 border-blue-100  p-3 flex flex-col rounded-sm">
            <h4 className="self-center mb-2 text-primary font-bold text-slate-500">
              Datos de persona de contacto
            </h4>
            {/* nameContact */}
            <div>
              <InputForm
                control={form.control}
                isSubmitting={isSubmitting}
                label="Nombre completo"
                name="nameContact"
              />
            </div>
            {/* phoneContact */}
            <div>
              <InputForm
                control={form.control}
                isSubmitting={isSubmitting}
                label="Teléfono"
                name="phoneContact"
              />
            </div>
            <div className="space-y-1">
              {/* email */}
              <div>
                <InputForm
                  control={form.control}
                  isSubmitting={isSubmitting}
                  label="Correo electrónico"
                  name="email"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50/30 border-2 border-slate-100 p-3 flex flex-col rounded-sm">
            <h4 className="self-center mb-2 text-primary font-bold text-slate-500">
              Credenciales de inicio de sesión
            </h4>
            {/* -----------password----------- */}
            <div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="font-semibold" htmlFor="password">
                      Contraseña
                    </FormLabel>

                    <FormControl>
                      <Input
                        id="password"
                        type={viewPass ? "text" : "password"}
                        disabled={isSubmitting}
                        placeholder="•••••••••"
                        {...field}
                      />
                    </FormControl>
                    {watch().password.length > 0 &&
                      (!viewPass ? (
                        <Eye
                          className="w-5 h-5 absolute bottom-3 right-3 text-primary"
                          onClick={() => setViewPass(true)}
                        />
                      ) : (
                        <EyeOff
                          className="w-5 h-5 absolute bottom-3 right-3 text-primary"
                          onClick={() => setViewPass(false)}
                        />
                      ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* repeatpassword */}
            <div>
              <InputForm
                control={form.control}
                isSubmitting={isSubmitting}
                label="Repetir contraseña"
                name="repeatPassword"
                type="password"
              />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center ">
          <div className="w-full flex flex-col gap-3 mt-2">
            {/* -----------accept terms----------- */}
            <div>
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="accent-red-700"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Aceptar terminos y condiciones</FormLabel>
                      <FormDescription className="text-sm font-normal text-slate-400 ">
                        ver terminos y condiciones{" "}
                        <PdfFullscreen
                          fileUrl=""
                          icon="aquí"
                          btnClass="p-0 font-normal text-sm hover:bg-ihnerit text-blue-400"
                        />
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <TooltipInfo text="Rellena todo el formulario para continuar">
              <div className="w-full h-fit">
                <Button disabled={!isValid || isSubmitting} className="w-full">
                  {isEditing && <Loader2 className="w-4 h-4 animate-spin" />}
                  Registrarse
                </Button>
              </div>
            </TooltipInfo>
          </div>
        </div>
      </form>
    </Form>
  );
};
