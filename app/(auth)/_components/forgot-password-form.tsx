
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Banner } from "@/components/banner";
import axios from "axios";
import Link from "next/link";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().min(1, {
    message: "Correo Electrónico es requerido",
  })
});

export const ForgotPasswordForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [wasSend, setWasSend] = useState(false);
  const [message, setMessage] = useState();

  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: ""},
  });
  const { isSubmitting, isValid } = form.formState;
  // https://ethanmick.com/how-to-create-a-password-reset-flow/

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsEditing(true);
    try {
        const { data } = await axios.post(`/api/collaborators/recover-password`, values)

        // setMessage
      setWasSend(true)
      router.refresh();
      toast.success("correo enviado");
      toggleEdit();
    } catch (error) {
      toast.error("Something went wrong");
      console.log("errorr", error);
    } finally {
      setIsEditing(false);
      form.reset()
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4 w-full max-w-[500px]">
        {/* {
            wasSend && (
                // <Banner label={} />
            )
        } */}
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
 

        {/* <Link href="/dashboard" className="w-full">
        Entrar
      </Link> */}
        <Button disabled={!isValid || isSubmitting} className="w-full">
          {isEditing && <Loader2 className="w-4 h-4 animate-spin" />}
          Entrar
        </Button>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        
          <Link

            href="/"
            className={cn(buttonVariants({variant: "outline"}), "font-medium dark:text-blue-500")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
              Regresar al inicio de sesión
          </Link>
        </p>
      </form>
    </Form>
  );
};
