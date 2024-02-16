"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Certificate, Coach, Course } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { InputForm } from "@/components/input-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CalendarInputForm } from "@/components/calendar-input-form";
import { DocumentCertificateTemplate } from "../../../../../_components/document-certificate-template";
import { formatDateCert, formatDateOf } from "@/lib/utils";
import { PDFViewer } from "@react-pdf/renderer";
import { SelectCoachCertificate } from "./select-coach-certificate";

interface AddCourseFormProps {
  certificate?: Certificate | null;
  baseUrl: string ;
  coaches: Coach[] | null
}

const formSchema = z.object({
  collaboratorFullname: z.string().min(1, {
    message: "Nombre del colaborador es requerido",
  }),
  collaboratorNumDoc: z.string().min(1, {
    message: "Número de documento del colaborador es requerido",
  }),
  collaboratorTypeDoc: z.string().min(1, {
    message: "Tipo de documento es requerido",
  }),
  collaboratorArlName: z.string().optional(),
  companyName: z.string().min(1, {
    message: "Nombre de empresa es requerido",
  }),
  legalRepresentative: z.string().optional(),
  companyNit: z.string().min(1, {
    message: "Nit de la empresa requerido",
  }),
  courseName: z.string().min(1, {
    message: "Nombre del curso es requerido",
  }),
  levelName: z.string().min(1, {
    message: "Nombre del nivel es requerido",
  }),
  resolution: z.string().optional(),
  levelHours: z.coerce.number({
    invalid_type_error: "Por favor ingrese un número de horas válido",
  }),
  certificateDate: z.date(),
  expeditionDate: z.date(),
  dueDate: z.date(),
});

export const AddCertificateForm = ({ certificate, baseUrl, coaches }: AddCourseFormProps) => {
  const router = useRouter();
  const isEdit = useMemo(() => certificate, [certificate]);

  if (isEdit && !certificate) {
    router.replace("/admin/entrenamiento/certificados");
    toast.error("Certificado no encontrado, redirigiendo...");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collaboratorFullname: certificate?.collaboratorFullname || "",
      collaboratorNumDoc: certificate?.collaboratorNumDoc || "",
      collaboratorTypeDoc: certificate?.collaboratorTypeDoc || "",
      collaboratorArlName: certificate?.collaboratorArlName || "",
      companyName: certificate?.companyName || "",
      legalRepresentative: certificate?.legalRepresentative || "",
      companyNit: certificate?.companyNit || "",
      courseName: certificate?.courseName || "",
      levelName: certificate?.levelName || "",
      resolution: certificate?.resolution || "",
      levelHours: certificate?.levelHours || NaN,
      certificateDate: certificate?.certificateDate || undefined,
      expeditionDate: certificate?.expeditionDate || undefined,
      dueDate: certificate?.dueDate || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit) {
        await axios.patch(`/api/certificates/${certificate?.id}`, values);
        toast.success("Curso actualizado");
      } else {
        const { data } = await axios.post(`/api/courses/`, values);
        toast.success("Curso creado");
      }
      router.push(`/admin/entrenamiento/certificados`);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1 mb-7 w-full">
            <div className="space-y-4">
              <div>
                <InputForm
                  control={form.control}
                  label="Nombre del colaborador"
                  name="collaboratorFullname"
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Tipo de documento del colaborador"
                  name="collaboratorTypeDoc"
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Número de documento del colaborador"
                  name="collaboratorNumDoc"
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Arl del colaborador"
                  name="collaboratorArlName"
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Razón social de la empresa"
                  name="companyName"
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Representante legal de la empresa"
                  name="legalRepresentative"
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="NIT de la empresa"
                  name="companyNit"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <InputForm
                  control={form.control}
                  label="Nombre del curso"
                  name="courseName"
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Nivel del curso"
                  name="levelName"
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Resolución"
                  name="resolution"
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Número de horas"
                  name="levelHours"
                  type="number"
                />
              </div>
              <SelectCoachCertificate coaches={coaches} certificateId={certificate?.id} coachId={certificate?.coachId} />
              <div>
                <CalendarInputForm
                  control={form.control}
                  label="Fecha de expedición del certificado"
                  name="expeditionDate"
                />
              </div>
              <div>
                <CalendarInputForm
                  control={form.control}
                  label="Fecha de la capacitación"
                  name="certificateDate"
                />
              </div>
              <div>
                <CalendarInputForm
                  control={form.control}
                  label="Reentrenamiento para"
                  name="dueDate"
                />
              </div>
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

      <div>
        {certificate && (
          <PDFViewer style={{ width: "100%", height: "1200px" }}>
            <DocumentCertificateTemplate
              course={certificate.courseName}
              fullname={certificate.collaboratorFullname}
              numDoc={certificate.collaboratorNumDoc}
              typeDoc={certificate.collaboratorTypeDoc}
              level={certificate.levelName}
              levelHours={`${certificate.levelHours}`}
              resolution={certificate.resolution}
              companyName={certificate.companyName}
              companyNit={certificate.companyNit}
              legalRepresentative={certificate.legalRepresentative}
              arlName={certificate.collaboratorArlName}
              fileUrl={`${baseUrl}/verificar-certificado/${certificate.id}`}
              certificateId={certificate.id}
              expireDate={formatDateOf(certificate.dueDate!)}
              endDate={formatDateOf(certificate.certificateDate!)}
              expeditionDate={formatDateCert(certificate.expeditionDate!)}

              coachName={certificate.coachName}
              coachPosition={certificate.coachPosition}
              coachLicence={certificate.coachLicence}
              coachImgSignatureUrl={certificate.coachImgSignatureUrl}
            />
          </PDFViewer>
        )}
      </div>
    </div>
  );
};
