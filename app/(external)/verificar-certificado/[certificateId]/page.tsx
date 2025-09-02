import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  FileX2,
  User,
  FileText,
  Building,
  GraduationCap,
  Calendar,
  Clock,
  X,
  CheckCircle,
} from "lucide-react";
import { ViewCertificatePdf } from "./_components/view-certificate-pdf";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";

const VerifyCertificate = async ({
  params,
}: {
  params: { certificateId: string };
}) => {
  const baseUrl = process.env.NEXTAUTH_URL;

  const certificate = await db.certificate.findUnique({
    where: {
      id: params.certificateId,
      active: true,
    },
  });

  if (!certificate) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-red-200">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FileX2 className="w-8 h-8 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xs text-slate-500">
              El certificado solicitado no existe o ha sido desactivado.
              Verifique que el código de verificación sea correcto.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // if(certificate.dueDate && certificate.dueDate < new Date()) {
  //   return (
  //     <div className="min-h-[60vh] flex items-center justify-center">
  //       <Card className="w-full max-w-md shadow-lg border-red-200">
  //         <CardHeader className="text-center pb-4">
  //           <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
  //             <FileX2 className="w-8 h-8 text-red-600" />
  //           </div>
  //         </CardHeader>
  //         <CardContent className="text-center">
  //           <p className="text-xs text-slate-500">
  //             Certificado no válido por vencimiento
  //           </p>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen px-4 mt-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4 flex justify-between flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Verificación de Certificado
            </h1>
            <p className="text-slate-600">
              Validación oficial de capacitaciones y entrenamientos
            </p>
          </div>
          {/* Estado del Certificado */}

          {certificate.dueDate && certificate.dueDate > new Date() ? (
            <Card className="bg-green-50 border-green-200 p-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">
                    Certificado válido y verificado
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-red-50 border-red-200 p-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* <X className="w-4 h-4 text-red-600" /> */}
                  <span className="text-red-800 font-medium">
                    Reentrenamiento necesario
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {certificate ? (
          <div className="space-y-4">
            {/* Información del Certificado */}
            <Card className="shadow-lg">
              <CardHeader>
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Información del Certificado
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Información Personal */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Información Personal
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-slate-50 p-1 rounded-lg">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                          Nombre Completo
                        </p>
                        <p className="font-medium text-slate-800">
                          {certificate.collaboratorFullname}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-1 rounded-lg">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                          Documento
                        </p>
                        <p className="font-medium text-slate-800">
                          {certificate.collaboratorTypeDoc}{" "}
                          {certificate.collaboratorNumDoc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información del Curso */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-700 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Información del Curso
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-slate-50 p-1 rounded-lg">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                          Curso
                        </p>
                        <p className="font-medium text-slate-800">
                          {certificate.courseName}
                        </p>
                      </div>
                      {certificate.levelName && (
                        <div className="bg-slate-50 p-1 rounded-lg">
                          <p className="text-xs text-slate-500 uppercase tracking-wide">
                            Nivel
                          </p>
                          <Badge variant="secondary">
                            {certificate.levelName}
                          </Badge>
                        </div>
                      )}
                      <div className="bg-slate-50 p-1 rounded-lg">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                          Horas
                        </p>
                        <p className="font-medium text-slate-800 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {certificate.levelHours} horas
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información de la Empresa */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-700 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Información Empresarial
                    </h3>
                    <div className="space-y-3">
                      {certificate.companyName && (
                        <div className="bg-slate-50 p-1 rounded-lg">
                          <p className="text-xs text-slate-500 uppercase tracking-wide">
                            Empresa
                          </p>
                          <p className="font-medium text-slate-800">
                            {certificate.companyName}
                          </p>
                        </div>
                      )}
                      {certificate.dueDate && (
                        <div className="bg-slate-50 p-1 rounded-lg">
                          <p className="text-xs text-slate-500 uppercase tracking-wide">
                            Próximo Reentrenamiento
                          </p>
                          <p className="font-medium text-slate-800 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(certificate.dueDate, "PPP", { locale: es })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vista del PDF */}
            <Card className="shadow-lg">
              <CardHeader>
                <h2 className="text-xl font-semibold text-slate-800">
                  Certificado Digital
                </h2>
                <p className="text-slate-600 text-sm">
                  Vista previa del certificado oficial en formato PDF
                </p>
              </CardHeader>
              <CardContent className="p-0 h-fit">
                <div className="relative w-fit">
                  <div className="absolute bottom-0 left-0 w-full h-full flex justify-center items-start bg-white/30 z-20">
                    {certificate.dueDate &&
                      certificate.dueDate < new Date() && (
                        <div className="bg-red-500/50 text-white  mt-5 rounded-lg w-fit p-4">
                          <p className="text-xs">
                            Es necesario reentrenamiento. (
                            {format(certificate.dueDate, "PPP", { locale: es })}
                            )
                          </p>
                        </div>
                      )}
                  </div>
                  <ViewCertificatePdf
                    certificate={certificate}
                    baseUrl={baseUrl || ""}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="min-h-[60vh] flex items-center justify-center">
            <Card className="w-full max-w-md shadow-lg border-red-200">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <FileX2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-2">
                  Certificado No Encontrado
                </h3>
                <p className="text-slate-600 text-sm">
                  El certificado solicitado no existe o ha sido desactivado.
                  Verifique que el código de verificación sea correcto.
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xs text-slate-500">
                  ID de certificado:{" "}
                  <span className="font-mono">{params.certificateId}</span>
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;
