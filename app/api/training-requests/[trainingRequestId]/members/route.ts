import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";


export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    const values = await req.json()
    try {
        const companyId = session.user.id


        const request = await db.trainingRequestCollaborator.create({
            data: {
                companyId, ...values
            }
        })
  
        return NextResponse.json(request)
  
    } catch (error) {
        console.log("[TRAINING-REQUEST-CREATE]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
  }


