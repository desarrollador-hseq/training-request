import { redirect } from "next/navigation";
import { GanttChartSquare } from "lucide-react";
import { db } from "@/lib/db";
import { CertificateItemTimeline } from "./_components/certificate-item-timeline";
import { TitleOnPage } from "@/components/title-on-page";
import { SimpleModal } from "@/components/simple-modal";
import { TabsEditCertificate } from "./_components/tabs-edit-certificate";
import { DeactivateCertificate } from "./_components/deactivate-certificate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const bcrumb = [
  { label: "Certificados", path: "/dashboard/entrenamiento/certificados" },
  { label: "Editar", path: "editar" },
];

const EditCertificate = async ({
  params,
}: {
  params: { certificateId: string };
}) => {
  const session = await getServerSession(authOptions);

  const { certificateId } = params;

  const baseUrl = process.env.NEXTAUTH_URL;

  const certificate = await db.certificate.findUnique({
    where: {
      id: certificateId,
      active: true,
    },
    include: {
      collaborator: {
        select: {
          company: {
            select: {
              nameContact: true,
              email: true
            }
          }
        }
      }
    }
  });

  if (!certificate) {
    redirect("/admin/entrenamiento/certificados/");
  }

  const certificateEvents = await db.certificateEvent.findMany({
    where: {
      certificateId: certificate.id,
    },
    include: {
      admin: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const coaches = await db.coach.findMany({
    where: {
      active: true,
    },
  });

  return (
    <div>
      <TitleOnPage
        text={`Editar Certificado`}
        bcrumb={bcrumb}
        className="bg-gradient-to-b from-red-700 to-red-900"
      >
        <SimpleModal
          textBtn={<GanttChartSquare />}
          btnClass={`bg-accent text-white`}
          title="Linea de tiempo"
        >
          <div className="mx-5 w-fit">
            <ol className="relative border-s border-primary ">
              {certificateEvents.map((event) => (
                <CertificateItemTimeline key={event.id} event={event} />
              ))}
            </ol>
          </div>
        </SimpleModal>
      </TitleOnPage>
      <TabsEditCertificate
        coaches={coaches}
        certificate={certificate}
        baseUrl={`${baseUrl}`}
        companyContact={certificate.collaborator.company?.nameContact}
        companyEmail={certificate.collaborator.company?.email}
        canManagePermissions={session?.user.canManagePermissions || false}
      />
    </div>
  );
};

export default EditCertificate;
