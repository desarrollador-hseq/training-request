
import { NextResponse } from "next/server"
import { db } from "@/lib/db"


export async function GET(req: Request, { params }: { params: { numDoc: string } }) {

    try {
        if (!params.numDoc) return new NextResponse("Bad request", { status: 400 })

        const certificate = await db.certificate.findMany({
            where: {
                collaboratorNumDoc: params.numDoc,
                active: true
            },
        })


        return NextResponse.json(certificate)

    } catch (error) {
        console.log("[CERTIFICATE-GET-NUMDOC]", error)
        return new NextResponse("Internal Errorr" + error, { status: 500 })
    }

}
