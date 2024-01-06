
import { NextResponse } from "next/server";
import { s3Client } from "@/lib/s3Client";

export async function DELETE(req: Request, { params }: { params: { link: string } }) {

    if (!params.link) return new NextResponse("", { status: 400 })

    try {
        const bucket = "hseq"

        const bucketParams = {
            Bucket: bucket,
            Key: params.link,
        };


        try {
            const res = await s3Client.deleteObject(bucketParams)
            return NextResponse.json(`Archivo eliminado de Digital Ocean Spaces: ${res.DeleteMarker}`);
        } catch (error) {
            return new NextResponse("Errorr: " + error, { status: 500 })
        }
    } catch (error) {
        return new NextResponse("Internal Errorr: " + error, { status: 500 })

    }


};


