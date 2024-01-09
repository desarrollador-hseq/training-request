import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";







export async function POST(req: Request, { params }: { params: { collaboratorId: string, courseLevelId: string, documentRequestId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const { collaboratorId, courseLevelId, documentRequestId } = params;
        const values = await req.json()

        if (!session) return new NextResponse("Unauthorized", { status: 401 })

        const collaboratorCourseLevelDocument = await db.collaboratorCourseLevelDocument.findFirst({
            where: {
                collaboratorId: collaboratorId,
                courseLevelId: courseLevelId,
                requiredDocumentId: documentRequestId
            }
        })
        if (collaboratorCourseLevelDocument) return new NextResponse("BAD REQUEST", { status: 400 })


        const collaboratorCourseLevelDocumentCreated = await db.collaboratorCourseLevelDocument.create({
            data: {
                collaboratorId,
                courseLevelId,
                requiredDocumentId: documentRequestId,
                ...values
            }
        })

        return NextResponse.json(collaboratorCourseLevelDocumentCreated)

    } catch (error) {
        console.log("[COLLABORATOR_COURSELEVEL_DOCUMENT_REQUEST_PATCH]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { collaboratorId: string, courseLevelId: string, documentRequestId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const { collaboratorId, courseLevelId, documentRequestId } = params;
        const values = await req.json()

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        const companyId = session.user.id

        const collaboratorCourseLevelDocument = await db.collaboratorCourseLevelDocument.findFirst({
            where: {
                collaboratorId: collaboratorId,
                courseLevelId: courseLevelId,
                requiredDocumentId: documentRequestId
            }
        })

        if (!collaboratorCourseLevelDocument) return new NextResponse("Not found", { status: 403 })


        const collaborator = await db.collaboratorCourseLevelDocument.update({
            where: {
                id: collaboratorCourseLevelDocument.id,
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(collaborator)

    } catch (error) {
        console.log("[COLLABORATOR_COURSELEVEL_DOCUMENT_REQUEST_PATCH]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}