"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { addMonths } from "date-fns";
import {
  Certificate,
  Coach,
  Collaborator,
  Company,
  Course,
  CourseLevel,
} from "@prisma/client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AddCertificateForm } from "../../../../_components/add-certificate-form";
import { Banner } from "@/components/banner";

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
  baseUrl: string;
  companyContact?: string | null;
  companyEmail?: string | null;
  coaches: Coach[] | null;
  certificateWasCreatedId?: string;
  canManageRequests: boolean;
  canManagePermissions: boolean;
}
export const CertificatePreview = ({
  collaborator,
  baseUrl,
  courseLevel,
  endDate,
  trainingRequestId,
  certificateWasCreatedId,
  coaches,
  canManageRequests,
  canManagePermissions,
  companyContact,
  companyEmail,
}: CertificatePreviewProps) => {
  const [expeditionDate, setExpeditionDate] = useState<Date | null | undefined>(
    new Date()
  );

  const [coachId, setCoachId] = useState<string | undefined>();
  const [coach, setCoach] = useState<Coach | null>();

  useEffect(() => {
    const coachSelected = coaches?.find((coach) => coach.id === coachId);
    setCoach(coachSelected);
  }, [coachId, coaches]);

  const [certificate, setCertificate] = useState<
    Certificate | null | undefined
  >({
    collaboratorFullname: collaborator?.fullname.toUpperCase() || "",
    collaboratorNumDoc: collaborator?.numDoc || "",
    collaboratorTypeDoc: collaborator?.docType || "CC",
    collaboratorArlName: collaborator?.arlName || "",
    companyName: collaborator?.company?.businessName || "",
    legalRepresentative: collaborator?.company?.legalRepresentative || "",
    companyNit: collaborator?.company?.nit || "",
    courseName: courseLevel?.course?.name || "",
    levelName: courseLevel?.name || "",
    resolution: courseLevel?.course?.resolution || "",
    levelHours: courseLevel?.hours || NaN,
    certificateDate: endDate || null,
    expeditionDate: expeditionDate ? expeditionDate : new Date(),
    monthsToExpire: courseLevel?.monthsToExpire || null,
    dueDate: courseLevel?.monthsToExpire !== 0 ? addMonths(endDate!, courseLevel?.monthsToExpire!) : null,
    collaboratorId: collaborator?.id || "",
    courseLevelId: courseLevel?.id || "",
    active: true,
    coachId: null,
    coachImgSignatureUrl: null,
    coachLicence: null,
    coachName: null,
    coachPosition: null,
    fileUrl: null,
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    wasSent: false,
  });

  return (
    <div>
      {/* 
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
      </Card> */}

      <Card>
        <CardHeader className="p-0">
          {certificateWasCreatedId !== undefined && (
            <Banner label="Ya existe un certificado para este colaborador en el mismo curso y nivel, y bajo la misma empresa.">
              <Link
                className={buttonVariants({
                  className: `bg-emerald-600 hover:bg-emerald-700`,
                })}
                href={`/admin/entrenamiento/certificados/${certificateWasCreatedId}`}
              >
                Ver certificado
              </Link>
            </Banner>
          )}
        </CardHeader>
        <CardContent>
          <AddCertificateForm
            canManagePermissions={canManagePermissions}
            certificate={certificate}
            baseUrl={`${baseUrl}`}
            coaches={coaches}
            isCreate={true}
            certAlreadyExists={certificateWasCreatedId !== undefined}
            companyContact={companyContact}
            companyEmail={companyEmail}
            trainingRequestId={trainingRequestId}
          />
        </CardContent>
      </Card>
    </div>
  );
};
