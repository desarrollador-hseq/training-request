import React from "react";
import { TrainingListCollaborators } from "./traininig-list-collaborators";
import { Collaborator, CourseLevel } from "@prisma/client";

interface TrainingListCollaboratorsProps {
  collaborators: Collaborator & { courseLevel?: CourseLevel | null }[];
  trainingRequestId: string
}

export const TrainingCollaborators = ({
  collaborators,
  trainingRequestId
}: TrainingListCollaboratorsProps) => {
  return (
    <div>
      <TrainingListCollaborators collaborators={collaborators} trainingRequestId={trainingRequestId} />
    </div>
  );
};
