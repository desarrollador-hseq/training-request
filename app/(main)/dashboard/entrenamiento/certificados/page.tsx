import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
// import { TabsCompanies } from "./_components/tabs-companies";
import { db } from "@/lib/db";
import { TabsCertificates } from "./_components/tabs-certificates";
import { TitleOnPage } from "@/components/title-on-page";
import { authOptions } from "@/lib/authOptions";


const crumbs = [{ label: "certificados", path: "certificados" }];

const CertificatePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/dashboard/entrenamiento/certificados");

  const certificates = await db.certificate.findMany({
    where: {
      collaborator: {
        companyId: session.user.id,
        // active: true,
      },
      active: true,
      wasSent: true,
    },
    include: {
      courseLevel: {
        select: {
          monthsToExpire: true,
        },
      },
    },
    orderBy: {
      collaboratorFullname: "desc",
    },
  });


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
