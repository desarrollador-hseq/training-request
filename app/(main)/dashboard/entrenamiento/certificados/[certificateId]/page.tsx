import { DocumentCertificateTemplate } from "@/app/(main)/_components/document-certificate-template";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { formatDateOf } from "@/lib/utils";
import { PDFViewer } from "@react-pdf/renderer";
import { addMonths } from "date-fns";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { ShowCertificate } from "./_components/show-certificate";
import { TitleOnPage } from "@/components/title-on-page";

const crumbs = [
  { label: "certificados", path: "certificados" },
  { label: "Ver", path: "ver" },
];

const ShowCertificatePage = async ({
  params,
}: {
  params: { certificateId: string };
}) => {
  const session = await getServerSession(authOptions);

  const baseUrl = process.env.NEXTAUTH_URL;

  if (!session) redirect("/");

  const certificate = await db.certificate.findUnique({
    where: {
      id: params.certificateId,
      collaborator: {
        companyId: session.user.id,
      },
    },
  });

  return (
    <div>
      <TitleOnPage
        text={`Ver certificado: (${certificate?.collaboratorFullname} - ${certificate?.courseName} - ${certificate?.levelName})`}
        bcrumb={crumbs}
      />
      {certificate ? (
        <ShowCertificate certificate={certificate} baseUrl={baseUrl} />
      ) : (
        <div>Certificado no encontrado</div>
      )}
    </div>
  );
};

export default ShowCertificatePage;
