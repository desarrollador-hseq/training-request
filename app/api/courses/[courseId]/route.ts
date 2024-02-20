

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { db } from "@/lib/db"


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

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
    const session = await getServerSession(authOptions)
    try {
        if (!session || session.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })
        const values = await req.json()

        const courses = await db.course.update({
            where: {
                id: params.courseId
            },
            data: {
                ...values
            }

        })

        return NextResponse.json(courses)

    } catch (error) {
        console.log("[INSPECTION-CREATE]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }

}

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const { courseId } = params;

        if (!session || session.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })

        const deactivateLevels = await db.courseLevel.updateMany({
            where: {
                courseId: courseId,
            },
            data: {
                active: false
            }
        })

        const company = await db.course.update({
            where: {
                id: courseId,
            },
            data: {
                active: false
            }
        })

        return NextResponse.json(company)

    } catch (error) {
        console.log("[COMPANY_DELETE_ID]", error)
        return new NextResponse("Internal Errorr" + error, { status: 500 })
    }
}
