"use client";

import { FileUploadForm } from "@/components/file-upload-form";
import {
  Collaborator,
  CollaboratorCourseLevelDocument,
  Course,
  CourseLevel,
  RequiredDocument,
  TrainingRequest,
  TrainingRequestCollaborator,
} from "@prisma/client";
import { useState } from "react";

interface AdminScheduleCollaboratorFormProps {
  trainingRequestCollaborator:
    | (TrainingRequestCollaborator & {
        courseLevel:
          | (CourseLevel & {
              course: Course | null | undefined;
              requiredDocuments:
                | {
                    name: string;
                    collaboratorCourseLevelDocument:
                      | {
                          documentLink: string | undefined | null;
                          name: string | undefined | null;
                        }[]
                      | null
                      | undefined;
                  }[]
                | null
                | undefined;
            })
          | null
          | undefined;
        trainingRequest: TrainingRequest | null | undefined;
        collaborator: Collaborator | null | undefined;
      })
    | null;
}

export const AdminScheduleCollaboratorForm = ({
  trainingRequestCollaborator,
}: AdminScheduleCollaboratorFormProps) => {
  const [document, setDocument] = useState(
    trainingRequestCollaborator?.courseLevel?.requiredDocuments?.map((m) => m)
  );

  console.log({ selec: JSON.stringify(trainingRequestCollaborator) });
  return (
    <div>
      <h2> {trainingRequestCollaborator?.collaborator?.fullname}</h2>
      <h2> {trainingRequestCollaborator?.courseLevel?.name}</h2>
      <h2> {trainingRequestCollaborator?.courseLevel?.course?.name}</h2>
      <h2>
        {document[1].name}
        {document[1].collaboratorCourseLevelDocument[0].documentLink}
      </h2>
      -----------------------------------------------
      <h2>
        {document?.map((m) => m.name)}
        {document?.map((m) =>
          m.collaboratorCourseLevelDocument?.map((n) => n.documentLink)
        )}
      </h2>
      <h2>
        {" "}
        {trainingRequestCollaborator?.courseLevel?.requiredDocuments?.map((m) =>
          m.collaboratorCourseLevelDocument?.map((n) => n?.name)
        )}
      </h2>
      <h2> {trainingRequestCollaborator?.endDate?.toString()}</h2>
      {document?.map((doc) => (
        <div>
          {doc?.collaboratorCourseLevelDocument && (
            <div>
              <FileUploadForm
                apiUrl={``}
                field={doc.name}
                file={doc?.collaboratorCourseLevelDocument[0]?.documentLink}
                ubiPath="colaboradores/documentos"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
