import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeftIcon } from "lucide-react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { ShowCertificate } from "./_components/show-certificate";
import { TitleOnPage } from "@/components/title-on-page";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const crumbs = [
  { label: "certificados", path: "certificados" },
  { label: "Ver", path: "ver" },
];

const ShowCertificatePage = async ({
  params,
}: {
  params: { certificateId: string };
}) => {
  const session = await getServerSession(authOptions);

  const baseUrl = process.env.NEXTAUTH_URL;

  if (!session) redirect("/");

  const certificate = await db.certificate.findUnique({
    where: {
      id: params.certificateId,
      active: true,
      collaborator: {
        companyId: session.user.id,
      },
    },
  });

  return (
    <div>
      {certificate && (
        <TitleOnPage
          text={`Ver certificado: (${certificate?.collaboratorFullname} - ${certificate?.courseName} - ${certificate?.levelName})`}
          bcrumb={crumbs}
        />
      )}
      {certificate ? (
        <ShowCertificate certificate={certificate} baseUrl={`${baseUrl}`} />
      ) : (
        <Card className="mt-2 bg-red-400">
          <CardHeader className="flex flex-row gap-5">
            <Link
              href={`/dashboard/entrenamiento/certificados`}
              className={cn(buttonVariants())}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Regresar
            </Link>
            <h3 className="text-2xl  text-white">Certificado no encontrado</h3>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default ShowCertificatePage;
