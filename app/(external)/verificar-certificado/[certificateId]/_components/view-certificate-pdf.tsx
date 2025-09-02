"use client";

import { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { pdfjs } from "react-pdf";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Certificate } from "@prisma/client";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { CardContent } from "@/components/ui/card";
import {
  DocumentCertificateTemplateV1,
  DocumentCertificateTemplateV2,
} from "@/app/(main)/_components/certificate-template";




export const ViewCertificatePdf = ({
  certificate,
  baseUrl,
}: {
  certificate: Certificate;
  baseUrl: string;
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
    <CardContent className="flex-1 w-full min-w-max relative">
      <div className="absolute top-0 left-0 w-full h-full bg-transparent z-20" />
      {isClient && (
        <PDFViewer
          showToolbar={false}
          // style={{ width: "800px", height: "500px" }}
          height={560}
          width={785}
        >
          {certificate.expeditionDate && certificate.expeditionDate > new Date("2025-09-01") ? (
            <DocumentCertificateTemplateV2
              certificate={{...certificate, id: certificate.id}}
              baseUrl={baseUrl || ""}
            />
          ) : (
            <DocumentCertificateTemplateV1
              certificate={{...certificate, id: certificate.id}}
              baseUrl={baseUrl || ""}
            />
          )}
        </PDFViewer>
      )}
    </CardContent>
  );
};
