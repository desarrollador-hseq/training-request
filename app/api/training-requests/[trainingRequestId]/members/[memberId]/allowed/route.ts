import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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
                isDisallowed: false
            }
        })

        return NextResponse.json(request)

    } catch (error) {
        console.log("[TRAINING-REQUEST-PATCH]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}