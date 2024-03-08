import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { TrainingRequest } from "@prisma/client";


export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    try {

        const requests = await db.trainingRequest.findMany({
            where: {
                active: true,
                state: "ACTIVE"
            }
        })

        return NextResponse.json(requests)

    } catch (error) {
        console.log("[TRAINING-REQUEST-GET]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}


export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    const values = await req.json()
    let companyId: string | undefined;
    let creatorUser: string | undefined;
    let isAdmin: boolean = false;
    let request: TrainingRequest;
    try {

        if (values.companyId) {
            isAdmin = true
            companyId = values.companyId
            creatorUser = session.user.businessName;
        } else {
            companyId = session.user.id
            creatorUser = "user"
        }

        if (isAdmin) {
             request = await db.trainingRequest.create({
                data: {
                    companyId, state: "ACTIVE", activeFrom: new Date(), createdByAdmin: creatorUser, ...values
                }
            })
        } else {
            request = await db.trainingRequest.create({
                data: {
                    companyId, createdByAdmin: creatorUser, ...values
                }
            })
        }


        return NextResponse.json(request)

    } catch (error) {
        console.log("[TRAINING-REQUEST-CREATE]", error)
        return new NextResponse("Internal Errorr "  + error, { status: 500 })
    }
}

