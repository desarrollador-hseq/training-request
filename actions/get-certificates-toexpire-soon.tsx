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
  const targetDate = addMonths(new Date(), 1);
  const startDate = startOfDay(targetDate);
  const endDate = endOfDay(targetDate);

  console.log('Buscando certificados con fechas:', {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    currentDate: new Date().toISOString()
  });

  // Primero verificamos si hay certificados en general
  const allCertificates = await db.certificate.count({
    where: {
      active: true,
    }
  });

  console.log('Total de certificados activos:', allCertificates);

  // Luego buscamos los certificados que están por vencer
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

  console.log('Certificados encontrados que vencen pronto:', certificates.length);
  
  // Si no hay certificados, hagamos una búsqueda más amplia para debug
  if (certificates.length === 0) {
    const nextThreeMonths = await db.certificate.findMany({
      where: {
        dueDate: {
          gte: new Date(),
          lte: addMonths(new Date(), 3),
        },
        active: true,
      },
      select: {
        id: true,
        dueDate: true,
      }
    });
    
    console.log('Certificados en los próximos 3 meses:', {
      count: nextThreeMonths.length,
      certificates: nextThreeMonths
    });
  }

  return certificates;
};
