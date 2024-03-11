"use client";

import { useEffect, useState } from "react";
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
import { DocumentCertificateTemplateCues } from "@/app/(main)/_components/document-certificate-template-cues";
import { ButtonCreateCertificate } from "../generar/[collaboratorId]/[requestId]/_components/button-create-certificate";
import { Checkbox } from "@/components/ui/checkbox";

interface AddCourseFormProps {
  certificate?: Certificate | null;
  baseUrl: string;
  companyContact?: string | null;
  companyEmail?: string | null;
  coaches: Coach[] | null;
  isCreate: boolean;
  certAlreadyExists?: boolean;
  canManagePermissions: boolean;
  trainingRequestId: string;
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
  dueDate: z.date().optional(),

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
  canManagePermissions,
  companyContact,
  companyEmail,
  trainingRequestId
}: AddCourseFormProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const [isClient, setIsClient] = useState(false);
  const [inputsDisabled, setInputsDisabled] = useState(!canManagePermissions);
  const [notifyCertificate, setNotifyCertificate] = useState(false);

  if (!certificate) {
    router.replace("/admin/entrenamiento/certificados");
    toast.error("Certificado no encontrado, redirigiendo...");
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

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
  const { setValue, getValues, watch } = form;

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
    if (inputsDisabled) {
      toast.error("No tiene permisos para proceder");
      return;
    }
    setLoadingApp(true);
    try {

      if(isCreate) {

        const { data } = await axios.post(
          `/api/certificates/`,
          {trainingRequestId, ...values}
          );
     
      toast.info("Certificado actualizado correctamente");

      if (notifyCertificate) {
        try {
          await axios.post(`/api/mail/certificate-created`, {
            certificate: {
              collaboratorFullname: values.collaboratorFullname,
              course: values.courseName,
              level:
                values.courseName === values.levelName
                  ? null
                  : values.levelName,
              companyContact: companyContact,
              certificateId: data?.id,
            },
            email: companyEmail,
          });
          toast.info("Correo enviado correctamente");
        } catch (error) {
          toast.error("Ocurrió un error al notificar por correo a la empresa");
        }
      }
    } else {
      setLoadingApp(true)
      const { data } = await axios.patch(
        `/api/certificates/${certificate?.id}`,
        values
        );
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
                  disabled={inputsDisabled}
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Tipo de documento del colaborador"
                  name="collaboratorTypeDoc"
                  disabled={inputsDisabled}
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Número de documento del colaborador"
                  name="collaboratorNumDoc"
                  disabled={inputsDisabled}
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Arl del colaborador"
                  name="collaboratorArlName"
                  disabled={inputsDisabled}
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Razón social de la empresa"
                  name="companyName"
                  disabled={inputsDisabled}
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Representante legal de la empresa"
                  name="legalRepresentative"
                  disabled={inputsDisabled}
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="NIT de la empresa"
                  name="companyNit"
                  disabled={inputsDisabled}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <InputForm
                  control={form.control}
                  label="Nombre del curso"
                  name="courseName"
                  disabled={inputsDisabled}
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Nivel del curso"
                  name="levelName"
                  disabled={inputsDisabled}
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Resolución"
                  name="resolution"
                  disabled={inputsDisabled}
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Número de horas"
                  name="levelHours"
                  type="number"
                  disabled={inputsDisabled}
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
                  <SelectTrigger
                    id="coachId"
                    className="w-full"
                    disabled={inputsDisabled}
                  >
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
                  disabled={inputsDisabled}
                />
              </div>
              <div>
                <CalendarInputForm
                  control={form.control}
                  label="Fecha de la capacitación"
                  name="certificateDate"
                  disabled={inputsDisabled}
                />
              </div>
              <div>
                <CalendarInputForm
                  control={form.control}
                  label="Reentrenamiento para"
                  name="dueDate"
                  disabled={inputsDisabled}
                />
              </div>
            </div>
          </div>
          {certAlreadyExists ? (
            <SimpleModal
              btnDisabled={isSubmitting || !isValid || inputsDisabled}
              large={false}
              onAcept={form.handleSubmit(onSubmit)}
              textBtn="Volver a generar"
              title="¿Esta seguro que desea crear el certificado?"
            >
              <h3>
                Por favor confirme si desea crear el certificado, recuerde que
                ya se encuentra creado un certificado para este colaborador
              </h3>
              <div className="items-top flex space-x-2  my-3 p-2 max-w-[300px]">
                <Checkbox
                  id="notify"
                  checked={notifyCertificate}
                  onCheckedChange={(e) => setNotifyCertificate(!!e)}
                  className=""
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="notify"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Informar a la empresa
                  </label>
                </div>
              </div>
            </SimpleModal>
          ) : isCreate ? (
            <ButtonCreateCertificate
              companyContact={companyContact}
              companyEmail={companyEmail}
              values={{ ...getValues() }}
              expeditionDate={watch("expeditionDate")}
              fullname={watch("collaboratorFullname")}
              btnDisabled={isSubmitting || !isValid}
              trainingRequestId={trainingRequestId}
            />
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
        {isClient && certificate && canManagePermissions && (
          <>
            <SubtitleSeparator text="Previsualización del certificado" />
            <PDFViewer
              showToolbar={false}
              style={{ width: "100%", height: "856px" }}
            >
              {watch("courseName") === "Mercancías peligrosas" ? (
                <DocumentCertificateTemplateCues
                  course={watch("courseName")}
                  fullname={watch("collaboratorFullname")}
                  numDoc={watch("collaboratorNumDoc")}
                  typeDoc={watch("collaboratorTypeDoc")}
                  levelHours={`${watch("levelHours")}`}
                  fileUrl={`${baseUrl}/verificar-certificado/${certificate.id}`}
                  certificateId={certificate.id}
                  expireDate={
                    watch("dueDate") && formatDateOf(watch("dueDate")!)
                  }
                  expeditionDate={
                    watch("expeditionDate") &&
                    formatDateCert(watch("expeditionDate"))
                  }
                />
              ) : (
                <DocumentCertificateTemplate
                  course={watch("courseName")}
                  fullname={watch("collaboratorFullname")}
                  numDoc={watch("collaboratorNumDoc")}
                  typeDoc={watch("collaboratorTypeDoc")}
                  level={watch("levelName")}
                  levelHours={`${watch("levelHours")}`}
                  resolution={watch("resolution")}
                  companyName={watch("companyName")}
                  companyNit={watch("companyNit")}
                  legalRepresentative={watch("legalRepresentative")}
                  arlName={watch("collaboratorArlName")}
                  fileUrl={`${baseUrl}/verificar-certificado/${certificate.id}`}
                  certificateId={certificate.id}
                  expireDate={
                    watch("dueDate") && formatDateOf(watch("dueDate")!)
                  }
                  endDate={
                    watch("certificateDate") &&
                    formatDateOf(watch("certificateDate"))
                  }
                  expeditionDate={
                    watch("expeditionDate") &&
                    formatDateCert(watch("expeditionDate"))
                  }
                  coachName={getValues("coachName")}
                  coachPosition={getValues("coachPosition")}
                  coachLicence={getValues("coachLicence")}
                  coachImgSignatureUrl={getValues("coachImgSignatureUrl")}
                />
              )}
            </PDFViewer>
          </>
        )}
      </div>
    </div>
  );
};
