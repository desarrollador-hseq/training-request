import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";




export async function PATCH(req: Request, { params }: { params: { trainingRequestId: string, memberId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return new NextResponse("Unauthorized", { status: 401 })
  const { trainingRequestId, memberId } = params;
  try {
    const values = await req.json()
    const companyId = session.user.id
    if (!trainingRequestId || !memberId || !companyId) return new NextResponse("Not Found", { status: 404 })

    const trainingRequestSaved = await db.trainingRequestCollaborator.findFirst({
      where: {
        trainingRequestId: trainingRequestId, collaboratorId: memberId
      }
    })


    if (!trainingRequestSaved) return new NextResponse("Not Found", { status: 404 })

    const request = await db.trainingRequestCollaborator.update({
      where: {
        collaboratorId_trainingRequestId: {
          trainingRequestId: trainingRequestId, collaboratorId: memberId
        }
      },
      data: {
        ...values
      }
    })

    return NextResponse.json(request)

  } catch (error) {
    console.log("[TRAINING-REQUEST-PATCH]", error)
    return new NextResponse("Internal Errorr", { status: 500 })
  }
}



export async function DELETE(req: Request, { params }: { params: { trainingRequestId: string, memberId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const { trainingRequestId, memberId } = params;

    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    if (!trainingRequestId || !memberId) return new NextResponse("Not Found", { status: 404 })


    // const trcollaborator = await db.trainingRequestCollaborator.findFirst({
    //   where: {
    //     trainingRequestId: trainingRequestId,
    //     collaboratorId: memberId,
    //   }
    // })
    // console.log({ trainingRequestId, memberId, trcollaborator })

    // if (!trcollaborator) return new NextResponse("Not found", { status: 404 })

    const memberRemoved = await db.trainingRequestCollaborator.delete({
      where: {
        collaboratorId_trainingRequestId: {
          trainingRequestId: trainingRequestId, collaboratorId: memberId
        }
      },

    });

    return NextResponse.json(memberRemoved)

  } catch (error) {
    console.log("[DELETE_MEMBER_TRAINING]", error)
    return new NextResponse("Internal Errorr", { status: 500 })
  }
}