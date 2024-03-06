"use client";

import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { Certificate } from "@prisma/client";
import { DocumentCertificateTemplate } from "@/app/(main)/_components/document-certificate-template";
import { formatDateCert, formatDateOf } from "@/lib/utils";
import { DocumentCertificateTemplateCues } from "@/app/(main)/_components/document-certificate-template-cues";

export const ShowCertificate = ({
  certificate,
  baseUrl,
}: {
  certificate: Certificate;
  baseUrl: string;
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {isClient && (
        <PDFViewer style={{ width: "100%", height: "870px" }}>
          {certificate.courseName === "Mercancías peligrosas" ? (
            <DocumentCertificateTemplateCues
              course={certificate.courseName}
              fullname={certificate.collaboratorFullname}
              numDoc={certificate.collaboratorNumDoc}
              typeDoc={certificate.collaboratorTypeDoc}
              levelHours={"" + certificate.levelHours}
              fileUrl={`${baseUrl}/verificar-certificado/${certificate.id}`}
              certificateId={certificate.id}
              expireDate={
                certificate.dueDate && formatDateOf(certificate.dueDate)
              }
              expeditionDate={
                certificate.expeditionDate &&
                formatDateCert(certificate.expeditionDate!)
              }
            />
          ) : (
            <DocumentCertificateTemplate
              fullname={certificate.collaboratorFullname}
              numDoc={certificate.collaboratorNumDoc}
              typeDoc={certificate.collaboratorTypeDoc}
              level={certificate.levelName}
              course={certificate.courseName}
              levelHours={"" + certificate.levelHours}
              resolution={certificate.resolution}
              endDate={formatDateOf(certificate.certificateDate!)}
              arlName={certificate.collaboratorArlName}
              certificateId={certificate.id}
              fileUrl={`${baseUrl}/verificar-certificado/${certificate.id}`}
              expeditionDate={formatDateCert(certificate.expeditionDate!)}
              expireDate={
                certificate.dueDate && formatDateOf(certificate.dueDate)
              }
              coachName={certificate.coachName}
              coachPosition={certificate.coachPosition}
              coachImgSignatureUrl={certificate.coachImgSignatureUrl}
              coachLicence={certificate.coachLicence}
            />
          )}
        </PDFViewer>
      )}
    </div>
  );
};
