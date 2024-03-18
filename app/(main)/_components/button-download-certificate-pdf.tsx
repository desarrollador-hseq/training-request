"use client";

import {
  cn,
  formatDateCert,
  formatDateOf,
  removeSpecialChars,
} from "@/lib/utils";
import { Certificate } from "@prisma/client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { DocumentCertificateTemplateCues } from "./document-certificate-template-cues";
import { DocumentCertificateTemplate } from "./document-certificate-template";
import { Download, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Button Download Certificate
export const ButtonDownloadCertificatePdf = ({
  certificate,
  baseUrl,
}: {
  certificate: Certificate;
  baseUrl: string;
}) => {
  const [isClient, setIsClient] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if(!certificate.collaboratorFullname || !certificate.collaboratorNumDoc) return
    const nameClean = removeSpecialChars(certificate.collaboratorFullname)
    setName(`${
      certificate.collaboratorNumDoc
    }-${nameClean.replace(/\s/g, "-")}`);
    
  }, [certificate?.collaboratorFullname, certificate.collaboratorNumDoc])
  
  return (
    <>
      {isClient ? (
        <PDFDownloadLink
          document={
            certificate.courseName === "Mercancías peligrosas" ? (
              <DocumentCertificateTemplateCues
                course={certificate.courseName}
                fullname={certificate.collaboratorFullname}
                numDoc={certificate.collaboratorNumDoc}
                typeDoc={certificate.collaboratorTypeDoc}
                levelHours={`${certificate.levelHours}`}
                fileUrl={`${baseUrl}/verificar-certificado/${certificate.id}`}
                certificateId={certificate.id}
                expireDate={
                  certificate.dueDate && formatDateOf(certificate.dueDate!)
                }
                expeditionDate={
                  certificate.expeditionDate &&
                  formatDateCert(certificate.expeditionDate)
                }
              />
            ) : (
              <DocumentCertificateTemplate
                course={certificate.courseName}
                fullname={certificate.collaboratorFullname}
                numDoc={certificate.collaboratorNumDoc}
                typeDoc={certificate.collaboratorTypeDoc}
                level={certificate.levelName}
                levelHours={`${certificate.levelHours}`}
                resolution={certificate.resolution}
                companyName={certificate.companyName}
                companyNit={certificate.companyNit}
                legalRepresentative={certificate.legalRepresentative}
                arlName={certificate.collaboratorArlName}
                fileUrl={`${baseUrl}/verificar-certificado/${certificate.id}`}
                certificateId={certificate.id}
                expireDate={
                  certificate.dueDate && formatDateOf(certificate.dueDate!)
                }
                endDate={
                  certificate.certificateDate
                    ? formatDateOf(certificate.certificateDate)
                    : ""
                }
                expeditionDate={
                  certificate.expeditionDate &&
                  formatDateCert(certificate.expeditionDate)
                }
                coachName={certificate.coachName}
                coachPosition={certificate.coachPosition}
                coachLicence={certificate.coachLicence}
                coachImgSignatureUrl={certificate.coachImgSignatureUrl}
              />
            )
          }
          fileName={`${name}`}
        >
          {({ blob, url, loading, error }) => {
            return (
              <div className="">
                {loading ? (
                  <div className="flex self-center justify-self-center">
                    <Loader2 className="text-secondary w-12 h-12 animate-spin" />
                  </div>
                ) : (
                  <div
                    className={cn(
                      buttonVariants({
                        className: "bg-primary hover:bg-primary font-normal text-sm",
                      }),
                      "px-3 py-3 text-lg"
                    )}
                  >
                    <Download className="mr-3" />
                    Descargar
                  </div>
                )}
              </div>
            );
          }}
        </PDFDownloadLink>
      ) : null}
    </>
  );
};
