"use client";

import { Company } from "@prisma/client";
import axios from "axios";
import { Trash, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { SimpleModal } from "@/components/simple-modal";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/components/providers/loading-provider";

export const DeactivateCompany = ({ company }: { company: Company }) => {
  const { loadingApp, setLoadingApp } = useLoading();

  const handleDelete = async () => {
    setLoadingApp(true);
    try {
      await axios.delete(`/api/companies/${company.id}`);
      toast.info("Se ha eliminado la empresa correctamente");
    } catch (error) {
      toast.error(
        "Ocurrió un error inesperado, por favor intentelo nuevamente"
      );
      console.log("error al eliminar la empresa" + error);
    } finally {
      setLoadingApp(false);
    }
  };

  const title = (
    <p className="font-normal inline">
      la empresa de nombre:{" "}
      <span className="font-bold "> {company.businessName}</span>
    </p>
  );

  return (
    <div>
      {company.active && (
        <DeleteConfirmModal onConfirm={handleDelete} title={title}>
          <Button
            disabled={loadingApp}
            variant="destructive"
            className="bg-red-700"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </DeleteConfirmModal>
      )}
    </div>
  );
};
