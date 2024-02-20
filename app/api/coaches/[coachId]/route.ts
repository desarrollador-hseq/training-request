import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { coachId: string } }) {
  try {
      const session = await getServerSession(authOptions)
      const { coachId } = params;
      const values = await req.json()

      console.log({values});

      if (!session) return new NextResponse("Unauthorized", { status: 401 })

      const coach = await db.coach.update({
          where: {
              id: coachId,
          },
          data: {
              ...values
          }
      })

      return NextResponse.json(coach)

  } catch (error) {
      console.log("[coach_PATCH_ID]", error)
      return new NextResponse("Internal Errorr" + error, { status: 500 })
  }
}