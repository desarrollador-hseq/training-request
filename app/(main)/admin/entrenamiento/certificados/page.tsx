import { TitleOnPage } from "@/components/title-on-page";
// import { TabsCompanies } from "./_components/tabs-companies";
import { db } from "@/lib/db";
import { TabsCertificates } from "./_components/tabs-certificates";

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
  return (
    <div>
      <TitleOnPage text="Certificados" bcrumb={crumbs} />

      <TabsCertificates certificates={certificates} />
    </div>
  );
};

export default CertificatePage;
