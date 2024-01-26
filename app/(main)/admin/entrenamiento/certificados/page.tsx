import { TitleOnPage } from "@/components/title-on-page";
// import { TabsCompanies } from "./_components/tabs-companies";
import { db } from "@/lib/db";
import { TabsCertificates } from "./_components/tabs-certificates";
import { addMonths } from "date-fns";

const crumbs = [{ label: "certificados", path: "certificados" }];

const CertificatePage = async () => {
  const certificates = await db.certificate.findMany({
    include: {
      courseLevel: {
        include: {
          course: true,
        },
      },
      collaborator: {
        include: {
          company: true,
        },
      },
    },
    orderBy: {
      collaboratorId: "desc",
    },
  });

  console.log({
    first: certificates.filter(
      (cer) => cer.monthsToExpire && addMonths(cer.date, cer.monthsToExpire) - new Date()
    ),
  });

  console.log({adt: addMonths(certificates[0].date, certificates[0].monthsToExpire)})

  return (
    <div>
      <TitleOnPage text="Certificados" bcrumb={crumbs} />

      <TabsCertificates certificates={certificates} />
    </div>
  );
};

export default CertificatePage;
