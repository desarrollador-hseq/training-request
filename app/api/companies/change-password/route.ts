import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs"

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)

    try {

        if (!session) return new NextResponse("Unauthorized", { status: 401 })
        const values = await req.json()

        const company = await db.company.findUnique({
            where: {
                id: session.user.id,
                active: true
            }
        })

        if (!company) {
            return new NextResponse("No se encontro a la empresa", { status: 401 });
        }

        const { actualPassword, password } = values

        if (actualPassword === password) {
            return new NextResponse("No puedes ingresar la misma contraseña", { status: 400 });
        }
        if (
            !password || !actualPassword ||
            typeof password !== 'string'
        ) {
            return new NextResponse("Por favor verifique la contraseñas enviada", { status: 400 });

        }

        const isValidPassword = bcrypt.compareSync(actualPassword!, company?.password!)

        if (!isValidPassword) {
            return new NextResponse("la contraseña actual es incorrecta", { status: 400 });
        }

        const encrypted = await hash(password, 10)

        const updatedCompany = await db.company.update({
            where: { id: company.id },
            data: {
                password: encrypted,
            },
        })

        return NextResponse.json({ updatedCompany })

    } catch (error) {
        console.log("[CHANGE-PASSWORD]", error)
        return new NextResponse("Internal Errorr" + error, { status: 500 })
    }
}