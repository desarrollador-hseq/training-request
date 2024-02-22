"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { PDFViewer } from "@react-pdf/renderer";
import { zodResolver } from "@hookform/resolvers/zod";
import { Certificate, Coach } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { InputForm } from "@/components/input-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CalendarInputForm } from "@/components/calendar-input-form";
import { DocumentCertificateTemplate } from "../../../../_components/document-certificate-template";
import { formatDateCert, formatDateOf } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubtitleSeparator } from "@/components/subtitle-separator";
import { SimpleModal } from "@/components/simple-modal";
import { useLoading } from "@/components/providers/loading-provider";

interface AddCourseFormProps {
  certificate?: Certificate | null;
  baseUrl: string;
  coaches: Coach[] | null;
  isCreate: boolean;
  certAlreadyExists: boolean;
}

const formSchema = z.object({
  collaboratorId: z.string(),
  courseLevelId: z.string(),
  coachId: z.string(),
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

  coachName: z.string(),
  coachPosition: z.string(),
  coachLicence: z.string().optional(),
  coachImgSignatureUrl: z.string(),
});

export const AddCertificateForm = ({
  certificate,
  baseUrl,
  coaches,
  isCreate,
  certAlreadyExists,
}: AddCourseFormProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();

  if (!certificate) {
    router.replace("/admin/entrenamiento/certificados");
    toast.error("Certificado no encontrado, redirigiendo...");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collaboratorId: certificate?.collaboratorId,
      courseLevelId: certificate?.courseLevelId || undefined,
      coachId: certificate?.coachId || undefined,
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
  const { setValue, getValues } = form;

  useEffect(() => {
    certificate?.coachId &&
      setValue("coachId", certificate.coachId, { shouldValidate: true });
    certificate?.coachName &&
      setValue("coachName", certificate.coachName, { shouldValidate: true });
    certificate?.coachPosition &&
      setValue("coachPosition", certificate.coachPosition, {
        shouldValidate: true,
      });
    certificate?.coachLicence &&
      setValue("coachLicence", certificate.coachLicence || undefined, {
        shouldValidate: true,
      });
    certificate?.coachImgSignatureUrl &&
      setValue("coachImgSignatureUrl", certificate.coachImgSignatureUrl!, {
        shouldValidate: true,
      });
  }, []);

  const onChangeCoach = (id: string) => {
    const coachSelected = coaches?.find((coach) => coach.id === id);
    if (!coachSelected) {
      toast.error("error al seleccionar al entrenador");
      return;
    }
    setValue("coachId", coachSelected.id, { shouldValidate: true });
    setValue("coachName", coachSelected.fullname, { shouldValidate: true });
    setValue("coachPosition", coachSelected.position, { shouldValidate: true });
    setValue("coachLicence", coachSelected.licence || undefined, {
      shouldValidate: true,
    });
    setValue("coachImgSignatureUrl", coachSelected.imgSignatureUrl!, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoadingApp(true);
    try {
      if (!isCreate) {
        await axios.patch(`/api/certificates/${certificate?.id}`, values);
        toast.info("Certificado actualizado correctamente");
      } else {
        const { data } = await axios.post(`/api/certificates/`, values);
        toast.success("Certificado creado correctamente");
      }
      // router.push(`/admin/entrenamiento/certificados`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoadingApp(false);
    }
  };
  return (
    <div className="max-w-[1500px] w-full h-full">
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
              {/* <SelectCoachCertificate
                coaches={coaches}
                certificateId={certificate?.id}
                coachId={certificate?.coachId}
              /> */}
              <div className="w-full">
                <Label className="font-bold" htmlFor="coachId">
                  Entrenador
                </Label>
                <Select
                  defaultValue={
                    certificate?.coachId ? certificate?.coachId : ""
                  }
                  onValueChange={(e) => onChangeCoach(e)}
                  // disabled={!isPending}
                >
                  <SelectTrigger id="coachId" className="w-full">
                    <SelectValue placeholder="🔴 Seleccionar Entrenador" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {coaches?.map((coach) => (
                      <SelectItem key={coach.id} value={coach.id}>
                        {coach.fullname} - {coach.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
          {certAlreadyExists ? (
            <SimpleModal
              btnDisabled={isSubmitting || !isValid}
              large={false}
              onAcept={form.handleSubmit(onSubmit)}
              textBtn="Volver a generar"
              title="¿Esta seguro que desea crear el certificado?"
            >
              <h3>
                Por favor confirme si desea crear el certificado, recuerde que
                ya se encuentra creado un certificado para este colaborador
              </h3>
            </SimpleModal>
          ) : (
            <Button
              disabled={isSubmitting || !isValid}
              className="w-full max-w-[500px] gap-3"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {!isCreate ? "Actualizar" : "Crear"}
            </Button>
          )}
        </form>
      </Form>

      <div className="relative">
        <SubtitleSeparator text="Previsualización del certificado" />

        {certificate && (
          <PDFViewer
            showToolbar={false}
            style={{ width: "100%", height: "1200px" }}
          >
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
              coachName={getValues("coachName")}
              coachPosition={getValues("coachPosition")}
              coachLicence={getValues("coachLicence")}
              coachImgSignatureUrl={getValues("coachImgSignatureUrl")}
            />
          </PDFViewer>
        )}
      </div>
    </div>
  );
};
