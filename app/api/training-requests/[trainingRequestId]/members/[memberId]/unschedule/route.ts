import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";


export async function PATCH(req: Request, { params }: { params: { trainingRequestId: string, memberId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    const { trainingRequestId, memberId } = params;
    try {
        const { startDate, endDate } = await req.json()
        const companyId = session.user.id
        if (!trainingRequestId || !memberId || !companyId) return new NextResponse("Not Found", { status: 404 })
        if (!startDate || !endDate) return new NextResponse("Fecha no enviada en la request", { status: 404 })

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
                isScheduled: false,
                startDate: null,
                endDate: null
            }
        })

        return NextResponse.json(request)

    } catch (error) {
        console.log("[TRAINING-REQUEST-PATCH]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}