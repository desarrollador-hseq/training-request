import { getCertificatesToExpireSoon } from "@/actions/get-certificates-toexpire-soon";
import axios from "axios";
import cron from "node-cron";

export const cronCertificateToExpireSoons = () => {
  const cronJobTime =
    process.env.CRON_CERTIFICATE_EXPIRE_JOB_TIME || "00 10 * * *";
    
  cron.schedule(cronJobTime, async () => {
    try {
      const baseUrl = process.env.NEXTAUTH_URL;
      const certificatesToExpireSoon = await getCertificatesToExpireSoon();

      console.log("cron___certificate___expire");
      console.log({ date: new Date() });

      const sentEmails = new Set(); // Conjunto para almacenar correos electrónicos enviados recientemente
      
      let con = 0;
      for (const certificate of certificatesToExpireSoon) {
        const { collaborator } = certificate;
        const email = collaborator?.company?.email;
        
        if (!email || sentEmails.has(email)) {
          continue; 
        }

        try {
          // await axios.post(`${baseUrl}/api/mail/certificate-toexpire-soon`, {
          //   certificate,
          //   email,
          // });
          con++
          sentEmails.add(email);
          console.log("mensaje enviado: " + con)
        } catch (error) {
          console.log("Error sending email for expiring certificate: " + error);
        }
      }

      console.log("_______________________________________");
    } catch (error) {
      console.error("Error:", error);
    }
  });
};