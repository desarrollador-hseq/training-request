import {
  Collaborator,
  CourseLevel,
  TrainingRequest,
  TrainingRequestCollaborator,
} from "@prisma/client";

interface AdminScheduleCollaboratorFormProps {
  trainingRequestCollaborator:
    | (TrainingRequestCollaborator & {
        courseLevel: CourseLevel | null | undefined;
        trainingRequest: TrainingRequest | null | undefined;
        collaborator: Collaborator | null | undefined;
      })
    | null;
}

export const AdminScheduleCollaboratorForm = ({
  trainingRequestCollaborator,
}: AdminScheduleCollaboratorFormProps) => {
  return (
    <div>
      <h2> {trainingRequestCollaborator?.collaborator?.fullname}</h2>
      <h2> {trainingRequestCollaborator?.courseLevel?.name}</h2>
      <h2> {trainingRequestCollaborator?.endDate?.toString()}</h2>
    </div>
  );
};
