

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { certificateId: string, } }) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })
    const { certificateId } = params;
    try {
        if (!certificateId) return new NextResponse("Not Found", { status: 404 })


        const certificate = await db.certificate.findUnique({
            where: {
                id: certificateId
            }
        })

        if (!certificate) return new NextResponse("Certificate not found", { status: 404 })

        const certificateValidate = await db.certificate.update({
            where: {
                id: certificateId
            },
            data: {
               wasSent: false
            }
        })

        await db.certificateEvent.create({
            data: {
                eventType: "UNSEND",
                adminId:  session.user.id!,
                certificateId: certificateValidate.id,
                certificateData: JSON.stringify(certificateValidate),
            }
        })

        return NextResponse.json(certificateValidate)

    } catch (error) {
        console.log("[CERTIFICATE-UNSEND]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}