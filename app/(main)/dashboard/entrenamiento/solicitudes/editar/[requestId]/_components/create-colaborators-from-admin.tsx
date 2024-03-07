"use client";

import { SimpleModal } from "@/components/simple-modal";
import React from "react";
import { AddCollaboratorForm } from "../../../../colaboradores/_components/add-collaborator-form";

export const CreateColaboratorsFromAdmin = ({
  companyId,
  canManageRequests,
  canManageCompanies,
  canManagePermissions,
}: {
  companyId: string | undefined;
  canManageCompanies: boolean;
  canManageRequests: boolean;
  canManagePermissions: boolean;
}) => {
  return (
    <SimpleModal
      btnDisabled={
        !((canManageCompanies && canManageRequests) || canManagePermissions)
      }
      textBtn="Crear colaborador"
      title="Agregar un colaborador a la empresa"
      large
    >
      <h4 className="mb-3">
        Esta opcion solo esta disponible para administradores
      </h4>
      <div className="mb-1">
        <AddCollaboratorForm companyId={companyId} />
      </div>
    </SimpleModal>
  );
};
