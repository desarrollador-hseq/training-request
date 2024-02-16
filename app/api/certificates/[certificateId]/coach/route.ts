import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { certificateId: string } }) {
    const session = await getServerSession(authOptions)
    try {
        if (!session || session.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })
        if (!params.certificateId) return new NextResponse("Bad request", { status: 400 })

        const values = await req.json()
        const requiredProperties = [
            "coachName",
            "coachId",
            "coachPosition",
            "coachImgSignatureUrl",
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

        await db.certificateEvent.create({
            data: {
                eventType: "UPDATED",
                adminId:  session.user.id!,
                certificateId: certificate.id,
                certificateData: JSON.stringify(certificate),
            }
        })

        return NextResponse.json(certificate)

    } catch (error) {
        console.log("[CERTIFICATE-UPDATE-COACH]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }

}
