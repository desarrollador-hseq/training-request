import { FileInputForm } from "@/components/file-input-form";
import PdfRenderer from "@/components/pdf-renderer";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ImageIcon, Loader2, Pencil, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ModalImage from "react-modal-image";
import { toast } from "sonner";
import { z } from "zod";

interface fileFormProps {
  file?: string | null;
  collaboratorId: string;
  fileType: string;
  label: string;
}
const MAX_FILE_SIZE = 1024 * 1024 * 1;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
const formSchema = z.object({
  file: z
    .any()
    .or(z.string())
    .refine((file) => file?.length !== 0, "File is required")
    .refine((files) => {
      return files?.size <= MAX_FILE_SIZE;
    }, `Max file size is 1MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.type),
      "Only .jpg, .jpeg, .png, and .pdf are accepted"
    ),
});

export const IdentificationFileForm = ({
  file,
  collaboratorId,
  fileType,
  label,
}: fileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);

  const fileExt: string | undefined = file?.split(".").pop();

  const isPdf = useMemo(() => fileExt === "pdf", [fileExt]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [fileType]: file || undefined,
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("file", values.file);

    if (file) {
      const urlKey = new URL(file).pathname.substring(1).split("/").pop();
      const key = urlKey?.split(".").shift();
      console.log({ key });
      try {
        const res = await axios.delete(`/api/upload/file/${key}`);
        console.log({ res: res.data });
      } catch (error) {
        console.log("NO se pudo borrar el archivo" + error);
      }
    }

    try {
      const { data } = await axios.post(`/api/upload/file/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await axios.patch(`/api/collaborators/${collaboratorId}`, {
        [fileType]: data.url,
      });

      toast.success("Documento actualizado");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error(
        "Ocurrió un error inesperado, por favor intentelo nuevamente"
      );
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {label}
        <Button
          onClick={toggleEdit}
          variant="secondary"
          className={cn(isEditing && "bg-slate-500 hover:bg-slate-700")}
        >
          {isEditing && <>Cancelar</>}
          {!isEditing && !file && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar documento
            </>
          )}
          {!isEditing && file && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Actualizar archivo
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!file ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md w-full">
            <ImageIcon className="w-10 h-10 text-slate-500" />
          </div>
        ) : (
          <div className="mt-2 min-w-full">
            {isPdf ? (
              <div className="max-h-[]">
                <PdfRenderer url={file} />
              </div>
            ) : (
              <div>
                <ModalImage
                  onError={() => <div>errorrr</div> }
                
                  small={file}
                  large={file}
                  alt={label}
                />
              </div>
            )}
          </div>
        ))}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center mt-8 p-2 w-full"
          >
            <FileInputForm
              control={form.control}
              label="Identificacion"
              name="file"
            />
            <div className="text-xs text-muted-foreground mt-4">
              16:9 aspect ratio recommended
            </div>

            <Button
              disabled={isSubmitting || !isValid}
              className="w-full max-w-[500px] gap-3"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? "Actualizar" : "Crear"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
