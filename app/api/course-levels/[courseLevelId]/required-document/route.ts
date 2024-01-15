
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { courseLevelId: string } }) {

    try {

        const documentsRequired = await db.requiredDocument.findMany({
            where: {
                courseLevelId: params.courseLevelId,
                active: true
            }
        })

        return NextResponse.json(documentsRequired)

    } catch (error) {
        console.log("[GET-DOCUMENTS-COURSELEVEL]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}