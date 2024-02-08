import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"


export async function POST(req: Request, { params }: { params: { levelId: string, collaboratorId: string } }) {
    const session = await getServerSession(authOptions)
    try {
        if (!session || session.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })
        if (!params.collaboratorId || !params.levelId) return new NextResponse("Bad request", { status: 400 })

        const values = await req.json()
        const requiredProperties = [
            "collaboratorFullname",
            "collaboratorNumDoc",
            "collaboratorTypeDoc",
           
            "companyName",
            "companyNit",
            "courseName",
            "levelName",
            "levelHours",
            "certificateDate",
            "expeditionDate",
            "dueDate",
            "trainingRequestId",
        ];

        const missingProperty = requiredProperties.find(prop => !(prop in values));

        if (missingProperty) {
            return new NextResponse(`Missing property: ${missingProperty}`, { status: 400 });
        }

        const {trainingRequestId, ...otherValues} = values

  

        const courses = await db.certificate.create({
            data: {
                collaboratorId: params.collaboratorId,
                courseLevelId: params.levelId,
                ...otherValues
            }

        })

        const training = await db.trainingRequestCollaborator.update({
            where: {
                collaboratorId_trainingRequestId: {
                    collaboratorId: params.collaboratorId,
                    trainingRequestId: trainingRequestId
                }
            },
            data: {
                wasCertified: true,
            }
        })

        return NextResponse.json(courses)

    } catch (error) {
        console.log("[CERTIFICATE-CREATE]", error)
        return new NextResponse("Internal Errorr"+ error, { status: 500 })
    }

}
