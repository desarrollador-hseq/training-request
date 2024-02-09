import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { InputForm } from "@/components/input-form";
import { useLoading } from "@/components/providers/loading-provider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface ArlFormProps {
  arlName?: string | null;
  collaboratorId?: string;
}

const formSchema = z.object({
  arlName: z.string().min(1, {
    message: "el nombre de la ARL es requerido",
  }),
});

export const ArlForm = ({ arlName, collaboratorId }: ArlFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { setLoadingApp } = useLoading();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { arlName: arlName || "" },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!collaboratorId) return;
    setLoadingApp(true);
    try {
      await axios.patch(`/api/collaborators/${collaboratorId}`, values);
      toast.success("ARL del colaborador actualizado");
      toggleEdit();
      router.refresh();
      //   router.push(pathname);
    } catch {
      toast.error(
        "Ocurrió un error inesperado, por favor intentelo nuevamente"
      );
    } finally {
      setLoadingApp(false);
    }
  };

  return (
    <div className="mt-1 border bg-blue-100 p-1 rounded-none relative">
      <div className="font-medium flex items-center justify-center ">
        <span className="font-bold"> Nombre de ARL</span>
        <Button
          className={cn(
            "text-white hover:text-white p-1 h-6 rounded-none absolute top-0 right-0 rounded-bl-md shadow-md",
            isEditing
              ? "bg-red-600 hover:bg-red-700"
              : "bg-secondary/80 hover:bg-secondary"
          )}
          onClick={toggleEdit}
          variant="ghost"
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4" />
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2 text-center">{arlName}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <InputForm control={form.control} label="" name="arlName" />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
