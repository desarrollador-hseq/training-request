import React from "react";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
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

  if (!trainingCollaborator) {
    redirect("/admin/entrenamiento/certificados");
  }
  const baseURL = process.env.NEXTAUTH_URL;

  const certificateId = "51fadf8f-6942-4a86-8c8b-7ce519e06b5d";

  const fileUrl = `${baseURL}/verificar-certificado/${certificateId}`;


  return (
    <div>
      <CertificatePreview 
        collaborator={trainingCollaborator.collaborator}
        courseLevel={trainingCollaborator.courseLevel}
        endDate={trainingCollaborator.endDate}
      />
      
    </div>
  );
};

export default GenerateCertificatePage;
