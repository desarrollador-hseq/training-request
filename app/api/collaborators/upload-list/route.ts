import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Collaborator } from "@prisma/client";

import { db } from "@/lib/db";

export async function POST(
    req: Request,
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const values = await req.json();

        if (!session.user.id) return new NextResponse("Unauthorized", { status: 401 });

        const successfulInserts: Collaborator[] = [];
        const failedInserts: { data: Collaborator; error: Error | unknown }[] = [];


        for (const collaborator of values) {
            try {
                // Verifica si ya existe un empleado con el mismo correo electrónico.

                if (!collaborator.fullname) {
                    throw new Error(`El nombre completo es obligatorio`);
                }

                if (!collaborator.numDoc) {
                    throw new Error(`El numero de documento es obligatorio`);
                }

                const existingEmployee = await db.collaborator.findFirst({
                    where: {
                        numDoc: collaborator.numDoc,
                        companyId: session.user.id,
                        active: true,
                    },
                });

                // Si ya existe, lanza un error indicando que el correo electrónico ya está en uso.
                if (existingEmployee) {
                    throw new Error(`Ya existe un colaborador con el numero de cédula: ${existingEmployee.numDoc} `);
                }

                // Agrega el companyId al objeto de cada empleado antes de insertarlo.
                const employeeData = { ...collaborator, companyId: session.user.id };

                // Inserta el empleado con el companyId.
                const insertedEmployee = await db.collaborator.create({ data: employeeData });
                successfulInserts.push(insertedEmployee);
            } catch (error: any) {
                // Captura objetos que generaron errores.
                failedInserts.push({ data: collaborator, error: error?.message || error });
                console.error(error);
            }
        }

        console.log({ failedInserts })


        // Devuelve los resultados al componente.
        return NextResponse.json({ successfulInserts, failedInserts }, {status: 200});
        // return res.status(200).json({ successfulInserts, failedInserts });
    } catch (error) {
        console.log("[COMPANY_EMPLOYEE_CREATE_MANY]", error);
        return new NextResponse("Internal Errorr", { status: 500 });
    }
}
