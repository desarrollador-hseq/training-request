import { redirect } from "next/navigation";
import { GanttChartSquare } from "lucide-react";
import { AddCertificateForm } from "./add-certificate-form";
import { db } from "@/lib/db";
import { CertificateItemTimeline } from "./certificate-item-timeline";
import { TitleOnPage } from "@/components/title-on-page";
import { SimpleModal } from "@/components/simple-modal";

const bcrumb = [
  { label: "Certificados", path: "/dashboard/entrenamiento/certificados" },
  { label: "Editar", path: "editar" },
];

const EditCertificate = async ({
  params,
}: {
  params: { certificateId: string };
}) => {
  const { certificateId } = params;

  const baseUrl = process.env.NEXTAUTH_URL;

  const certificate = await db.certificate.findUnique({
    where: {
      id: certificateId,
      active: true,
    },
  });

  if (!certificate) {
    redirect("/admin/entrenamiento/cursos/");
  }

  const certificateEvents = await db.certificateEvent.findMany({
    where: {
      certificateId: certificate.id,
    },
    include: {
      admin: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div>
      <TitleOnPage text={`Editar Certificado`} bcrumb={bcrumb} >
        <SimpleModal
          textBtn={<GanttChartSquare />}
          btnClass={`bg-accent text-white`}
          title="Linea de tiempo"
        >
          <div className="mx-5 w-fit">
            <ol className="relative border-s border-primary ">
              {certificateEvents.map((event) => (
                <CertificateItemTimeline event={event} />
              ))}
            </ol>
          </div>
        </SimpleModal>
      </TitleOnPage>
      <AddCertificateForm certificate={certificate} baseUrl={`${baseUrl}`} />
    </div>
  );
};

export default EditCertificate;
