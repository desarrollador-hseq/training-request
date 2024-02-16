"use client";

import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { Certificate } from "@prisma/client";
import { DocumentCertificateTemplate } from "@/app/(main)/_components/document-certificate-template";
import { formatDateCert, formatDateOf } from "@/lib/utils";

export const ShowCertificate = ({
  certificate,
  baseUrl,
}: {
  certificate: Certificate;
  baseUrl: string;
}) => {
  console.log({certificatearl: certificate.collaboratorArlName, legal: certificate.legalRepresentative})
  return (
    <div>
      <PDFViewer style={{ width: "100%", height: "1200px" }}>
        <DocumentCertificateTemplate
          fullname={certificate.collaboratorFullname}
          numDoc={certificate.collaboratorNumDoc}
          typeDoc={certificate.collaboratorTypeDoc}
          level={certificate.levelName}
          course={certificate.courseName}
          levelHours={""+ certificate.levelHours}
          resolution={certificate.resolution}
          endDate={formatDateOf(certificate.certificateDate!)}
          arlName={certificate.collaboratorArlName}
          certificateId={certificate.id}
          fileUrl={`${baseUrl}/verificar-certificado/${certificate.id}`}
          expeditionDate={formatDateCert(certificate.expeditionDate!)}
          expireDate={certificate.dueDate && formatDateOf(certificate.dueDate)}
          coachName={certificate.coachName}
          coachPosition={certificate.coachPosition}
          coachImgSignatureUrl={certificate.coachImgSignatureUrl}
          coachLicence={certificate.coachLicence}
        />
      </PDFViewer>
    </div>
  );
};
