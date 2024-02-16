"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDateOf } from "@/lib/utils";

import { PDFViewer, pdf } from "@react-pdf/renderer";
import { addMonths } from "date-fns";
import React, { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import {
  Coach,
  Collaborator,
  Company,
  Course,
  CourseLevel,
} from "@prisma/client";
import { Label } from "@/components/ui/label";
import { ButtonCreateCertificate } from "./button-create-certificate";
import { DocumentCertificateTemplate } from "@/app/(main)/_components/document-certificate-template";
import { SelectCoachCertificate } from "../../../../[certificateId]/_components/select-coach-certificate";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [expeditionDate, setExpeditionDate] = useState<Date | undefined>(
    new Date()
  );
  const [expeditionDateFormated, setExpeditionDateFormated] = useState<
    string | undefined
  >();
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
    setExpeditionDateFormated(formatDateOf(expeditionDate!));
  }, [expeditionDate]);

  const expireDate = addMonths(
    endDate || new Date(),
    courseLevel?.monthsToExpire!
  );
  const expireDateFormated = formatDateOf(
    addMonths(endDate || new Date(), courseLevel?.monthsToExpire!)
  );

  const [fullname] = useState(collaborator?.fullname.toUpperCase());
  const [numDoc] = useState(collaborator?.numDoc);
  const [arlName] = useState(collaborator?.arlName);
  const [companyName] = useState(collaborator?.company?.businessName);
  const [companyNit] = useState(collaborator?.company?.nit);
  const [legalRepresentative] = useState(
    collaborator?.company?.legalRepresentative
  );
  const [typeDoc] = useState(
    collaborator?.docType ? collaborator.docType : "CC"
  );
  const [level] = useState(courseLevel?.name);
  const [course] = useState(courseLevel?.course?.name);
  const [resolution] = useState(courseLevel?.course?.resolution);
  const [levelHours] = useState(courseLevel?.hours);
  
  
  
  const [coachId, setCoachId] = useState<string | undefined>();
  const [coach, setCoach] = useState<Coach | null>();

  console.log({coaches})

  useEffect(() => {

    const coachSelected = coaches?.find(coach => coach.id === coachId)
    setCoach(coachSelected)
    
  }, [coachId])
  

  return (
    <div>
      <ButtonCreateCertificate
        fullname={fullname}
        arlName={arlName}
        collaboratorId={collaborator?.id}
        companyName={companyName}
        legalRepresentative={legalRepresentative}
        companyNit={companyNit}
        course={course}
        level={level}
        levelHours={levelHours}
        numDoc={numDoc}
        endDate={endDate}
        resolution={resolution}
        expireDate={expireDate}
        expeditionDate={expeditionDate}
        typeDoc={typeDoc}
        levelId={courseLevel.id}
        monthsToExpire={courseLevel?.monthsToExpire}
        trainingRequestId={trainingRequestId}

        coachId={coach?.id}
        coachName={coach?.fullname}
        coachPosition={coach?.position}
        coachLicence={coach?.licence}
        coachImgSignatureUrl={coach?.imgSignatureUrl}
      />
      <div className="flex flex-col gap-2">
        <Label>Fecha de expedición</Label>
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

        <Select
        value={coachId}
        onValueChange={setCoachId}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="🔴 Sin definir" />
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

      <PDFViewer style={{ width: "100%", height: "1200px" }}>
        <DocumentCertificateTemplate
          fullname={fullname}
          numDoc={numDoc}
          typeDoc={typeDoc}
          level={level}
          course={course}
          levelHours={levelHours}
          resolution={resolution}
          endDate={endDateFormated}
          expeditionDate={expeditionDateFormated}
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
