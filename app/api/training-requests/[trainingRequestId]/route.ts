import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Collaborator } from "@prisma/client";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";


export async function POST(req: Request, { params }: { params: { trainingRequestId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return new NextResponse("Unauthorized", { status: 401 })
  const { trainingRequestId } = params;

  const { collaborators } = await req.json()
  try {

    const trainingRequest = await db.trainingRequest.findUnique({
      where: { id: trainingRequestId },
      include: { collaborators: true },
    });

    if (!trainingRequest || !collaborators) return new NextResponse("Not Found", { status: 404 })

    const collaboratorsToRemove = trainingRequest?.collaborators.filter(
      ({ collaboratorId }) => !collaborators.some(
        ({ id }: { id: string }) => collaboratorId === id
      )
    );

    // remove collaborators
    await Promise.all(
      collaboratorsToRemove.map(async ({ collaboratorId }) => {
        await db.trainingRequestCollaborator.delete({
          where: {
            collaboratorId_trainingRequestId: {
              trainingRequestId: trainingRequestId,
              collaboratorId,
            }
          },
        });
      })
    );

    // Add new collaborators
    await Promise.all(
      collaborators.map(async (collaborator: Collaborator) => {
        const existingEntry = await db.trainingRequestCollaborator.findFirst({
          where: {
            trainingRequestId: trainingRequestId,
            collaboratorId: collaborator.id,
          },
        });

        if (!existingEntry) {
          await db.trainingRequestCollaborator.create({
            data: {
              trainingRequestId: trainingRequestId,
              collaboratorId: collaborator.id,
            },
          });
        }
      })
    );

    return new NextResponse("ok", { status: 200 })

  } catch (error) {
    console.log("[TRAINING-REQUEST-CREATE-MANY]", error)
    return new NextResponse("Internal Errorr" + error, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { trainingRequestId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return new NextResponse("Unauthorized", { status: 401 })
  const values = await req.json()

  try {
      const request = await db.trainingRequest.update({
          where: {
            id: params.trainingRequestId,
          },
          data: {
            ...values
          }

      })

      return NextResponse.json(request)

  } catch (error) {
      console.log("[TRAINING-REQUEST-UPDATED]", error)
      return new NextResponse("Internal Errorr" + error, { status: 500 })
  }
}

