"use client";

import { useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { pdfjs } from "react-pdf";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMonths } from "date-fns";
import { Certificate } from "@prisma/client";

import { DocumentCertificateTemplate } from "@/app/(main)/_components/document-certificate-template";
import { formatDateOf } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

export const ViewCertificatePdf = ({
  certificate,
  baseUrl,
}: {
  certificate: Certificate;
  baseUrl?: string;
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);

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
    <div className="flex-1 w-full min-h-screen min-w-max relative">
      <div className="absolute top-0 left-0 w-full h-full bg-transparent z-20" />
      <PDFViewer
        showToolbar={false}
        style={{ width: "100%", height: "1200px" }}
      >
        <DocumentCertificateTemplate
          fullname={certificate.collaboratorFullname}
          numDoc={certificate.collaboratorNumDoc}
          typeDoc={certificate.collaboratorTypeDoc}
          level={certificate.levelName}
          course={certificate.courseName}
          levelHours={"" + certificate.levelHours}
          resolution={certificate.resolution}
          endDate={formatDateOf(certificate.certificateDate!)}
          expeditionDate={formatDateOf(certificate.expeditionDate!)}
          expireDate={formatDateOf(
            addMonths(
              certificate.certificateDate!,
              certificate?.monthsToExpire!
            )
          )}
          certificateId={certificate.id}
          companyName={certificate.companyName}
          companyNit={certificate.companyNit}
          arlName={certificate.collaboratorArlName}
          legalRepresentative={certificate.legalRepresentative}
          fileUrl={`${baseUrl}/verificar-certificado/${certificate.id}`}
        />
      </PDFViewer>
    </div>
  );
};
