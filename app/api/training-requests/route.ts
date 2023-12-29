import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"


export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    const values = await req.json()
    try {

        const companyId = session.user.id

        const request = await db.trainingRequest.create({
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

