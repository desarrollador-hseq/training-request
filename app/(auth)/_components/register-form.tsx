"use client";
import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z
  .object({
    businessName: z.string().min(1, {
      message: "Nombre de la empresa es requerido",
    }),
    nit: z.string().min(1, {
      message: "Nit es requerido",
    }),
    sector: z.string().min(1, {
      message: "Nit es requerido",
    }),
    nameContact: z.string().min(1, {
      message: "Nit es requerido",
    }),
    email: z.string().min(1, {
      message: "Correo Electrónico es requerido",
    }),
    password: z.string().min(5, {
      message: "digite al menos 5 caracteres",
    }),
    repeatPassword: z.string().min(5, {
      message: "repita la contraseña",
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

const SectorsItem = [
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
    defaultValues: { email: "", password: "" },
  });
  const { isSubmitting, isValid } = form.formState;
  const { watch } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsEditing(true);
    setViewPass(false);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-1">
            <div>
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="font-bold text-primary"
                      htmlFor="businessName"
                    >
                      Nombre de la empresa
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="businessName"
                        disabled={isSubmitting}
                        placeholder="Empresa S.A"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="nit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-primary" htmlFor="nit">
                      Nit
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="nit"
                        disabled={isSubmitting}
                        placeholder="123456789-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-100 border-slate-300">
                          <SelectValue
                            className="text-red-500"
                            placeholder="Selecciona el sector de la empresa"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SectorsItem.map((sector) => (
                          <SelectItem value={sector.value}>
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
            <div>
              <FormField
                control={form.control}
                name="nameContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="font-bold text-primary"
                      htmlFor="nameContact"
                    >
                      Nombre de la persona de contacto
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="nameContact"
                        disabled={isSubmitting}
                        placeholder=""
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="font-bold text-primary"
                      htmlFor="email"
                    >
                      Correo de la persona de contacto
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        disabled={isSubmitting}
                        placeholder=""
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* -----------password----------- */}
            <div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel htmlFor="password">Contraseña</FormLabel>

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
            {/* -----------repeatpassword----------- */}
            <div>
              <FormField
                control={form.control}
                name="repeatPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="repeat-password">
                      Repetir Contraseña
                    </FormLabel>

                    <FormControl>
                      <Input
                        id="repeat-password"
                        type="password"
                        disabled={isSubmitting}
                        placeholder="•••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center ">
          <div className="w-full flex flex-col gap-3">
            {/* -----------accept terms----------- */}
            <div >
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Aceptar terminos y condiciones</FormLabel>
                      <FormDescription className="">
                        ver terminos y condiciones{" "}
                        <Button className="text-sky-500">aquí.</Button>
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={!isValid || isSubmitting} className="w-full">
              {isEditing && <Loader2 className="w-4 h-4 animate-spin" />}
              Entrar
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
