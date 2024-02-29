import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { trainingRequestId: string, memberId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    const { trainingRequestId, memberId } = params;
    try {
        const companyId = session.user.id
        if (!trainingRequestId || !memberId || !companyId) return new NextResponse("Not Found", { status: 404 })

        const trainingRequestSaved = await db.trainingRequestCollaborator.findFirst({
            where: {
                trainingRequestId: trainingRequestId, collaboratorId: memberId
            }
        })

        if (!trainingRequestSaved) return new NextResponse("Training colaborator not found", { status: 404 })

        const request = await db.trainingRequestCollaborator.update({
            where: {
                collaboratorId_trainingRequestId: {
                    trainingRequestId: trainingRequestId, collaboratorId: memberId
                }
            },
            data: {
                validDocumentBy: session.user.businessName,
                validDocument: true,
            }
        })

        return NextResponse.json(request)

    } catch (error) {
        console.log("[TRAINING-REQUEST-PATCH-DOC-VALID]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}