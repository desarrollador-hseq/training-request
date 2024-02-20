"use client";


import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useLoading } from "@/components/providers/loading-provider";
import { SimpleModal } from "@/components/simple-modal";

interface ButtonCreateCertificateProps {
  collaboratorId?: string;
  levelId?: string;
  fullname: string | null;
  typeDoc: string | null;
  numDoc?: string | null;
  arlName?: string | null;
  companyName: string | null;
  companyNit: string | null;
  legalRepresentative?: string | null;
  level: string | null;
  course: string | null;
  resolution?: string | null;
  monthsToExpire: number | null;
  levelHours?: number | null;
  trainingRequestId: string | null;

  coachId?: string | null;
  coachName?: string | null;
  coachPosition?: string | null;
  coachLicence?: string | null;
  coachImgSignatureUrl?: string | null;

  endDate: Date | null;
  expeditionDate: Date | null;
  expireDate: Date | null;

  btnDisabled: boolean;
}

export const ButtonCreateCertificate = ({
  collaboratorId,
  levelId,
  fullname,
  numDoc,
  typeDoc,
  arlName,
  companyName,
  companyNit,
  legalRepresentative,
  level,
  course,
  resolution,
  levelHours,

  coachId,
  coachName,
  coachPosition,
  coachLicence,
  coachImgSignatureUrl,

  expeditionDate,
  endDate,
  expireDate,
  monthsToExpire,
  trainingRequestId,

  btnDisabled,
}: ButtonCreateCertificateProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();

  const handleCreateCertificate = async () => {
    if(!collaboratorId) return
    setLoadingApp(true);

    // Crear certificado
    try {
      const { data } = await axios.post(
        `/api/certificates/course-level/${levelId}/collaborator/${collaboratorId}`,
        {
          collaboratorFullname: fullname,
          collaboratorNumDoc: numDoc,
          collaboratorTypeDoc: typeDoc,
          collaboratorArlName: arlName,
          companyName,
          companyNit,
          legalRepresentative,
          courseName: course,
          resolution,
          levelName: level,
          levelHours,

          coachId,
          coachName,
          coachPosition,
          coachLicence,
          coachImgSignatureUrl,

          expeditionDate,
          certificateDate: endDate,
          dueDate: expireDate,
          monthsToExpire,
          trainingRequestId,
        }
      );
      
      router.push(`/admin/entrenamiento/certificados/${data.id}`);

      toast.success("Certificado guardado correctamente");
    } catch (error) {
      toast.error(
        "Ocurrió un error al registrar la certificación , por favor intentalo nuevamente"
      );
    }

    setLoadingApp(false);
  };

  return (
    <SimpleModal
      btnDisabled={!!!expeditionDate || btnDisabled}
      btnClass="w-full max-w-[200px] py-8"
      textBtn={"Certificar"}
      onAcept={() => handleCreateCertificate()}
      title={"Certificar al colaborador"}
    >
      <div className="items-top flex space-x-2 border-2 border-slate-300 my-3 p-2">
        <h5>¿Desea certificar al colaborador de nombre: {fullname}</h5>
      </div>
    </SimpleModal>
  );
};
