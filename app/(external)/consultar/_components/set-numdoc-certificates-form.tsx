"use client";

import { Dispatch, SetStateAction } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { InputForm } from "@/components/input-form";

interface TitleFormProps {
  setNumDoc: Dispatch<SetStateAction<string>>;
}

const formSchema = z.object({
  numDoc: z.string().min(1, {
    message: "Ingrese el documento",
  }),
});

export const SetNumdocCertificatesForm = ({ setNumDoc }: TitleFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { numDoc: "" },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const setNum = () => {
        const num =  values.numDoc
        setNumDoc(num);
    }
    setNum()
    form.reset()
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 w-full">
      <div className="font-medium flex items-center justify-between w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4 w-full flex justify-center flex-col items-center "
          >
            <InputForm
              control={form.control}
              label="Documento:"
              name="numDoc"
              type="number"
              className="w-full text-center"
            />

            <div className="flex items-center gap-x-2 w-full">
              <Button disabled={!isValid || isSubmitting} type="submit" className="w-full">
                Consultar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
