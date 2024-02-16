
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CertificatePreview } from "./_components/certificate-preview";


interface GenerateCertificatePageProps {
  params: { collaboratorId: string; requestId: string };
}

const GenerateCertificatePage = async ({
  params,
}: GenerateCertificatePageProps) => {
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
      active: true
    }
  })

  if (!trainingCollaborator) {
    redirect("/admin/entrenamiento/certificados");
  }


  return (
    <div>
      <CertificatePreview 
        collaborator={trainingCollaborator.collaborator}
        courseLevel={trainingCollaborator.courseLevel}
        endDate={trainingCollaborator.endDate}
        trainingRequestId={trainingCollaborator.trainingRequestId}
        coaches={coaches}
      />
      
    </div>
  );
};

export default GenerateCertificatePage;
