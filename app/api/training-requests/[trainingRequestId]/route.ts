import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

export async function POST(req: Request, { params }: { params: { trainingRequestId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    const { trainingRequestId } = params;


try {
    const { trainingRequests } = await req.json()
    const companyId = session.user.id
    console.log({trainingRequests})
       if (!trainingRequestId || !trainingRequests) return new NextResponse("Bad request", { status: 400 })
  
  
      // trainingRequests.map(trining => {
  
      //   const trainingRequestSaved = await db.trainingRequestCollaborator.findUnique({
      //     where: {
      //       collaboratorId_trainingRequestId: {
      //         trainingRequestId: trainingRequestId, collaboratorId: memberId
      //       }
      //     },
      //   })
  
      //   if (!trainingRequestSaved) {
      //     const request = await db.trainingRequestCollaborator.create({
      //       data: {
      //         trainingRequestId: trainingRequestId, collaboratorId: memberId
      //       }
      //     })
      //   } else {
      //   }
      // })
  
      // Obtén todos los registros existentes en la base de datos para el memberId
  // const existingRequests = await db.trainingRequestCollaborator.findMany({
  //   where: {
  //     collaboratorId: memberId
  //   }
  // });
  // Identifica los trainingRequestId presentes en la base de datos
  // const existingTrainingRequestIds = existingRequests.map(request => request.trainingRequestId);
  
  // Itera sobre los registros existentes y decide si eliminarlos
  for (const existingRequest of trainingRequests) {
    if (!trainingRequests.some(training => training.trainingRequestId === existingRequest.trainingRequestId)) {
      // El registro en la base de datos no está presente en trainingRequests, eliminarlo.
      await db.trainingRequestCollaborator.delete({
        where: {
          collaboratorId_trainingRequestId: {
            trainingRequestId: trainingRequestId,
            collaboratorId: existingRequest.id
          }
        }
      });
  
      console.log(`Registro eliminado para trainingRequestId ${trainingRequestId} y memberId ${memberId}`);
    }
  }
  
  // Itera sobre los trainingRequests y decide si crear o actualizar los registros
  for (const training of trainingRequests) {
    const trainingRequestSaved = await db.trainingRequestCollaborator.findUnique({
      where: {
        collaboratorId_trainingRequestId: {
          trainingRequestId: trainingRequestId,
          collaboratorId: training.id
        }
      },
    });
  
    if (trainingRequestSaved) {
      // El registro ya existe, no hacer nada.
      console.log(`Registro existente para trainingRequestId ${training.trainingRequestId} y memberId ${trainingRequestSaved.collaboratorId}`);
    } else {
      // El registro no existe, crear uno nuevo.
      const request = await db.trainingRequestCollaborator.create({
        data: {
          trainingRequestId: trainingRequestId,
          collaboratorId: training.id,
          // ... otros valores si es necesario
        }
      });
  
      console.log(`Nuevo registro creado para trainingRequestId ${trainingRequestId} y memberId ${training.id}`);
    }
  }
  
  return NextResponse.json({request: "ejecuted"})
  
    } catch (error) {
      console.log("[TRAINING-REQUEST-CREATE-MANY]", error)
      return new NextResponse("Internal Errorr", { status: 500 })
    }
  }
  