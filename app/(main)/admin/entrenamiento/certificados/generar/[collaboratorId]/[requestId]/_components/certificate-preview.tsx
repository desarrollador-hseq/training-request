"use client";

import { PDFViewer } from "@react-pdf/renderer";
import React, { useEffect, useState } from "react";
import { addMonths } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Coach,
  Collaborator,
  Company,
  Course,
  CourseLevel,
} from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDateOf } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { ButtonCreateCertificate } from "./button-create-certificate";
import { DocumentCertificateTemplate } from "@/app/(main)/_components/document-certificate-template";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface CertificatePreviewProps {
  collaborator:
    | (Collaborator & { company: Company | null | undefined })
    | null
    | undefined;
  courseLevel:
    | (CourseLevel & { course: Course | null | undefined })
    | null
    | undefined;
  endDate: Date | null;
  trainingRequestId: string;
  coaches: Coach[] | null;
}
export const CertificatePreview = ({
  collaborator,
  courseLevel,
  endDate,
  trainingRequestId,
  coaches,
}: CertificatePreviewProps) => {
  const [expeditionDate, setExpeditionDate] = useState<Date | null | undefined>(
    new Date()
  );
  const [expeditionDateFormated, setExpeditionDateFormated] =
    useState<string>();
  const [open, setOpen] = useState<boolean>(false);

  const handleChange = (e: boolean) => {
    if (!expeditionDate) return;
    setOpen(e);
  };

  useEffect(() => {
    setOpen(false);
  }, [expeditionDate]);

  const endDateFormated = formatDateOf(endDate || new Date());

  useEffect(() => {
    setExpeditionDateFormated(
      formatDateOf(expeditionDate ? expeditionDate : new Date())
    );
  }, [expeditionDate]);

  const expireDate = addMonths(
    endDate || new Date(),
    courseLevel?.monthsToExpire!
  );
  const expireDateFormated = formatDateOf(
    addMonths(endDate || new Date(), courseLevel?.monthsToExpire!)
  );

  const [numDoc] = useState(collaborator?.numDoc);
  const [typeDoc] = useState(
    collaborator?.docType ? collaborator.docType : "CC"
  );

  const [resolution] = useState(courseLevel?.course?.resolution);
  const [levelHours] = useState(courseLevel?.hours);

  const [coachId, setCoachId] = useState<string | undefined>();
  const [coach, setCoach] = useState<Coach | null>();

  useEffect(() => {
    const coachSelected = coaches?.find((coach) => coach.id === coachId);
    setCoach(coachSelected);
  }, [coachId, coaches]);

  return (
    <div>
      <Card className="mb-3">
        <CardContent className="flex justify-around items-center mt-6">
          <div className="flex flex-col">
            <Label className="mb-2">Fecha de expedición</Label>
            <Popover open={open} onOpenChange={(e) => handleChange(!open)}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !expeditionDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expeditionDate ? (
                    formatDateOf(expeditionDate)
                  ) : (
                    <span>Cambiar fecha de expedición</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                {expeditionDate ? (
                  <Calendar
                    mode="single"
                    selected={expeditionDate}
                    onSelect={setExpeditionDate}
                    initialFocus
                  />
                ) : (
                  <div className="p-4">Selecciona la fecha </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col">
            <Label className="mb-2">Entrenador</Label>
            <Select value={coachId} onValueChange={setCoachId}>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="🔴 Selecciona un entrenador" />
              </SelectTrigger>
              <SelectContent>
                {coaches?.map((coach) => (
                  <SelectItem key={coach.id} value={coach.id}>
                    {coach.fullname} - {coach.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ButtonCreateCertificate
            btnDisabled={!!!coachId}
            fullname={collaborator?.fullname.toUpperCase() || ""}
            arlName={collaborator?.arlName}
            collaboratorId={collaborator?.id}
            companyName={collaborator?.company?.businessName || ""}
            legalRepresentative={collaborator?.company?.legalRepresentative}
            companyNit={collaborator?.company?.nit || ""}
            course={courseLevel?.course?.name || ""}
            level={courseLevel?.name || ""}
            levelHours={courseLevel?.hours}
            numDoc={collaborator?.numDoc}
            endDate={endDate}
            resolution={courseLevel?.course?.resolution}
            expireDate={expireDate}
            expeditionDate={expeditionDate ? expeditionDate : new Date()}
            typeDoc={typeDoc}
            levelId={courseLevel?.id}
            monthsToExpire={courseLevel?.monthsToExpire || 0}
            trainingRequestId={trainingRequestId}
            coachId={coach?.id}
            coachName={coach?.fullname}
            coachPosition={coach?.position}
            coachLicence={coach?.licence}
            coachImgSignatureUrl={coach?.imgSignatureUrl}
          />
        </CardContent>
      </Card>

      <PDFViewer style={{ width: "100%", height: "1200px" }}>
        <DocumentCertificateTemplate
          fullname={collaborator?.fullname.toUpperCase() || ""}
          numDoc={collaborator?.numDoc || ""}
          typeDoc={typeDoc}
          level={courseLevel?.name || ""}
          course={courseLevel?.course?.name || ""}
          levelHours={"" + courseLevel?.hours}
          resolution={courseLevel?.course?.resolution}
          endDate={endDateFormated}
          expeditionDate={expeditionDateFormated || ""}
          expireDate={expireDateFormated}
          coachName={coach?.fullname}
          coachPosition={coach?.position}
          coachLicence={coach?.licence}
          coachImgSignatureUrl={coach?.imgSignatureUrl}
        />
      </PDFViewer>
    </div>
  );
};
