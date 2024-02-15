"use client";

import { useRouter } from "next/navigation";

import {
  Collaborator,
  CollaboratorCourseLevelDocument,
  Course,
  CourseLevel,
  RequiredDocument,
  TrainingRequest,
} from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const stateEsp = {
  PENDING: { text: "Creada/No enviada", icon: "🕒" },
  ACTIVE: { text: "Activo", icon: "✅" },
  EXECUTED: { text: "Ejecutado", icon: "✔️" },
  CANCELLED: { text: "Cancelado", icon: "❌" },
  // Agrega más estados según sea necesario
};

interface EditTrainingRequestProps {
  trainingRequest:
    | (TrainingRequest & {
        collaborators: {
          collaborator:
            | (Collaborator & {
                documents: CollaboratorCourseLevelDocument[] | null | undefined;
              })
            | null
            | undefined;
          courseLevel:
            | (CourseLevel & {
                requiredDocuments: RequiredDocument[] | null | undefined;
              })
            | null
            | undefined;
        }[];
        course: Course | null | undefined;
      })
    | null
    | undefined;
  courseLevels:
    | (CourseLevel &
        { requiredDocuments: RequiredDocument[] | null | undefined })[]
    | null
    | undefined;
}

export const TrainingCreationData = ({
  trainingRequest,
}: EditTrainingRequestProps) => {
  const router = useRouter();
  return (
    <div className="flex md:items-center md:justify-start h-full w-full">
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 p-2">
        <CardInfo
          label="Tipo de entrenamiento"
          text={trainingRequest?.course?.name}
        />
        <CardInfo
          label="N° de inscritos"
          text={trainingRequest?.collaborators?.length.toString()}
        />
        <CardInfo
          label="Fecha de creación"
          text={format(trainingRequest?.createdAt!, "PPP", { locale: es })}
        />
        <CardInfo
          label="Estado"
          text={stateEsp[trainingRequest?.state!].text}
        />
      </div>
    </div>
  );
};

const CardInfo = ({ label, text }: { label: string; text?: string | null }) => {
  return (
    <div className="flex flex-col p-2 items-center bg-blue-100">
      <h5 className="text-lg font-bold">{label}</h5>
      <p className="text-normal text-center">{text}</p>
    </div>
  );
};
