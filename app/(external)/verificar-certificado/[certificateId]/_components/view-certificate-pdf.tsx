"use client";

import { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { pdfjs } from "react-pdf";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Certificate } from "@prisma/client";

import { DocumentCertificateTemplate } from "@/app/(main)/_components/document-certificate-template";
import { formatDateCert, formatDateOf } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { CardContent } from "@/components/ui/card";
import { DocumentCertificateTemplateCues } from "@/app/(main)/_components/document-certificate-template-cues";

export const ViewCertificatePdf = ({
  certificate,
  baseUrl,
}: {
  certificate: Certificate;
  baseUrl?: string;
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isClient, setIsClient] = useState<boolean>();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= pageNumber!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    formState: { errors },
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  return (
    <CardContent className="flex-1 w-full min-h-screen min-w-max relative">
      <div className="absolute top-0 left-0 w-full h-full bg-transparent z-20" />
      {isClient && (
        <PDFViewer
          showToolbar={false}
          style={{ width: "100%", height: "1200px" }}
        >
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
              endDate={
                certificate.certificateDate
                  ? formatDateOf(certificate.certificateDate!)
                  : ""
              }
              startDate={
                certificate.startDate
                  ? formatDateOf(certificate.startDate!)
                  : ""
              }
              arlName={certificate.collaboratorArlName}
              certificateId={certificate.id}
              fileUrl={`${baseUrl}/verificar-certificado/${certificate.id}`}
              expeditionDate={
                certificate.expeditionDate &&
                formatDateCert(certificate.expeditionDate!)
              }
              createdDate={
                certificate.expeditionDate &&
                (certificate.expeditionDate!)
              }
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
    </CardContent>
  );
};
