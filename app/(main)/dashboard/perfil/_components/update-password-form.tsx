import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff, Pencil, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { InputForm } from "@/components/input-form";
import { useLoading } from "@/components/providers/loading-provider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const formSchema = z
  .object({
    actualPassword: z.string().min(5, {
      message: "digite al menos 5 caracteres",
    }),
    password: z.string().min(5, {
      message: "digite al menos 5 caracteres",
    }),
    repeatPassword: z.string().min(5, {
      message: "digite al menos 5 caracteres",
    }),
  })
  .superRefine(({ repeatPassword, password }, ctx) => {
    if (repeatPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden",
      });
    }
  });

export const UpdatePasswordForm = () => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();

  const [viewPass, setViewPass] = useState(false);
  const [viewPassActual, setViewPassActual] = useState(false);
  const [msg, setMsg] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", actualPassword: "", repeatPassword: "" },
  });
  const { isSubmitting, isValid } = form.formState;
  const { watch } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.actualPassword === values.password) {
      toast.error("No puedes enviar la misma contraseña")
      return
    }
    setLoadingApp(true);
    try {
      await axios.patch(`/api/companies/change-password`, values);
      toast.success("Contraseñas actualizadas correctamente");

      router.refresh();
      //   router.push(pathname);
    } catch(error) {
      if (axios.isAxiosError(error)) {
        const serverResponse = error.response;
        if (serverResponse && serverResponse.status === 400) {
          const errorMessage = serverResponse.data;
          if (typeof errorMessage === "string") {
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
      form.reset();
    }
  };

  return (
    <Card className="mt-1 border bg-blue-100 p-1  relative">
      <h3 className="flex items-center justify-center font-bold">Actualizar contraseña</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4 p-3">
          <div>
            <FormField
              control={form.control}
              name="actualPassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="font-semibold" htmlFor="actualPassword">
                    Contraseña Actual
                  </FormLabel>

                  <FormControl>
                    <Input
                      id="actualPassword"
                      type={viewPassActual ? "text" : "password"}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  {watch().actualPassword.length > 0 &&
                    (!viewPassActual ? (
                      <Eye
                        className="w-5 h-5 absolute bottom-3 right-3 text-primary"
                        onClick={() => setViewPassActual(true)}
                      />
                    ) : (
                      <EyeOff
                        className="w-5 h-5 absolute bottom-3 right-3 text-primary"
                        onClick={() => setViewPassActual(false)}
                      />
                    ))}
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
                  <FormLabel className="font-semibold" htmlFor="password">
                    Nueva contraseña
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
              label="Repetir nueva contraseña"
              name="repeatPassword"
              type="password"
            />
          </div>

          <div className="flex items-center gap-x-2">
            <Button disabled={!isValid || isSubmitting} type="submit">
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
