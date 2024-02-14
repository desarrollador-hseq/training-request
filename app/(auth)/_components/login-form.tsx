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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().min(1, {
    message: "Correo Electrónico es requerido",
  }),
  password: z.string().min(5, {
    message: "digite al menos 5 caracteres",
  }),
});

export const LoginForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [viewPass, setViewPass] = useState(false);

  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });
  const { isSubmitting, isValid } = form.formState;

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2 w-full">
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-primary" htmlFor="email">
                  Correo Electrónico
                </FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    disabled={isSubmitting}
                    placeholder="ejemplo@miempresa.com"
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
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel
                  className="font-bold text-primary"
                  htmlFor="password"
                >
                  Contraseña
                </FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type={viewPass ? "text" : "password"}
                    className="relative"
                    disabled={isSubmitting}
                    placeholder="•••••••••"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                {field.value && (
                  <div
                    onClick={() => setViewPass(!viewPass)}
                    className="absolute top-1 right-2 "
                  >
                    {!viewPass ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* <Link href="/dashboard" className="w-full">
        Entrar
      </Link> */}
        <Button disabled={!isValid || isSubmitting} className="w-full">
          {isEditing && <Loader2 className="w-4 h-4 animate-spin" />}
          Entrar
        </Button>
        <Link
          href="/recuperar-contrasena"
          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Olvidé la contraseña
        </Link>
        {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          ¿aun no tienes una cuenta?
        </p> */}
      </form>
    </Form>
  );
};
