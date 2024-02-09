"use client";

import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { Certificate } from "@prisma/client";
import { DocumentCertificateTemplate } from "@/app/(main)/_components/document-certificate-template";
import { formatDateOf } from "@/lib/utils";
import { addMonths } from "date-fns";

export const ShowCertificate = ({
  certificate,
  baseUrl,
}: {
  certificate: Certificate;
  baseUrl: string;
}) => {
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
          expeditionDate={formatDateOf(certificate.expeditionDate!)}
          expireDate={formatDateOf(
            addMonths(
              certificate.certificateDate || certificate.createdAt,
              certificate?.monthsToExpire!
            )
          )}
        />
      </PDFViewer>
    </div>
  );
};
