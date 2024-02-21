import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CertificatePreview } from "./_components/certificate-preview";
import { TitleOnPage } from "@/components/title-on-page";
import { SimpleModal } from "@/components/simple-modal";
import { ModalCertificateWasCreated } from "./_components/modal-certificate-was-created";

interface GenerateCertificatePageProps {
  params: { collaboratorId: string; requestId: string };
}

const crumbs = [
  { label: "certificados", path: "certificados" },
  { label: "Generar", path: "generar" },
];

const GenerateCertificatePage = async ({
  params,
}: GenerateCertificatePageProps) => {
  const baseUrl = process.env.NEXTAUTH_URL;
  const trainingCollaborator = await db.trainingRequestCollaborator.findUnique({
    where: {
      collaboratorId_trainingRequestId: {
        collaboratorId: params.collaboratorId,
        trainingRequestId: params.requestId,
      },
    },
    include: {
      collaborator: {
        include: {
          company: true,
        },
      },
      courseLevel: {
        include: {
          course: true,
        },
      },
    },
  });

  const coaches = await db.coach.findMany({
    where: {
      active: true,
    },
  });

  if (!trainingCollaborator) {
    redirect("/admin/entrenamiento/certificados");
  }

  const certificateCreated = await db.certificate.findFirst({
    where: {
      collaboratorId: params.collaboratorId,
      courseLevelId: trainingCollaborator?.courseLevel?.id,
      collaborator: {
        companyId: trainingCollaborator?.collaborator.companyId,
      },
    },
  });

  return (
    <div>
      {trainingCollaborator && (
        <TitleOnPage
          text={`Generar certificado: (${trainingCollaborator?.collaborator.fullname} - ${trainingCollaborator?.courseLevel?.course.name} - ${trainingCollaborator.courseLevel?.name})`}
          bcrumb={crumbs}
        />
      )}
      {certificateCreated && (
       <ModalCertificateWasCreated />
      )}
      <CertificatePreview
       certificateWasCreatedId={certificateCreated?.id}
        collaborator={trainingCollaborator.collaborator}
        courseLevel={trainingCollaborator.courseLevel}
        endDate={trainingCollaborator.endDate}
        trainingRequestId={trainingCollaborator.trainingRequestId}
        coaches={coaches}
        baseUrl={`${baseUrl}`}
      />
    </div>
  );
};

export default GenerateCertificatePage;
