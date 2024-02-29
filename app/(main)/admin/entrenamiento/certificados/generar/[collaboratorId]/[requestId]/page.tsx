import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CertificatePreview } from "./_components/certificate-preview";
import { TitleOnPage } from "@/components/title-on-page";
import { ModalCertificateWasCreated } from "./_components/modal-certificate-was-created";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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
  const session = await getServerSession(authOptions);

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
      active: true,
      collaborator: {
        companyId: trainingCollaborator?.collaborator.companyId,
      },
    },
  });

  return (
    <div>
      {trainingCollaborator && (
        <TitleOnPage
          className="bg-gradient-to-b from-emerald-700 to-emerald-900"
          text={`Generar certificado: (${trainingCollaborator?.collaborator.fullname} - ${trainingCollaborator?.courseLevel?.course.name} - ${trainingCollaborator.courseLevel?.name})`}
          bcrumb={crumbs}
        />
      )}
      {certificateCreated && <ModalCertificateWasCreated />}
      <CertificatePreview
        certificateWasCreatedId={certificateCreated?.id}
        collaborator={trainingCollaborator.collaborator}
        courseLevel={trainingCollaborator.courseLevel}
        endDate={trainingCollaborator.endDate}
        trainingRequestId={trainingCollaborator.trainingRequestId}
        coaches={coaches}
        baseUrl={`${baseUrl}`}
        canManageRequests={session?.user.canManageRequests || false}
        canManagePermissions={session?.user.canManagePermissions || false}
      />
    </div>
  );
};

export default GenerateCertificatePage;
