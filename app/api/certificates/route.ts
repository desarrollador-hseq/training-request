
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { db } from "@/lib/db"
import { formatDateSm } from "@/lib/utils"



export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    try {
        if (!session || session.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })

        const values = await req.json()
        const requiredProperties = [
            "collaboratorFullname",
            "collaboratorNumDoc",
            "collaboratorTypeDoc",
            "collaboratorArlName",
            "companyName",
            "companyNit",
            "legalRepresentative",
            "courseName",
            "courseLevelId",
            "resolution",
            "collaboratorId",
            "coachId",
            "levelName",
            "levelHours",
            "certificateDate",
            "expeditionDate",

            // "monthsToExpire",
            "coachName",
            "coachPosition",
            "coachLicence",
            "coachImgSignatureUrl",
        ];

        const missingProperty = requiredProperties.find(prop => !(prop in values));

        if (missingProperty) {
            return new NextResponse(`Missing property: ${missingProperty}`, { status: 400 });
        }

        const { trainingRequestId, levelHours, ...otherValues } = values
        const levelHoursParse = parseInt(levelHours) ?? 8;

        // Usar transacción para asegurar integridad de datos
        const result = await db.$transaction(async (tx) => {
            // Verificar que existe la solicitud de entrenamiento
            const trainingRequestCollaborator = await tx.trainingRequestCollaborator.findUnique({
                where: {
                    collaboratorId_trainingRequestId: {
                        collaboratorId: otherValues.collaboratorId,
                        trainingRequestId: trainingRequestId,
                    }
                }
            })

            if (!trainingRequestCollaborator) {
                throw new Error(`No se encontro una solicitud asociada a este colaborador`);
            }

            // Crear el certificado
            const certificate = await tx.certificate.create({
                data: {
                    ...otherValues,
                    levelHours: levelHoursParse
                }
            })

            // Verificar que el certificado se creó correctamente con ID
            if (!certificate.id) {
                throw new Error("Error al crear el certificado: ID no generado");
            }

            // Actualizar el estado de certificación
            const trainingUpdated = await tx.trainingRequestCollaborator.update({
                where: {
                    collaboratorId_trainingRequestId: {
                        collaboratorId: otherValues.collaboratorId,
                        trainingRequestId: trainingRequestId
                    }
                },
                data: {
                    wasCertified: true
                }
            })

            // Crear el evento del certificado
            const certificateData = {
                data: `colId:${certificate.collaboratorId} - name:${certificate.collaboratorFullname} - doc:${certificate.collaboratorTypeDoc}${certificate.collaboratorNumDoc} - ARL:${certificate.collaboratorArlName} - com:${certificate.companyName} -  NIT:${certificate.companyNit} - legRep:${certificate.legalRepresentative} - course:${certificate.courseName} - level:${certificate.levelName} - res:${certificate.resolution} -  hours:${certificate.levelHours} - start:${certificate.startDate ? formatDateSm(certificate.startDate) : ""} -  end: ${certificate.certificateDate ? formatDateSm(certificate.certificateDate) : ""} - exp:${certificate.expeditionDate ? formatDateSm(certificate.expeditionDate) : ""} - due:${certificate.dueDate ? formatDateSm(certificate.dueDate) : ""} - coach:${certificate.coachName} - pos:${certificate.coachPosition} - lic:${certificate.coachLicence}`,
            };

            await tx.certificateEvent.create({
                data: {
                    eventType: "CREATED",
                    adminId: session.user.id!,
                    certificateId: certificate.id,
                    certificateData: JSON.stringify(certificateData),
                }
            })

            return { certificate, trainingUpdated };
        });

        return NextResponse.json(result.certificate)

    } catch (error) {
        console.log("[CERTIFICATE-CREATE]", error)
        
        // Manejar errores específicos de la transacción
        if (error instanceof Error) {
            if (error.message.includes("No se encontro una solicitud")) {
                return new NextResponse(error.message, { status: 400 });
            }
            if (error.message.includes("Error al crear el certificado")) {
                return new NextResponse(error.message, { status: 500 });
            }
        }
        
        return new NextResponse("Internal Error", { status: 500 })
    }
}
