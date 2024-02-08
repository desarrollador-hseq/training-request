import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { Collaborator } from "@prisma/client";

export async function POST(
    req: Request,
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const values = await req.json();

        console.log({values})

        if (!session.user.id) return new NextResponse("Unauthorized", { status: 401 });

        const successfulInserts: Collaborator[] = [];
        const failedInserts: { data: Collaborator; error: Error | unknown }[] = [];


        for (const collaborator of values) {
            try {
                // Verifica si ya existe un empleado con el mismo correo electrónico.

                if(!collaborator.fullname ) {
                    throw new Error(`El nombre completo es obligatorio`);
                }

                if(!collaborator.numDoc ) {
                    throw new Error(`El numero de documento es obligatorio`);
                }

                const existingEmployee = await db.collaborator.findFirst({
                    where: {
                        numDoc: collaborator.numDoc,
                        companyId: session.user.id
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
        //   // Realiza inserciones individuales y captura los resultados.
        //   for (const user of values) {
        //     try {
        //       // 1. Inserta el usuario.
        //       const insertedUser = await db.user.create({ data: user });
        //       successfulInserts.push(insertedUser);

        //       // 2. Obtén el ID del usuario insertado.
        //       const userId = insertedUser.id;

        //       // 3. Inserta un registro en la tabla `companyRole`.
        //       await db.companyRole.create({
        //         data: {
        //           userId: userId,
        //           companyId: companyId,
        //           role: "USER"
        //         },
        //       });
        //     } catch (error) {
        //       // Captura objetos que generaron errores.
        //       failedInserts.push({ data: user, error });
        //     }
        //   }

        console.log({failedInserts})


        // Devuelve los resultados al componente.
        return NextResponse.json({ successfulInserts, failedInserts });
        // return res.status(200).json({ successfulInserts, failedInserts });
    } catch (error) {
        console.log("[COMPANY_EMPLOYEE_CREATE_MANY]", error);
        return new NextResponse("Internal Errorr", { status: 500 });
    }
}
