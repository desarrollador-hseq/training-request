import { db } from "@/lib/db";
import React from "react";
import { ViewCertificatePdf } from "./_components/view-certificate-pdf";
import { Certificate, Course, CourseLevel } from "@prisma/client";
import { addMonths, format } from "date-fns";
import { es } from "date-fns/locale";

const VerifyCertificate = async ({
  params,
}: {
  params: { certificateId: string };
}) => {
  let certificate:
    | (Certificate & {
        collaborator:
          | {
              fullname: string | null;
              docType: string | null;
              numDoc: string | null;
              company:
                | { businessName: string | undefined | null }
                | null
                | undefined;
            }
          | null
          | undefined;
        courseLevel:
          | (CourseLevel & { course: Course | null })
          | null
          | undefined;
      })
    | null = null;
  let error: string | null = null;
  try {
    certificate = await db.certificate.findUnique({
      where: {
        id: params.certificateId,
        active: true,
      },
      include: {
        courseLevel: {
          include: {
            course: true,
          },
        },
        collaborator: {
          select: {
            fullname: true,
            docType: true,
            numDoc: true,
            company: {
              select: {
                businessName: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    error = error;
  }

  console.log({ certificate });
  return (
    <div className="min-h-[calc(100vh-40px)]">
      <nav className="h-[40px] bg-primary flex justify-center items-center text-white">
        <h3> Verificar Cerificado</h3>
      </nav>
      {error ? (
        <div>
          Ha ocurrido un error al consultar el certificado, por favor intentelo
          nuevamente o en otro momento
        </div>
      ) : certificate ? (
        certificate?.fileUrl ? (
          <ViewCertificatePdf fileUrl={certificate?.fileUrl} />
        ) : (
          <div className="w-full h-full flex justify-center items-center mt-10 ">
            <div className="flex flex-col gap-2 w-[500px] bg-secondary p-3 rounded-sm shadow-sm">
              <div className="flex flex-col bg-white  p-2 rounded-sm">
                <span className="font-bold">nombre</span>
                {certificate?.collaborator?.fullname}
              </div>
              <div className="flex flex-col bg-white  p-2 rounded-sm">
                <span className="font-bold">Documento</span>
                {certificate?.collaborator?.docType}{" "}
                {certificate?.collaborator?.numDoc}
              </div>
              <div className="flex flex-col bg-white  p-2 rounded-sm">
                <span className="font-bold">Empresa</span>
                {certificate?.collaborator?.company?.businessName}
              </div>
              <div className="flex flex-col bg-white  p-2 rounded-sm">
                <span className="font-bold">Curso</span>
                {certificate?.courseLevel?.course?.name}
              </div>
              <div className="flex flex-col bg-white  p-2 rounded-sm">
                <span className="font-bold">Nivel</span>
                {certificate?.courseLevel?.name}
              </div>
              <div className="flex flex-col bg-white  p-2 rounded-sm">
                <span className="font-bold">Fecha minima para reentrenamiento</span>
                {certificate?.monthsToExpire &&
                  format(
                    addMonths(new Date(), certificate?.monthsToExpire),
                    "P",
                    {
                      locale: es,
                    }
                  )}
              </div>
            </div>
          </div>
        )
      ) : (
        <div>Certificado no encontrado</div>
      )}
    </div>
  );
};

export default VerifyCertificate;
