import { getCertificatesToExpireSoon } from "@/actions/get-certificates-toexpire-soon";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const certificates = await getCertificatesToExpireSoon();
        const baseUrl = process.env.NEXTAUTH_URL;

        const sentEmails = new Set();
        let emailsSent = 0;

        console.log({certificates})

        for (const certificate of certificates) {
            const email = certificate.collaborator?.company?.email;

            if (!email || sentEmails.has(email)) continue;

            try {
                // await axios.post(`${baseUrl}/api/mail/certificate-toexpire-soon`, {
                //     certificate,
                //     email,
                // });

                sentEmails.add(email);
                emailsSent++;
            } catch (error) {
                console.log("Error sending email:", error);
            }
        }

        return NextResponse.json({
            success: true,
            sent: emailsSent,
            date: new Date().toISOString()
        });
    } catch (error) {
        console.log("[CRON-CERTIFICATE-TO-EXPIRE-SOON]", error)
        return new NextResponse("Internal Errorr " + error, { status: 500 })
    }
}