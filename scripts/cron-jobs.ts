import { getCertificatesToExpireSoon } from "@/actions/get-certificates-toexpire-soon";
import axios from "axios";
import cron from "node-cron";

export const cronCertificateToExpireSoon = () => {
  const cronJobTime =
    process.env.CRON_CERTIFICATE_EXPIRE_JOB_TIME || "00 10 * * *";
    
  cron.schedule(cronJobTime, async () => {
    try {
      const baseUrl = process.env.NEXTAUTH_URL;
      // Obtiene los certificados próximos a vencer dentro de un mes
      const certificatesToExpireSoon = await getCertificatesToExpireSoon();
      console.log("cron____certificate___expire");
      console.log({ date: new Date() });

      // Envía un correo electrónico para cada certificado encontrado
      certificatesToExpireSoon?.forEach(async (certificate) => {
        console.log({ emailexpiresoon: JSON.stringify(certificate) });
        try {
          const enviarCorreo = async () => {
          await axios.post(`${baseUrl}/api/mail/certificate-toexpire-soon`, {
            certificate,
            email: certificate.collaborator?.company?.email,
          });
        }
        enviarCorreo();
        } catch (error) {
          console.log("Error send email expire cert: " + error);
        }
      });

      console.log("_______________________________________");
    } catch (error) {
      console.error("Error :", error);
    }
  });
};
