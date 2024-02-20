import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { processAndDeleteFile, processAndUploadFile } from "@/lib/uploadFile";


export async function POST(req: Request, { params }: { params: { collaboratorId: string, courseLevelId: string, documentRequiredId: string } }) {
    const session = await getServerSession(authOptions)
    try {
        if (!session) return new NextResponse("Unauthorized", { status: 401 })
       
        const collaboratorCourseLevelDocument = await db.collaboratorCourseLevelDocument.findFirst({
            where: {
                collaboratorId: params.collaboratorId,
                courseLevelId: params.courseLevelId,
                requiredDocumentId: params.documentRequiredId
            }

        })

        console.log({collaboratorCourseLevelDocument})

        if (!collaboratorCourseLevelDocument) return new NextResponse("Registro de colaborador y documento no encontrado", { status: 403 })

        const { file, url, error, field, ubiPath } = await processAndUploadFile(req);

        if (error) {
            return new NextResponse(error.toString(), { status: 400 });
        }
        if (!file) {
            return new NextResponse("Archivo no encontrado", { status: 400 });
        }
        const campo = collaboratorCourseLevelDocument.documentLink as string

        if (campo) {
            const urlLastPath = new URL(campo).pathname.substring(1).split("/").pop()
            const { ok } = await processAndDeleteFile(ubiPath, `${urlLastPath}`)
        }

        const collaboratorUpdated = await db.collaboratorCourseLevelDocument.update({
            where: {
                id: collaboratorCourseLevelDocument.id
            },
            data: {
                documentLink: url
            }
        })

        return NextResponse.json({
            collaborator: collaboratorUpdated
        })
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Errorr: " + error, { status: 500 })
    }
}