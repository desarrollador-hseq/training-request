import { SimpleModal } from "@/components/simple-modal";
import React from "react";
import { RequestReport } from "./request-report";
import { Company, TrainingRequest } from "@prisma/client";
import { SectorCompaniesReport } from "./sector-companies-report";

interface ModalMoreReportsProps {
  requests: TrainingRequest[];
  companies: Company[];
}

export const ModalMoreReports = ({ requests, companies }: ModalMoreReportsProps) => {
  return (
    <div className="overflow-y-auto">
      <SimpleModal title="Resumen" textBtn={`Ver mas`} large btnClass="overflow-y-auto">
        <div className="grid md:grid-cols-2 gap-2 overflow-y-auto">
          <RequestReport requests={requests} />
          {/* <SectorCompaniesReport companies={companies} /> */}
          <RequestReport requests={requests} />
          <RequestReport requests={requests} />
        </div>
      </SimpleModal>
    </div>
  );
};
