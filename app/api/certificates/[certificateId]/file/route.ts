
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { certificateId: string } }) {
    const session = await getServerSession(authOptions)
    try {
        if (!session || session.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })
        if (!params.certificateId) return new NextResponse("Bad request", { status: 400 })

        const values = await req.json()
       

        const certificate = await db.certificate.update({
            where: {
                id: params.certificateId
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(certificate)

    } catch (error) {
        console.log("[CERTIFICATE-FILE-ADD-EDIT]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }

}
