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

        const certificate = await db.certificate.update({
            where: {
                id: params.certificateId
            },
            data: {
                ...values
            }

        })

        // Excluir campos innecesarios antes de guardar el evento
        const certificateData = {
            data: `colId:${certificate.collaboratorId} - name:${certificate.collaboratorFullname} - doc:${certificate.collaboratorTypeDoc}${certificate.collaboratorNumDoc} - ARL:${certificate.collaboratorArlName} - com:${certificate.companyName} -  NIT:${certificate.companyNit} - legRep:${certificate.legalRepresentative} - course:${certificate.courseName} - level:${certificate.levelName} - res:${certificate.resolution} -  hours:${certificate.levelHours} - start:${certificate.startDate ? formatDateSm(certificate.startDate) : ""} -  end: ${certificate.certificateDate ? formatDateSm(certificate.certificateDate) : ""} - exp:${certificate.expeditionDate ? formatDateSm(certificate.expeditionDate) : ""} - due:${certificate.dueDate ? formatDateSm(certificate.dueDate) : ""} - coach:${certificate.coachName} - pos:${certificate.coachPosition} - lic:${certificate.coachLicence}`,
        };

        await db.certificateEvent.create({
            data: {
                eventType: "UPDATED",
                adminId: session.user.id!,
                certificateId: certificate.id,
                certificateData: JSON.stringify(certificateData),
            }
        })

        return NextResponse.json(certificate)

    } catch (error) {
        console.log("[CERTIFICATE-UPDATED]", error)
        return new NextResponse("Internal Errorr" + error, { status: 500 })
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


        const certificate = await db.certificate.update({
            where: {
                id: certificateId,
            },
            data: {
                active: false
            }
        })

        await db.certificateEvent.create({
            data: {
                eventType: "DELETED",
                adminId: session.user.id!,
                certificateId: certificate.id,
                certificateData: JSON.stringify(certificate),
            }
        })

        return NextResponse.json(certificate)

    } catch (error) {
        console.log("[CERTIFICATE_DELETE_ID]", error)
        return new NextResponse("Internal Errorr" + error, { status: 500 })
    }
}

