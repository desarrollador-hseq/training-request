import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";


export async function PATCH(req: Request, { params }: { params: { collaboratorId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const { collaboratorId } = params;
        const values = await req.json()

        if (!session) return new NextResponse("Unauthorized", { status: 401 })

        console.log({first: values.companyId})

        const userSaved = await db.collaborator.findUnique({
            where: {
                id: collaboratorId
            }
        })

        if (!userSaved) return new NextResponse("Not found", { status: 404 })

        if (values.numDoc) {
            if (values.numDoc !== userSaved.numDoc) {
                const result = await db.collaborator.findFirst({
                    where: {
                        numDoc: values.numDoc,
                        companyId: values.companyId,
                        active: true,
                    }
                })
                if (result) return new NextResponse("N° documento ya se encuentra registrado", { status: 400 })
            }
        }

        const collaborator = await db.collaborator.update({
            where: {
                id: collaboratorId,
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(collaborator)

    } catch (error) {
        console.log("[COLLABORATOR_PATCH_ID]", error)
        return new NextResponse("Internal Errorr" + error, { status: 500 })
    }
}
export async function DELETE(req: Request, { params }: { params: { collaboratorId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const { collaboratorId } = params;

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        const companyId = session.user.id

        const collaborator = await db.collaborator.update({
            where: {
                id: collaboratorId,
                companyId: companyId
            },
            data: {
                active: false
            }
        })

        return NextResponse.json(collaborator)

    } catch (error) {
        console.log("[COURSES_ID]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}