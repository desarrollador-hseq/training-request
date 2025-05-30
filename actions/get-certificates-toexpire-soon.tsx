import { db } from "@/lib/db";
import { Certificate } from "@prisma/client";

import { addHours, addMonths, endOfDay, startOfDay } from "date-fns";

interface CertificateWithCompanyEmail extends Certificate {
  collaborator: {
    company: { email: string | null | undefined; nameContact: string | null | undefined } | null | undefined;
  };
}
// Función para obtener los certificados que están a punto de vencer dentro de un mes
export const getCertificatesToExpireSoon = async (): Promise<CertificateWithCompanyEmail[]> => {
  // const currentDate = addMonths(new Date(), 1);
  // const startDate = startOfDay(currentDate);
  const targetDate = addMonths(new Date(), 1);
  const startDate = startOfDay(targetDate);
  const endDate = endOfDay(targetDate);

  // Agregar 24 horas a startDate para obtener endDate
  // const endDate = addHours(startDate, 24);

  const certificates = await db.certificate.findMany({
    where: {
      dueDate: {
        gte: startDate,
        lte: endDate,
      },
      active: true,
      collaborator: {
        active: true,
      },
    },
    include: {
      collaborator: {
        select: {
          company: {
            select: {
              email: true,
              nameContact: true
            },
          },
        },
      },
    },
  });

  console.log({getcert: certificates})

  return certificates;
};
