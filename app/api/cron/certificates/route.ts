import { getCertificatesToExpireSoon } from "@/actions/get-certificates-toexpire-soon";
import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log('Iniciando búsqueda de certificados...');
        console.log('NODE_ENV:', process.env.NODE_ENV);
        console.log('DATABASE_URL disponible:', !!process.env.DATABASE_URL);
        
        const certificates = await getCertificatesToExpireSoon();
        const baseUrl = process.env.NEXTAUTH_URL;

        console.log('Configuración:', {
            baseUrl,
            certificatesFound: certificates.length,
            environment: process.env.NODE_ENV
        });

        const sentEmails = new Set();
        let emailsSent = 0;

        for (const certificate of certificates) {
            const email = certificate.collaborator?.company?.email;

            if (!email || sentEmails.has(email)) {
                console.log('Saltando certificado:', {
                    reason: !email ? 'No email' : 'Email ya enviado',
                    certificateId: certificate.id
                });
                continue;
            }

            try {
                await axios.post(`${baseUrl}/api/mail/certificate-toexpire-soon`, {
                    certificate,
                    email,
                });

                sentEmails.add(email);
                emailsSent++;
                console.log('Email enviado exitosamente:', {
                    email,
                    certificateId: certificate.id
                });
            } catch (error) {
                const axiosError = error as AxiosError;
                console.error("Error enviando email:", {
                    error: axiosError.message,
                    certificateId: certificate.id,
                    email
                });
            }
        }

        return NextResponse.json({
            success: true,
            sent: emailsSent,
            totalCertificates: certificates.length,
            certificates,
            date: new Date().toISOString(),
            environment: process.env.NODE_ENV
        });
    } catch (error) {
        const err = error as Error;
        console.error("[CRON-CERTIFICATE-TO-EXPIRE-SOON]", {
            error: err.message,
            stack: err.stack
        });
        return new NextResponse("Internal Error: " + err.message, { status: 500 })
    }
}