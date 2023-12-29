
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"
import axios from "axios"


export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    const session = await getServerSession(authOptions)
    try {
        const values = await req.json()
        
        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        const companyId = session.user.id
    const existingCollaborator = await db.collaborator.findFirst({
            where: { numDoc: values.numDoc, companyId, active: true }
        });
        
        if (existingCollaborator) {
            return new NextResponse("Número de documento ya registrado", { status: 400 });
        }
        
        const collaborator = await db.collaborator.create({
            data: {
                companyId, ...values
            }
        })
        
        return NextResponse.json(collaborator)
        
    } catch (error) {
        console.log("[COLLABORATOR-CREATE]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}

