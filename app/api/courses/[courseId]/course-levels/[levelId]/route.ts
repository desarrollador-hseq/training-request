import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

export async function PATCH(req: Request, { params }: { params: { courseId: string, levelId: string} }) {
    const session = await getServerSession(authOptions)
    try {
        if (!session || session.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })
        const values = await req.json()

        const courses = await db.courseLevel.update({
            where: {
                id: params.levelId
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
