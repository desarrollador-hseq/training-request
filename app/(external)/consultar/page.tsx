"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Certificate } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SetNumdocCertificatesForm } from "./_components/set-numdoc-certificates-form";
import { SubtitleSeparator } from "@/components/subtitle-separator";
import { useLoading } from "@/components/providers/loading-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateOf } from "@/lib/utils";
import { X } from "lucide-react";
import { Banner } from "@/components/banner";

const ConsultByDocument = () => {
  const [numDoc, setNumDoc] = useState<string>("");
  const [currentCertificate, setCurrentCertificate] = useState<
    Certificate[] | null
  >();
  const [oldCertificate, setOldCertificate] = useState<any>();
  const { setLoadingApp } = useLoading();

  const thereCurrentCertificate = useMemo(
    () => !!currentCertificate,
    [currentCertificate]
  );
  const thereOldCertificate = useMemo(() => !!oldCertificate, [oldCertificate]);

  useEffect(() => {
    const onSubmit = async () => {
      setLoadingApp(true);
      try {
        const { data } = await axios.get(`/api/certificates/doc/${numDoc}`);
        setCurrentCertificate(data);

        try {
          const { data: oldData } = await axios.post(
            `https://app.grupohseq.com/funciones/class_cons_certificado.php`,
            { cc: numDoc }
          );
          setOldCertificate(oldData);
          console.log({ oldData });
        } catch (error) {
          console.warn("old certificates connect");
          setOldCertificate([]);
        }
      } catch {
        toast.error("Ocurrió un error al consultar el certificado");
        setCurrentCertificate([]);
      } finally {
        setLoadingApp(false);
      }
    };
    if (numDoc) {
      onSubmit();
    }
  }, [numDoc]);

  useEffect(() => {
    console.log({
      current: JSON.stringify(currentCertificate),
      old: JSON.stringify(oldCertificate),
    });
  }, [currentCertificate, oldCertificate]);

  const clearAll = () => {
    setNumDoc("");
  };

  return (
    <div className="mx-auto w-full flex flex-col items-center">
      <SubtitleSeparator className="capitalize" text="Consulta" />
      <CardContent className="mt-1  max-w-[1500px] w-auto mx-auto flex flex-col items-center gap-7">
        <Banner
          variant="info"
          className="text-base font-normal p-7"
          label="Ingrese el número de documento de una persona que cursó y aprobó un programa registrado en HSEQ ENTRENAMIENTO."
        />
        <div className="flex justify-center w-full max-w-[400px]">
          <SetNumdocCertificatesForm setNumDoc={setNumDoc} />
        </div>
        <div>
          {(currentCertificate && currentCertificate?.length !== 0) ||
          (thereOldCertificate && oldCertificate?.length !== 0) ? (
            <>
        
            <span></span>
            <Card>
              <Table>
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    <TableHead className="font-semibold">Asistente</TableHead>
                    <TableHead className="font-semibold">Curso</TableHead>
                    <TableHead className="font-semibold">
                      Empresa/Contratante
                    </TableHead>
                    <TableHead className="font-semibold">
                      Fecha Realizado
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!!currentCertificate &&
                    currentCertificate?.map((cert) => (
                      <TableRow>
                        <TableCell className="font-medium capitalize ">
                          {cert.collaboratorFullname?.toLowerCase()}
                        </TableCell>
                        <TableCell className="capitalize">
                          {cert.courseName}
                        </TableCell>
                        <TableCell className="capitalize">
                          {cert.companyName}
                        </TableCell>
                        <TableCell className="">
                          {cert.certificateDate &&
                            formatDateOf(cert.certificateDate)}
                        </TableCell>
                      </TableRow>
                    ))}
                  {oldCertificate &&
                    oldCertificate?.map((cert: any) => (
                      <TableRow>
                        <TableCell className="font-medium capitalize ">
                          {cert.nom_asistente?.toLowerCase()}
                        </TableCell>
                        <TableCell className="capitalize">
                          {cert.nom_curso}
                        </TableCell>
                        <TableCell className="capitalize">
                          {cert.cliente}
                        </TableCell>
                        <TableCell className="">
                          {cert.fecha && formatDateOf(cert.fecha)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
            </>
          ) : (
            <div></div>
          )}
          <div>
            {currentCertificate &&
              currentCertificate?.length === 0 &&
              oldCertificate &&
              oldCertificate.length === 0 && (
                <div className="p-5 flex justify-center bg-red-500 text-white gap-3">
                  <X className="text-white w-6 h-6" /> No se encontro algún
                  certificado
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default ConsultByDocument;
