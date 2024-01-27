import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"
import { IdentificationFileForm } from "../../../../colaboradores/[collaboratorId]/_components/identification-file-form"
import { useEffect, useState } from "react"
import { Collaborator, CourseLevel, RequiredDocument } from "@prisma/client"
import { useLoading } from "@/components/providers/loading-provider"
import axios from "axios"
import { cn } from "@/lib/utils"

interface ModalUploadDocumentProps {
    courseLevel: CourseLevel | null | undefined;
    collaborator: Collaborator | null | undefined;
}

export const ModalUploadDocument = ({courseLevel, collaborator}: ModalUploadDocumentProps) => {

    const { setLoadingApp } = useLoading();

    const [defaultValueTab, setDefaultValueTab] = useState<string | undefined>(
        ""
      );
      const [courseLevelId, setCourseLevelId] = useState<string | undefined>("");

      const [openModals, setOpenModals] = useState<{ [key: string]: boolean }>({});
      const [documentsRequired, setdocumentsRequired] = useState<
        RequiredDocument[] | null
      >();
    
      useEffect(() => {
        setLoadingApp(true);
        if (!courseLevelId) return;
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
    <div className="w-fit">
    {courseLevel?.id && (
      <AlertDialog
        open={openModals[`${collaborator?.id}-${courseLevel.id}`]}
        onOpenChange={() =>
          handleCloseModal(collaborator?.id!, courseLevel.id)
        }
      >
        {/* <AlertDialogTrigger asChild> */}
        <Button
          onClick={() =>
            handleOpenModal(collaborator?.id!, courseLevel.id)
          }
          className={cn("bg-accent ")}
        >
          abrir
        </Button>
        {/* </AlertDialogTrigger> */}
        <AlertDialogContent
          className={
            " lg:max-w-screen-lg overflow-y-scroll max-h-screen min-h-[300px]"
          }
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              <div className="flex justify-between">
                <div>
                  Gestionar documentos del colaborador:{" "}
                  <span className="font-normal text-xl">
                    {collaborator?.fullname} -{" "}
                    {collaborator?.numDoc}
                  </span>
                </div>
                <Button
                  className="w-fit h-fit flex rounded-md justify-center items-center p-1 hover:bg-slate-50"
                  variant="outline"
                  onClick={() =>
                    handleCloseModal(
                      collaborator?.id!,
                      courseLevel.id
                    )
                  }
                >
                  <X className="text-red-500" />
                </Button>
              </div>
            </AlertDialogTitle>
          </AlertDialogHeader>
          {documentsRequired && documentsRequired?.length > 0 && (
            <Tabs
              defaultValue={"0"}
              className="w-full flex flex-col items-center "
            >
              <TabsList
                className="w-[70%] my-2 relative"
                defaultValue={`${defaultValueTab}`}
              >
                {documentsRequired?.map((doc, index) => (
                  <TabsTrigger
                    key={doc.id}
                    className="w-full"
                    value={`${index}`}
                  >
                    {doc.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {documentsRequired?.map((doc, index) => (
                <TabsContent
                  key={doc.id + collaborator?.id}
                  value={`${index}`}
                >
                  {doc.id}
                  <IdentificationFileForm
                    label={doc.name!}
                    collaboratorId={collaborator?.id!}
                    courseLevelId={doc.courseLevelId!}
                    documentRequiredId={doc.id}
                    field={doc.name!}
                    ubiPath="colaboradores/documentos"
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </AlertDialogContent>
      </AlertDialog>
    )}
  </div>
  )
}
