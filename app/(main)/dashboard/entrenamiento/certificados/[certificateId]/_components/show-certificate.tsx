"use client";

import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { Certificate } from "@prisma/client";
import {
  DocumentCertificateTemplateV1,
  DocumentCertificateTemplateV2,
} from "@/app/(main)/_components/certificate-template";

import { ButtonDownloadCertificatePdf } from "@/app/(main)/_components/button-download-certificate-pdf";

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
    <div className="w-full">
      <div className="my-3 w-full justify-end flex ">
        <ButtonDownloadCertificatePdf
          baseUrl={baseUrl}
          certificate={certificate}
        />
      </div>
     
      {isClient && (
        <PDFViewer
          showToolbar={false}
          style={{ width: "100%", height: "856px" }}
        >
          {certificate.expeditionDate && certificate.expeditionDate >= new Date("2025-09-01") ? (
            <DocumentCertificateTemplateV2
              certificate={certificate}
              baseUrl={baseUrl}
            />
          ) : (
            <DocumentCertificateTemplateV1
              certificate={certificate}
              baseUrl={baseUrl}
            />
          )}
        </PDFViewer>
      )}
    </div>
  );
};
