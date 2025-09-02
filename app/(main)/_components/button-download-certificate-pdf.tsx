"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  cn,
  removeSpecialChars,
} from "@/lib/utils";
import { Certificate } from "@prisma/client";
import { Download, Loader2 } from "lucide-react";
import { DocumentCertificateTemplateV1, DocumentCertificateTemplateV2 } from "./certificate-template";
import { buttonVariants } from "@/components/ui/button";

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
    if (!certificate.collaboratorFullname || !certificate.collaboratorNumDoc)
      return;
    const nameClean = removeSpecialChars(certificate.collaboratorFullname);
    setName(
      `${certificate.collaboratorNumDoc}-${nameClean.replace(/\s/g, "-")}`
    );
  }, [certificate?.collaboratorFullname, certificate.collaboratorNumDoc]);

  return (
    <>
      {isClient ? (
        <PDFDownloadLink
          document={
            certificate.expeditionDate && certificate.expeditionDate > new Date("2025-09-01") ? (
              <DocumentCertificateTemplateV2
                certificate={{ ...certificate, id: certificate.id }}
                baseUrl={baseUrl}
              />
            ) : (
              <DocumentCertificateTemplateV1
              certificate={{ ...certificate, id: certificate.id }}
              baseUrl={baseUrl}
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
                        className:
                          "bg-primary hover:bg-primary font-normal text-sm",
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
