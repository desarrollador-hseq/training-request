"use client";
import {
  Collaborator,
  CourseLevel,
  RequiredDocument,
  TrainingRequestCollaborator,
} from "@prisma/client";
import { useEffect, useState } from "react";
import { MoreHorizontal, Trash, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLoading } from "@/components/providers/loading-provider";
import { cn } from "@/lib/utils";
import { IdentificationFileForm } from "../../../../colaboradores/[collaboratorId]/_components/identification-file-form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CollaboratorsSimpleTableProps {
  collaborators:
    | (TrainingRequestCollaborator &
        {
          collaborators: { collaborator: Collaborator | null | undefined }[];
        }[])
    | null
    | undefined;
  trainingRequestId: string;
  coursesLevel: CourseLevel[] | null;
  isPending: boolean;
}

export const CollaboratorsSimpleTable = ({
  collaborators,
  trainingRequestId,
  coursesLevel,
  isPending,
}: CollaboratorsSimpleTableProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const [courseLevelId, setCourseLevelId] = useState<string | undefined>("");
  const [defaultValueTab, setDefaultValueTab] = useState<string | undefined>(
    ""
  );
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
      console.log({setdocumentsRequired: data})
    };
    getdocumentsRequired();
    setLoadingApp(false);
  }, [courseLevelId]);

  const handleRemove = async (id: string) => {
    setLoadingApp(true);
    try {
      const { data } = await axios.delete(
        `/api/training-requests/${trainingRequestId}/members/${id}`
      );
      toast.success("Colaborador removido de la solicitud");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoadingApp(false);
    }
  };

  const onChange = async (courseLevelId: any, id: string) => {
    if (isPending) {
      setLoadingApp(true);
      try {
        const { data } = await axios.patch(
          `/api/training-requests/${trainingRequestId}/members/${id}`,
          { courseLevelId }
        );
        router.refresh();
        toast.success("Nivel del colaborador actualizado");
      } catch (error) {
        console.error(error);
        toast.error("Ocurrió un error inesperado");
      } finally {
        setLoadingApp(false);
      }
    }
  };

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
    <Table className={cn("bg-blue-100", !isPending && "opacity-70")}>
      {/* <TableCaption>A list </TableCaption> */}
      <TableHeader>
        <TableRow className="bg-slate-600 hover:bg-slate-600">
          <TableHead className="text-white">Nombre completo</TableHead>
          <TableHead className="text-white">N° Documento</TableHead>
          <TableHead className="text-white">Correo electrónico</TableHead>
          <TableHead className="text-white">Teléfono</TableHead>
          <TableHead className="text-white">Nivel</TableHead>
          {isPending && (
            <TableHead className="text-right text-white">Acción</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {collaborators?.map(({ collaborator, courseLevel }: any) => (
          <TableRow
            className={cn("font-semibold", !isPending && "opacity-60")}
            key={collaborator.id + courseLevel?.id}
          >
            <TableCell>{collaborator.fullname}</TableCell>
            <TableCell>{collaborator.numDoc}</TableCell>
            <TableCell>{collaborator.email}</TableCell>
            <TableCell>{collaborator.phone}</TableCell>

            <TableCell>
              <Select
                defaultValue={courseLevel ? courseLevel.id : ""}
                onValueChange={(e) => onChange(e, collaborator.id)}
                disabled={!isPending}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="🔴 Sin definir" />
                </SelectTrigger>
                <SelectContent>
                  {coursesLevel?.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            {/* agregar Documentos de colaborador a solicitud */}
            <TableCell className="animation" colSpan={8}>
              <div>
                {courseLevel?.id && (
                  <AlertDialog
                    open={openModals[`${collaborator.id}-${courseLevel.id}`]}
                    onOpenChange={() =>
                      handleCloseModal(collaborator.id, courseLevel.id)
                    }
                  >
                    {/* <AlertDialogTrigger asChild> */}
                    <Button
                      onClick={() =>
                        handleOpenModal(collaborator.id, courseLevel.id)
                      }
                      className={cn("bg-accent")}
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
                                {collaborator.fullname} - {collaborator.numDoc}
                              </span>
                            </div>
                            <Button
                              className="w-fit h-fit flex rounded-md justify-center items-center p-1 hover:bg-slate-50"
                              variant="outline"
                              onClick={() =>
                                handleCloseModal(
                                  collaborator.id,
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
                              key={doc.id + collaborator.id}
                              value={`${index}`}
                            >
                              {
                                doc.id
                              }
                              <IdentificationFileForm
                                label={doc.name!}
                                collaboratorId={collaborator.id}
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
            </TableCell>

            {isPending && (
              <TableCell className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-4 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="hover:bg-slate-100"
                  >
                    <Button
                      variant="ghost"
                      onClick={() => handleRemove(collaborator.id)}
                      className="hover:bg-slate-300"
                    >
                      <Trash className="w-4 h-4 mr-2 text-red-500" />
                      Quitar de la lista
                    </Button>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="w-full">
        <TableRow className="w-full">
          <TableCell
            colSpan={isPending ? 5 : 4}
            className="bg-blue-400/20"
          ></TableCell>
          <TableCell className="text-right bg-blue-400/20">
            Total colaboradores:{" "}
            <span className="font-bold max-h-[5px]">
              {" "}
              {collaborators?.length}
            </span>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
