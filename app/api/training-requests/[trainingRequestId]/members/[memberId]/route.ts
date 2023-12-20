import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";


export async function DELETE(req: Request, { params }: { params: { trainingRequestId: string, memberId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const { trainingRequestId, memberId } = params;
    
        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        if (!trainingRequestId || !memberId) return new NextResponse("Not Found", { status: 404 })

        const memberRemoved = await db.trainingRequest.update({
            where: {
                id: trainingRequestId,
              },
              data: {
                members: {
                  disconnect: [{ id: memberId }],
                },
              },
        })

        return NextResponse.json(memberRemoved)

    } catch (error) {
        console.log("[REMOVED_MEMBER_TRAINING]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}