"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PDFViewer } from "@react-pdf/renderer";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coach } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Cloud, Loader2 } from "lucide-react";

import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { InputForm } from "@/components/input-form";
import { Button } from "@/components/ui/button";
import { SignaturePreview } from "./signature-preview";

interface AddCourseFormProps {
  coach?: Coach | null;
}
const MAX_FILE_SIZE = 1024 * 1024 * 1;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
const formSchema = z.object({
  fullname: z.string().min(1, {
    message: "Nombre del entrenador es requerido",
  }),
  position: z.string().min(1, {
    message: "Cargo del entrenador es requerido",
  }),
  licence: z.string().optional(),
  imgSignatureUrl: z.string().optional(),
  file: z
    .any()
    .optional()
    .or(z.string().optional())
    .refine((file) => file?.length !== 0, "File is required")
    .refine((files) => {
      return files?.size <= MAX_FILE_SIZE;
    }, `El tamaño maximo del archivo es de 1MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.type),
      "Solo los formtatos de .jpg, .jpeg, .png, y .pdf son aceptados"
    )
    .optional(),
});

export const AddCoachesForm = ({ coach }: AddCourseFormProps) => {
  const router = useRouter();
  const [imageUploadedUrl, setImageUploadedUrl] = useState();
  const isEdit = useMemo(() => coach, [coach]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  if (isEdit && !coach) {
    router.replace("/admin/entrenamiento/entrenadores");
    toast.error("Entrenador no encontrado, redirigiendo...");
  }

  useEffect(() => {
    setValue("imgSignatureUrl", imageUploadedUrl, { shouldValidate: true,  });
  }, [imageUploadedUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
      // Handle file upload logic here
    },
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".svg"],
    },
  });

  useEffect(() => {
    if (selectedFile) {
      setValue("file", selectedFile, { shouldValidate: true });
    }
  }, [selectedFile]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: coach?.fullname || "",
      position: coach?.position || "",
      licence: coach?.licence || "",
      imgSignatureUrl: coach?.imgSignatureUrl || "",
    },
  });
  const { setValue, getValues, watch } = form;

  const { isSubmitting, isValid } = form.formState;


  let urlImage: string;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.file) {
      const formData = new FormData();
      formData.append("file", values.file);
      formData.append("ubiPath", "entrenadores/firmas");

      try {
        const { data } = await axios.post(`/api/upload/file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
       urlImage = data.url;
      } catch (error) {
        toast.error("Ocurrió un error al subir el archivo");
      }
    }
    const { file, ...otherValues } = values;

    if(!urlImage) {
      return toast.error("sin imagen")
    }

    try {
      if (isEdit) {
        await axios.patch(`/api/coaches/${coach?.id}`, { ...otherValues, imgSignatureUrl: urlImage });
        toast.success("Entrenador actualizado correctamente");
      } else {
        const { data } = await axios.post(`/api/coaches/`, {
          ...otherValues, imgSignatureUrl: urlImage,
        });
        toast.success("Entrenador creado");
      }
      router.push(`/admin/entrenamiento/entrenadores`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    }
  };

  return (
    <div className="max-w-[1500px] w-full h-full mx-auto bg-white rounded-md shadow-sm overflow-y-hidden p-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-8 p-2"
        >
          <div className="grid grid-cols-1 gap-6 mt-1 mb-7 w-full max-w-[50%]">
            <div className="space-y-4">
              <div>
                <InputForm
                  control={form.control}
                  label="Nombre completo"
                  name="fullname"
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Cargo"
                  name="position"
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Licencia (opcional)"
                  name="licence"
                />
              </div>
            </div>

            <div
              {...getRootProps()}
              className={"dropzone w-full"}
              style={{
                background: "#4e71b185",
                borderRadius: "7px",
                border: !selectedFile ? "3px dashed #4e71b1" : "none",
                color: "white",
              }}
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center w-full"
                )}
              >
                {selectedFile && !coach ? (
                  <div className="flex w-full bg-secondary items-center justify-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200 p-4">
                    <div className="px-3 py-2 h-full flex flex-col items-center">
                      {/* <ImageIcon className="h-6 w-6 text-white" /> */}
                      <Image
                        src={URL.createObjectURL(selectedFile)}
                        alt=""
                        width={100}
                        height={100}
                      />
                      <span className="text-xs font-semibold text-slate-300 italic">
                        {" "}
                        Tipo: {selectedFile.type.split("/").pop()}
                      </span>
                    </div>
                    <p className="px-3 py-2 h-full text-sm truncate text-white font-semibold  text-ellipsis">
                      {selectedFile.name}
                    </p>
                  </div>
                ) : !selectedFile && coach && coach.imgSignatureUrl ? (
                  <div>
                    <Image
                      src={coach.imgSignatureUrl}
                      alt=""
                      width={100}
                      height={100}
                      style={{
                        width: "auto",
                        height: "auto"
                      }}
                      priority
                      
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Cloud className="h-10 w-10 text-white mb-2" />
                    <p className="mb-2 text-sm text-white">
                      <span className="font-semibold text-base">
                        Click para subir
                      </span>{" "}
                      o arrastra el archivo aquí
                    </p>
                    <p className="text-sm text-zinc-200">
                      Formatos aceptados: jpg, jpeg y png
                    </p>
                  </div>
                )}
              </div>
              <input {...getInputProps()} />
              {!selectedFile && isDragActive && (
                <p>Haga clic o arrastre un archivo para cargarlo</p>
              )}
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

      <div className="w-full flex justify-center">
      {isValid && (
        <PDFViewer
          showToolbar={false}
          style={{ width: "500px", height: "400px" }}
        >
          <SignaturePreview
            imgSignatureUrl={
              selectedFile
                ? URL.createObjectURL(selectedFile)
                :  coach?.imgSignatureUrl && coach?.imgSignatureUrl
            }
            name={getValues("fullname")}
            position={getValues("position")}
            licence={getValues("licence")}
          />
        </PDFViewer>
      )}
      </div>
    </div>
  );
};
