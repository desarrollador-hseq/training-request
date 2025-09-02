import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { formatDateSm } from "@/lib/utils"


export async function PATCH(req: Request, { params }: { params: { certificateId: string } }) {
    const session = await getServerSession(authOptions)
    try {
        if (!session || session.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })
        if (!params.certificateId) return new NextResponse("Bad request", { status: 400 })

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
            "levelName",
            "levelHours",
            "certificateDate",
            "expeditionDate",
            // "dueDate",
            // "monthsToExpire",
        ];

        const missingProperty = requiredProperties.find(prop => !(prop in values));

        if (missingProperty) {
            return new NextResponse(`Missing property: ${missingProperty}`, { status: 400 });
        }

        // Usar transacción para asegurar integridad de datos
        const result = await db.$transaction(async (tx) => {
            // Verificar que el certificado existe
            const existingCertificate = await tx.certificate.findUnique({
                where: {
                    id: params.certificateId
                }
            });

            if (!existingCertificate) {
                throw new Error("Certificate not found");
            }

            // Actualizar el certificado
            const certificate = await tx.certificate.update({
                where: {
                    id: params.certificateId
                },
                data: {
                    ...values
                }
            });

            // Verificar que la actualización fue exitosa
            if (!certificate.id) {
                throw new Error("Error al actualizar el certificado");
            }

            // Crear el evento de actualización
            const certificateData = {
                data: `colId:${certificate.collaboratorId} - name:${certificate.collaboratorFullname} - doc:${certificate.collaboratorTypeDoc}${certificate.collaboratorNumDoc} - ARL:${certificate.collaboratorArlName} - com:${certificate.companyName} -  NIT:${certificate.companyNit} - legRep:${certificate.legalRepresentative} - course:${certificate.courseName} - level:${certificate.levelName} - res:${certificate.resolution} -  hours:${certificate.levelHours} - start:${certificate.startDate ? formatDateSm(certificate.startDate) : ""} -  end: ${certificate.certificateDate ? formatDateSm(certificate.certificateDate) : ""} - exp:${certificate.expeditionDate ? formatDateSm(certificate.expeditionDate) : ""} - due:${certificate.dueDate ? formatDateSm(certificate.dueDate) : ""} - coach:${certificate.coachName} - pos:${certificate.coachPosition} - lic:${certificate.coachLicence}`,
            };

            await tx.certificateEvent.create({
                data: {
                    eventType: "UPDATED",
                    adminId: session.user.id!,
                    certificateId: certificate.id,
                    certificateData: JSON.stringify(certificateData),
                }
            });

            return certificate;
        });

        return NextResponse.json(result)

    } catch (error) {
        console.log("[CERTIFICATE-UPDATED]", error)

        // Manejar errores específicos de la transacción
        if (error instanceof Error) {
            if (error.message === "Certificate not found") {
                return new NextResponse(error.message, { status: 404 });
            }
            if (error.message.includes("Error al actualizar el certificado")) {
                return new NextResponse(error.message, { status: 500 });
            }
        }

        return new NextResponse("Internal Error", { status: 500 })
    }

}

export async function DELETE(req: Request, { params }: { params: { certificateId: string } }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })
        const { certificateId } = params;


        const values = await req.json()

        console.log({ values })

        if (!values.pass) {
            return new NextResponse("Error credenciales", { status: 401 })
        }

        const user = await db.company.findUnique({
            where: {
                id: session.user.id,
                active: true,
                role: "ADMIN"
            }
        })

        if (!user || !user.password) return new NextResponse("Unauthorized", { status: 401 })

        const valid = bcrypt.compareSync(values.pass, user.password)

        if (!valid) return new NextResponse("Contraseña incorrecta", { status: 400 })


        // Usar transacción para asegurar integridad de datos
        const result = await db.$transaction(async (tx) => {
            // Verificar que el certificado existe
            const existingCertificate = await tx.certificate.findUnique({
                where: {
                    id: certificateId
                }
            });

            if (!existingCertificate) {
                throw new Error("Certificate not found");
            }

            // Desactivar el certificado (soft delete)
            const certificate = await tx.certificate.update({
                where: {
                    id: certificateId,
                },
                data: {
                    active: false
                }
            });

            // Verificar que la desactivación fue exitosa
            if (!certificate.id) {
                throw new Error("Error al desactivar el certificado");
            }

            // Crear el evento de eliminación
            await tx.certificateEvent.create({
                data: {
                    eventType: "DELETED",
                    adminId: session.user.id!,
                    certificateId: certificate.id,
                    certificateData: JSON.stringify(certificate),
                }
            });

            return certificate;
        });

        return NextResponse.json(result)

    } catch (error) {
        console.log("[CERTIFICATE_DELETE_ID]", error)

        // Manejar errores específicos de la transacción
        if (error instanceof Error) {
            if (error.message === "Certificate not found") {
                return new NextResponse(error.message, { status: 404 });
            }
            if (error.message.includes("Error al desactivar el certificado")) {
                return new NextResponse(error.message, { status: 500 });
            }
        }

        return new NextResponse("Internal Error", { status: 500 })
    }
}

