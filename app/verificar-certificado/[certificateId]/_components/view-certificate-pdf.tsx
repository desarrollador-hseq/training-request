"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

export const ViewCertificatePdf = ({ fileUrl }: { fileUrl: string }) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { width, ref } = useResizeDetector();

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
    <div className="flex-1 w-full max-h-fit">
      <SimpleBar
        autoHide={false}
        className="w-full h-full m-auto max-w-[1000px]"
      >
        <div ref={ref} className="m-auto w-full h-fit flex justify-center">
          <Document
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            file={fileUrl}
            loading={
              <div className="h-full w-full flex items-center mt-10 gap-3">
                <Loader2 className="my-3 h-6 w-6 animate-spin text-primary" />
                Cargando...
              </div>
            }
            onError={() => {
              toast.error("Error al cargar PDF");
            }}
          >
            <Page
              renderTextLayer={false}
              width={width}
              pageNumber={pageNumber}
            />
          </Document>
        </div>
      </SimpleBar>
    </div>
  );
};
