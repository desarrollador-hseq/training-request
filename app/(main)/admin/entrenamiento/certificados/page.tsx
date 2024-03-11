import { db } from "@/lib/db";
import { TitleOnPage } from "@/components/title-on-page";
import { TabsCertificates } from "./_components/tabs-certificates";


const crumbs = [{ label: "certificados", path: "certificados" }];

const CertificatePage = async () => {
  const certificates = await db.certificate.findMany({
    
    include: {
      courseLevel: {
        select: {
          monthsToExpire: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
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
