import React from "react";
import CertificateTemplate from "./_components/certificate-template";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { addMonths, format } from "date-fns";
import { es } from "date-fns/locale";
import { formatDateOf } from "@/lib/utils";

interface GenerateCertificatePageProps {
    params: {collaboratorId: string, requestId: string }
}

const GenerateCertificatePage = async ({params}: GenerateCertificatePageProps) => {

const trainingCollaborator = await db.trainingRequestCollaborator.findUnique({
    where: {
       collaboratorId_trainingRequestId: {
        collaboratorId: params.collaboratorId,
        trainingRequestId: params.requestId
       }
    },
    include: {
      collaborator: {
        include: {
          company: true
        }
      },
      courseLevel: {
        include: {
          course: true
        }
      }
    }
})

if(!trainingCollaborator) {
  redirect("/admin/entrenamiento/certificados")
}
  const baseURL = process.env.NEXTAUTH_URL;

  const certificateId = "51fadf8f-6942-4a86-8c8b-7ce519e06b5d";

  const fileUrl = `${baseURL}/verificar-certificado/${certificateId}`;

  const endDate = formatDateOf(trainingCollaborator.endDate || new Date())
  const expireDate = formatDateOf(addMonths(new Date(), trainingCollaborator.courseLevel?.monthsToExpire!))

  return (
    <div>
      <CertificateTemplate
        name={trainingCollaborator.collaborator.fullname.toUpperCase()}
        numDoc={trainingCollaborator.collaborator.numDoc}
        endDate={endDate}
        typeDoc={trainingCollaborator.collaborator.docType}
        expireDate={expireDate}
        nivel={trainingCollaborator.courseLevel?.name}
        resolution={trainingCollaborator.courseLevel?.course.resolution}
        curso={trainingCollaborator.courseLevel?.course.name}
        levelHours={trainingCollaborator.courseLevel?.hours}
        fileUrl={fileUrl}
        certificateId={certificateId}
        consecutive={30}
      />
    </div>
  );
};

export default GenerateCertificatePage;
