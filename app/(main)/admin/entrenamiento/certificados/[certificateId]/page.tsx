import { redirect } from "next/navigation";
import { AddCertificateForm } from "./add-certificate-form";
import { db } from "@/lib/db";
import { CertificatePreview } from "../generar/[collaboratorId]/[requestId]/_components/certificate-preview";
import { DocumentCertificateTemplate } from "../generar/[collaboratorId]/[requestId]/_components/document-certificate-template";
import { formatDateOf } from "@/lib/utils";
import { PDFViewer } from "@react-pdf/renderer";

const EditCertificate = async ({
  params,
}: {
  params: { certificateId: string };
}) => {
  const { certificateId } = params;

  const baseUrl = process.env.NEXTAUTH_URL

  const certificate = await db.certificate.findUnique({
    where: {
      id: certificateId,
      active: true,
    },
  });

  if (!certificate) {
    redirect("/admin/entrenamiento/cursos/");
  }

  return (
    <div>
      <AddCertificateForm certificate={certificate} baseUrl={baseUrl} />

    </div>
  );
};

export default EditCertificate;
