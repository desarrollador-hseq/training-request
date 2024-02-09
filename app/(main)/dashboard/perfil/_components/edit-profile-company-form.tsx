"use client";

import { useRouter } from "next/navigation";
import { Company } from "@prisma/client";
import { FieldUpdatedForm } from "@/components/field-updated-form";
import { UpdatePasswordForm } from "./update-password-form";

export const EditProfileCompanyForm = ({
  company,
}: {company: Company | null}) => {
  const router = useRouter();

  return (
    <div className="max-w-[1500px] w-full h-full mx-auto bg-white rounded-md shadow-sm overflow-y-hidden p-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1 mb-7 w-full ">
        <div className="space-y-4">
          <FieldUpdatedForm
            field="businessName"
            disabled={true}
            apiUrl={`/api/companies`}
            label="Razón social"
            id={company?.id}
            value={company?.businessName}
          />
          <FieldUpdatedForm
            field="nit"
            disabled={true}
            apiUrl={`/api/companies`}
            label="NIT"
            id={company?.id}
            value={company?.nit}
          />
          <FieldUpdatedForm
            field="sector"
            disabled={true}
            apiUrl={`/api/companies`}
            label="Sector"
            id={company?.id}
            value={company?.sector}
          />
            <FieldUpdatedForm
            field="legalRepresentative"
            disabled={false}
            apiUrl={`/api/companies`}
            label="Representante legal"
            id={company?.id}
            value={company?.legalRepresentative}
          />
          <FieldUpdatedForm
            field="nameContact"
            disabled={false}
            apiUrl={`/api/companies`}
            label="Nombre del contacto"
            id={company?.id}
            value={company?.nameContact}
          />
          <FieldUpdatedForm
            field="phoneContact"
            disabled={false}
            apiUrl={`/api/companies`}
            label="Teléfono del contacto"
            id={company?.id}
            value={company?.phoneContact}
          />
          <FieldUpdatedForm
            field="email"
            disabled={true}
            apiUrl={`/api/companies`}
            label="Correo electrónico"
            id={company?.id}
            value={company?.email}
          />
        </div>
        <div>
        <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
};
