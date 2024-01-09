
import { NextResponse } from "next/server";
import { s3Client } from "@/lib/s3Client";

export async function DELETE(req: Request, { params }: { params: { link: string } }) {

    if (!params.link) return new NextResponse("", { status: 400 })

    console.log({ link: params.link })
    const bucket = process.env.DO_BUCKET || "hseq"
    try {
        const input = {
            Bucket: bucket,
            Key: `entrenamiento/${params.link}`,
        };

        try {
            const res = await s3Client.deleteObject(input);
            return NextResponse.json(`Archivo eliminado - DO`);
          } catch (error) {
            console.error("Error al eliminar el objeto:", error);
            return new NextResponse("Error al eliminar el archivo", { status: 400 });
          }
    } catch (error) {
        return new NextResponse("Internal Errorr: " + error, { status: 500 })

    }

};


