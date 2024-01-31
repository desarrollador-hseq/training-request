import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, X } from "lucide-react";
import { IdentificationFileForm } from "../../../../colaboradores/[collaboratorId]/_components/identification-file-form";
import { Suspense, useEffect, useState } from "react";
import { Collaborator, CourseLevel, RequiredDocument } from "@prisma/client";
import { useLoading } from "@/components/providers/loading-provider";
import axios from "axios";
import { cn } from "@/lib/utils";
import { TabsDocumentRequired } from "./tabs-document-requrired";

interface ModalUploadDocumentProps {
  courseLevel: CourseLevel | null | undefined;
  collaborator: Collaborator | null | undefined;
}

export const ModalUploadDocument = ({
  courseLevel,
  collaborator,
}: ModalUploadDocumentProps) => {
  const { setLoadingApp } = useLoading();

  const [courseLevelId, setCourseLevelId] = useState<string | undefined>("");

  const [openModals, setOpenModals] = useState<{ [key: string]: boolean }>({});
  const [documentsRequired, setdocumentsRequired] = useState<
    RequiredDocument[] | null
  >();

  useEffect(() => {
    setLoadingApp(true);
    if (!courseLevelId) {
      setLoadingApp(false);
      return;
    }
    const getdocumentsRequired = async () => {
      const { data } = await axios.get(
        `/api/course-levels/${courseLevelId}/required-document`
      );
      setdocumentsRequired(data);
    };
    getdocumentsRequired();
    setLoadingApp(false);
  }, [courseLevelId]);

  const handleOpenModal = (collaboratorId: string, courseLevelId: string) => {
    setOpenModals((prevOpenModals) => ({
      ...prevOpenModals,
      [`${collaboratorId}-${courseLevelId}`]: true,
    }));
    setCourseLevelId(courseLevelId);
  };

  const handleCloseModal = (collaboratorId: string, courseLevelId: string) => {
    setOpenModals((prevOpenModals) => ({
      ...prevOpenModals,
      [`${collaboratorId}-${courseLevelId}`]: false,
    }));
  };

  return (
    <div className="w-full max-w-[70%]">
      {courseLevel?.id && (
        <AlertDialog
          open={openModals[`${collaborator?.id}-${courseLevel.id}`]}
          onOpenChange={() =>
            handleCloseModal(collaborator?.id!, courseLevel.id)
          }
        >
          <Button
            onClick={() => handleOpenModal(collaborator?.id!, courseLevel.id)}
            className={cn("bg-accent ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M23 18h-3v-3h-2v3h-3v2h3v3h2v-3h3M6 2a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h7.81c-.36-.62-.61-1.3-.73-2H6V4h7v5h5v4.08c.33-.05.67-.08 1-.08c.34 0 .67.03 1 .08V8l-6-6M8 12v2h8v-2m-8 4v2h5v-2Z"
              />
            </svg>
          </Button>

          <AlertDialogContent
            className={
              " overflow-y-auto max-h-[90vh] min-h-[90vh] min-w-[90wh] max-w-[70wh] h-full"
            }
          >
            {documentsRequired && documentsRequired?.length > 0 && (
              <div>
                <div className="flex justify-between my-3 text-primary">
                  <div className="text-2xl font-bold">
                    Gestionar documentos del colaborador:{" "}
                    <span className="font-normal text-xl">
                      {collaborator?.fullname} - {collaborator?.numDoc}
                    </span>
                  </div>
                  <Button
                    className="w-fit h-fit flex rounded-md justify-center items-center p-1 hover:bg-slate-50"
                    variant="outline"
                    onClick={() =>
                      handleCloseModal(collaborator?.id!, courseLevel.id)
                    }
                  >
                    <X className="text-red-500" />
                  </Button>
                </div>
                <TabsDocumentRequired
                  documentsRequired={documentsRequired}
                  collaboratorId={collaborator?.id!}
                />
              </div>
            )}
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
