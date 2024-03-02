import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { companyId: string, } }) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })
    const { companyId } = params;
    try {
        if (!companyId) return new NextResponse("Not Found", { status: 404 })


        const company = await db.company.findUnique({
            where: {
                id: companyId
            }
        })

        if (!company) return new NextResponse("Training colaborator not found", { status: 404 })

        const companyValidate = await db.company.update({
            where: {
                id: companyId
            },
            data: {
                isValid: true,
                validateBy: session.user.businessName
            }
        })

        return NextResponse.json(companyValidate)

    } catch (error) {
        console.log("[COMPANY-VALIDATE]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}