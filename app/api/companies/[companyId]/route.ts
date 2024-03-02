import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";


export async function PATCH(req: Request, { params }: { params: { companyId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const { companyId } = params;
        const values = await req.json()

        if (!session) return new NextResponse("Unauthorized", { status: 401 })

        const companySaved = await db.company.findUnique({
            where: {
                id: companyId
            }
        })

        if (!companySaved) return new NextResponse("Not found", { status: 404 })

        if (values.nit) {
            if (values.nit !== companySaved.nit) {
                const result = await db.company.findFirst({
                    where: {
                        nit: values.nit,
                        active: true,
                    }
                })
                if (result) return new NextResponse("Nit ya registrado en otra empresa", { status: 400 })
            }
        }
        if (values.email) {
            if (values.email !== companySaved.email) {
                const result = await db.company.findFirst({
                    where: {
                        email: values.email,
                        active: true,
                    }
                })
                if (result) return new NextResponse("Email ya se encuentra registrado en una empresa activa", { status: 400 })
            }
        }

        if(!companySaved.isValid && session.user.role !== "ADMIN") {
            return new NextResponse("Empresa no válidada", { status: 400 })
        }

        const company = await db.company.update({
            where: {
                id: companyId,
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(company)

    } catch (error) {
        console.log("[COMPANY_PATCH_ID]", error)
        return new NextResponse("Internal Errorr" + error, { status: 500 })
    }
}
export async function DELETE(req: Request, { params }: { params: { companyId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const { companyId } = params;

        if (!session || session.user.role !== "ADMIN") return new NextResponse("No autorizado", { status: 401 })


        const company = await db.company.update({
            where: {
                id: companyId,
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