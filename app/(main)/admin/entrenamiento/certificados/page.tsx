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

  // console.log({
  //   first: certificates.filter(
  //     (cer) => cer.monthsToExpire && addMonths(cer.date, cer.monthsToExpire) - new Date()
  //   ),
  // });


  return (
    <div>
      <TitleOnPage text="Certificados" bcrumb={crumbs} />

      <TabsCertificates certificates={certificates} />
      <div>
      <div className="min-h-[2000px]">
        
    
      {/* <CertificateExample name={name} id={id} date={date} reentrenamiento={reentrenamiento} /> */}
      </div>
      </div>
    </div>
  );
};

export default CertificatePage;
