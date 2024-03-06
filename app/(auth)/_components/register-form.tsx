"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";

import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
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
import { useLoading } from "@/components/providers/loading-provider";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    legalRepresentative: z.string().min(2, {
      message: "digite al menos 5 caracteres",
    }),
    password: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
      .regex(
        /^(?=.*[A-Z])(?=.*\d).*$/,
        "La contraseña debe contener al menos una mayúscula y un número"
      ),
    repeatPassword: z.string().min(6, {
      message: "digite al menos 6 caracteres",
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

const getPasswordErrors = (password: string): string | null => {
  try {
    formSchema.parse({ password });
    return null; // No hay errores
  } catch (error: any) {
    return error.errors[0];
  }
};

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

export const RegisterForm = ({
  setTabSelected,
  setShowModal,
}: {
  setTabSelected: Dispatch<SetStateAction<string>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const [captcha, setCaptcha] = useState<string | null>();
  const [isEditing, setIsEditing] = useState(false);
  const [viewPass, setViewPass] = useState(false);
  const [isGoodPass, setIsGoodPass] = useState(false);
  const [strength, setStrength] = useState("weak");

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      nit: "",
      sector: "",
      legalRepresentative: "",
      nameContact: "",
      email: "",
      phoneContact: "",
      password: "",
      repeatPassword: "",
    },
  });
  const { isSubmitting, isValid, errors } = form.formState;
  const { watch, setError, getValues } = form;

  const onSubmitRegister = async (values: z.infer<typeof formSchema>) => {
    setIsEditing(true);
    setViewPass(false);
    setLoadingApp(true);

    try {
      const { data } = await axios.post(`/api/auth/register`, {
        ...values,
      });

      try {
        const res = await axios.post(`/api/mail/company-registered`, data);
      } catch (error) {
        console.log("[404] email notification sent");
      }

      toggleEdit();
      router.refresh();
      setTabSelected("login");
      setShowModal(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverResponse = error.response;
        if (serverResponse && serverResponse.status === 400) {
          const errorMessage = serverResponse.data;
          if (
            typeof errorMessage === "string" &&
            errorMessage.includes("Nit de empresa ya se encuentra registrado")
          ) {
            setError("nit", {
              type: "manual",
              message: "Nit de empresa ya se encuentra registrado",
            });
          } else if (
            typeof errorMessage === "string" &&
            errorMessage.includes(
              "Correo electrónico de contacto ya se encuentra registrado"
            )
          ) {
            setError("email", {
              type: "manual",
              message:
                "Correo electrónico de contacto ya se encuentra registrado",
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
      setIsEditing(false);
      setLoadingApp(false);
    }
  };

  useEffect(() => {
    if (watch("password").length >= 6) {
      if (/[A-Z]/.test(watch("password")) && /\d/.test(watch("password"))) {
        setStrength("fuerte");
        setIsGoodPass(true);
      } else {
        setStrength("media");
        setIsGoodPass(false);
      }
    } else {
      setStrength("fácil");
      setIsGoodPass(false);
    }
  }, [watch()]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitRegister)}
        className="space-y-1"
      >
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-1 xl:grid-cols-2 gap-2 mt-2">
          <Card className="p-2 flex flex-col">
            <h4 className="self-center mb-1 text-primary font-bold text-slate-500">
              Datos de la empresa
            </h4>
            {/* businessName */}
            <div>
              <InputForm
                control={form.control}
                isSubmitting={isSubmitting}
                label="Razón social (incluyendo: SA, SAS, LTDA , etc.)"
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
            {/* nit */}
            <div>
              <SelectForm
                control={form.control}
                isSubmitting={isSubmitting}
                label="Sector"
                name="sector"
                options={sectorsItem}
              />
            </div>
            {/* legalRepresentative */}
            <div>
              <InputForm
                control={form.control}
                isSubmitting={isSubmitting}
                label="Representante legal"
                name="legalRepresentative"
              />
            </div>
          </Card>
          <Card className="p-2 flex flex-col">
            <h4 className="self-center mb-1 text-primary font-bold text-slate-500">
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
          </Card>

          <Card className="p-2 flex flex-col">
            <h4 className="self-center mb-1 text-primary font-bold text-slate-500">
              Credenciales de inicio de sesión
            </h4>
            {watch().password.length > 0 && (
              <div
                className={cn(
                  "flex justify-between border border-blue-500 text-primary rounded-xl items-center px-4 mt-1",
                  strength === "fuerte" &&
                    "bg-emerald-600 text-white border-emerald-700"
                )}
              >
                <div className="flex gap-2 items-center ">
                  <p className="text-sm">Seguridad de la contraseña:</p>
                  <span>{strength}</span>
                </div>
                {isGoodPass ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </div>
            )}
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

            <div className="mt-3">
              <h3 className="font-bold">Requisitos: </h3>
              <ul className="text-sm">
                <li className="">
                  <strong>Longitud:</strong> Al menos 6 caracteres.
                </li>
                <li>
                  {" "}
                  <strong>Mayúsculas:</strong> Debe tener al menos una letra
                  mayúscula.{" "}
                </li>
                <li>
                  {" "}
                  <strong>Números:</strong> Debe tener al menos un número.
                </li>
              </ul>
            </div>
          </Card>
          {/* -----------accept terms----------- */}
          <div className="flex flex-col justify-between gap-5 min-w-max">
            <Card className="w-full h-fit flex justify-center items-center gap-2 max-w-max min-w-full">
              <div>
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between gap-3 p-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="accent-red-700 "
                        />
                      </FormControl>
                      <div className="">
                        <p className="flex flex-wrap">
                          Acepto las condiciones sobre uso de datos
                        </p>
                        <FormDescription className="text-sm font-normal text-slate-400">
                          ver condiciones{" "}
                          <PdfFullscreen
                            fileUrl="/politica-proteccion-datos.pdf"
                            icon="aquí"
                            btnClass="p-0 font-normal text-sm hover:bg-ihnerit text-blue-400"
                          />
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </Card>
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={setCaptcha}
              className="mx-auto w-auto"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center ">
          <div className="w-full flex flex-col gap-2 mt-2">
            <TooltipInfo text="Rellena todo el formulario para continuar">
              <div className="w-full h-fit">
                <Button
                  disabled={!isValid || isSubmitting || !captcha}
                  className="w-full"
                >
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
