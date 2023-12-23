


import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../../../auth/[...nextauth]/route"



export async function GET(req: Request, { params }: { params: { courseId: string } }) {
    const session = await getServerSession(authOptions)
    try {
        

        if(!session) return new NextResponse("Unauthorized", {status: 401})

        const coursesLevel = await db.courseLevel.findMany({
            where: {
               courseId: params.courseId
            }
        })

        return NextResponse.json(coursesLevel)
        
    } catch (error) {
        console.log("[INSPECTION-CREATE]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}