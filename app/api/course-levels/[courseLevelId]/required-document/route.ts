
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { courseLevelId: string } }
) {
  try {
    const documentsRequired = await db.requiredDocument.findMany({
      where: {
        courseLevelId: params.courseLevelId,
        active: true,
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return NextResponse.json(documentsRequired);
  } catch (error) {
    console.log("[GET-DOCUMENTS-COURSELEVEL]", error);
    return new NextResponse("Internal Errorr", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { courseLevelId: string } }
) {
  const session = await getServerSession(authOptions);
  try {
    if (!session || session.user.role !== "ADMIN")
      return new NextResponse("Unauthorized", { status: 401 });
    const values = await req.json();

    if (!params.courseLevelId)
      return new NextResponse("Bad request", { status: 400 });
    const courses = await db.requiredDocument.create({
      data: {
        courseLevelId: params.courseLevelId,
        ...values,
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.log("[CREATE-DOCUMENTS-COURSELEVEL]", error);
    return new NextResponse("Internal Errorr", { status: 500 });
  }
}
