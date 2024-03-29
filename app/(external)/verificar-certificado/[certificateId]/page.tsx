import { addMonths, format } from "date-fns";
import { es } from "date-fns/locale";
import { FileX2 } from "lucide-react";
import { ViewCertificatePdf } from "./_components/view-certificate-pdf";
import { Card, CardHeader } from "@/components/ui/card";
import { db } from "@/lib/db";
import { SubtitleSeparator } from "@/components/subtitle-separator";

const VerifyCertificate = async ({
  params,
}: {
  params: { certificateId: string };
}) => {
  // let certificate: Certificate | null;
  let error: string | null = null;

  const baseUrl = process.env.NEXTAUTH_URL;

  const certificate = await db.certificate.findUnique({
    where: {
      id: params.certificateId,
      active: true,
    },
  });

  return (
    <div className="min-h-[calc(100vh-40px)] ">
      <SubtitleSeparator text="Verificar Cerificado" />

      {certificate ? (
        <div className="flex flex-col mx-auto max-w-[1200px]">
          <div className="flex justify-center gap-2 w-full bg-primary p-2 shadow-sm">
            <div className="flex flex-col bg-white p-2 rounded-sm text-xs">
              <span className="font-bold">nombre</span>
              {certificate?.collaboratorFullname}
            </div>
            <div className="flex flex-col bg-white  p-2 rounded-sm text-xs">
              <span className="font-bold">Documento</span>
              {certificate?.collaboratorTypeDoc}{" "}
              {certificate?.collaboratorNumDoc}
            </div>
            <div className="flex flex-col bg-white  p-2 rounded-sm text-xs">
              <span className="font-bold">Empresa</span>
              {certificate?.companyName}
            </div>
            <div className="flex flex-col bg-white  p-2 rounded-sm text-xs">
              <span className="font-bold">Curso</span>
              {certificate?.courseName}
            </div>
            <div className="flex flex-col bg-white  p-2 rounded-sm text-xs">
              <span className="font-bold">Nivel</span>
              {certificate?.levelName}
            </div>
            <div className="flex flex-col bg-white  p-2 rounded-sm text-xs">
              <span className="font-bold">
                Fecha minima para reentrenamiento
              </span>
              {certificate?.dueDate &&
                format(
                  certificate.dueDate,
                  "P",
                  {
                    locale: es,
                  }
                )}
            </div>
          </div>
          <ViewCertificatePdf certificate={certificate} baseUrl={baseUrl} />
        </div>
      ) : (
        <div className="w-full h-full min-h-[calc(100vh-80px)] flex justify-center items-center">
          <Card>
            <CardHeader className="text-red-600 text-center flex flex-col items-center gap-3">
              <FileX2 className="w-9 h-9" />
              <h3 className="font-bold text-2xl uppercase">
                Certificado no encontrado
              </h3>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;
