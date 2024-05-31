
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

        const trainingRequestCollaborator = await db.trainingRequestCollaborator.findUnique({
            where: {
                collaboratorId_trainingRequestId: {
                    collaboratorId: otherValues.collaboratorId,
                    trainingRequestId: trainingRequestId,
                }
            }
        })

        if (!trainingRequestCollaborator) {
            return new NextResponse(`No se encontro una solicitud asociada a este colaborador`, { status: 400 });
        }


        const certificate = await db.certificate.create({
            data: {
                ...otherValues,
                levelHours: levelHoursParse
            }
        })

        const trainingUpdated = await db.trainingRequestCollaborator.update({
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

        // Excluir campos innecesarios antes de guardar el evento
        const certificateData = {
            data: `colId:${certificate.collaboratorId} - name:${certificate.collaboratorFullname} - doc:${certificate.collaboratorTypeDoc}${certificate.collaboratorNumDoc} - ARL:${certificate.collaboratorArlName} - com:${certificate.companyName} -  NIT:${certificate.companyNit} - legRep:${certificate.legalRepresentative} - course:${certificate.courseName} - level:${certificate.levelName} - res:${certificate.resolution} -  hours:${certificate.levelHours} - start:${certificate.startDate ? formatDateSm(certificate.startDate) : ""} -  end: ${certificate.certificateDate ? formatDateSm(certificate.certificateDate) : ""} - exp:${certificate.expeditionDate ? formatDateSm(certificate.expeditionDate) : ""} - due:${certificate.dueDate ? formatDateSm(certificate.dueDate) : ""} - coach:${certificate.coachName} - pos:${certificate.coachPosition} - lic:${certificate.coachLicence}`,
        };

        await db.certificateEvent.create({
            data: {
                eventType: "CREATED",
                adminId: session.user.id!,
                certificateId: certificate.id,
                certificateData: JSON.stringify(certificateData),
            }
        })

        return NextResponse.json(certificate)

    } catch (error) {
        console.log("[CERTIFICATE-CREATE]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }

}
