
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { courseLevelId: string } }) {

    try {

        const documentsRequired = await db.requiredDocument.findMany({
            where: {
                courseLevelId: params.courseLevelId
            }
            ,
            include: {
                collaboratorCourseLevelDocument: true
            }
            
        })
        console.log({courselevelides: params.courseLevelId, doc: documentsRequired.map(c => c.collaboratorCourseLevelDocument.map(n => n.documentLink))})

        return NextResponse.json(documentsRequired)

    } catch (error) {
        console.log("[GET-DOCUMENTS-COURSELEVEL]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}