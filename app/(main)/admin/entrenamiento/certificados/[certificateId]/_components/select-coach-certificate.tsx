import { useLoading } from "@/components/providers/loading-provider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Coach } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface SelectCoachCertificateProps {
  coaches: Coach[] | null;
  coachId?: string | null;
  certificateId?: string | null;
}

export const SelectCoachCertificate = ({
  coaches,
  coachId,
  certificateId,
}: SelectCoachCertificateProps) => {
  const { setLoadingApp } = useLoading();
  const router = useRouter();
  const onChangeCoach = async (coachId: string) => {
    const coach = coaches?.find((coach: Coach) => coach.id === coachId)

    try {
      setLoadingApp(true);
      const { data } = await axios.patch(`/api/certificates/${certificateId}/coach`, {
        coachName: coach?.fullname,
        coachId: coach?.id,
        coachPosition: coach?.position,
        coachLicence: coach?.licence,
        coachImgSignatureUrl: coach?.imgSignatureUrl
      });
      toast.success("Colaborador actualizado");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    }
    setLoadingApp(false);
  };
  return (
    <div className="w-full">
      <Label className="font-bold" htmlFor="coachId">Entrenador</Label>
      <Select
      
        defaultValue={coachId ? coachId : ""}
        onValueChange={(e) => onChangeCoach(e)}
        // disabled={!isPending}
        
      >
        <SelectTrigger id="coachId" className="w-full">
          <SelectValue placeholder="🔴 Seleccionar Entrenador" />
        </SelectTrigger>
        <SelectContent className="w-full">
          {coaches?.map((coach) => (
            <SelectItem key={coach.id} value={coach.id}>
              {coach.fullname} - {coach.position}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
