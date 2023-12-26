import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"


// export async function POST(req: Request, { params }: { params: { courseId: string } }) {
//     const session = await getServerSession(authOptions)
//     if (!session) return new NextResponse("Unauthorized", { status: 401 })
//     const values = await req.json()
//     try {

//         const companyId = session.user.id

//         const request = await db.trainingRequest.create({
//             data: {
//                 companyId, ...values
//             }
//         })

//         return NextResponse.json(request)

//     } catch (error) {
//         console.log("[TRAINING-REQUEST-CREATE]", error)
//         return new NextResponse("Internal Errorr", { status: 500 })
//     }
// }

export async function POST(req: Request, { params }: { params: { trainingRequestId: string, memberId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    const { trainingRequestId, memberId } = params;
    try {
       const { trainingRequests } = await req.json()
       const companyId = session.user.id
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
  const existingRequests = await db.trainingRequestCollaborator.findMany({
    where: {
      collaboratorId: memberId
    }
  });
  
  // Identifica los trainingRequestId presentes en la base de datos
  const existingTrainingRequestIds = existingRequests.map(request => request.trainingRequestId);
  
  // Itera sobre los registros existentes y decide si eliminarlos
  for (const existingRequest of trainingRequests) {
    if (!trainingRequests.some(training => training.trainingRequestId === existingRequest.trainingRequestId)) {
      // El registro en la base de datos no está presente en trainingRequests, eliminarlo.
      await db.trainingRequestCollaborator.delete({
        where: {
          collaboratorId_trainingRequestId: {
            trainingRequestId: existingRequest.trainingRequestId,
            collaboratorId: existingRequest.collaboratorId
          }
        }
      });
  
      console.log(`Registro eliminado para trainingRequestId ${existingRequest.trainingRequestId} y memberId ${memberId}`);
    }
  }
  
  // Itera sobre los trainingRequests y decide si crear o actualizar los registros
  for (const training of trainingRequests) {
    const trainingRequestSaved = await db.trainingRequestCollaborator.findUnique({
      where: {
        collaboratorId_trainingRequestId: {
          trainingRequestId: training.trainingRequestId,
          collaboratorId: memberId
        }
      },
    });
  
    if (trainingRequestSaved) {
      // El registro ya existe, no hacer nada.
      console.log(`Registro existente para trainingRequestId ${training.trainingRequestId} y memberId ${memberId}`);
    } else {
      // El registro no existe, crear uno nuevo.
      const request = await db.trainingRequestCollaborator.create({
        data: {
          trainingRequestId: training.trainingRequestId,
          collaboratorId: memberId,
          // ... otros valores si es necesario
        }
      });
  
      console.log(`Nuevo registro creado para trainingRequestId ${training.trainingRequestId} y memberId ${memberId}`);
    }
  
  
  }
  
  return NextResponse.json({request: "ejecuted"})
  
  
    } catch (error) {
      console.log("[TRAINING-REQUEST-CREATE-MANY]", error)
      return new NextResponse("Internal Errorr", { status: 500 })
    }
  }
  