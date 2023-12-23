

import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"



export async function GET(req: Request, { params }: { params: { courseId: string } }) {
    const session = await getServerSession(authOptions)
    try {


        if (!session) return new NextResponse("Unauthorized", { status: 401 })

        const courses = await db.course.findMany({
            where: {
                id: params.courseId
            },
            include: {
                courseLevels: true
            }
        })

        return NextResponse.json(courses)

    } catch (error) {
        console.log("[INSPECTION-CREATE]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}