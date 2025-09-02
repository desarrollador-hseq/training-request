"use client";

import {
  Document,
  Page,
  Text,
  StyleSheet,
  View,
  Image,
  Font,
  Link,
} from "@react-pdf/renderer";
import QRCode from "qrcode";
import { DocumentSignatureCertificate } from "../../document-signature-certificate";
import { formatDateOf } from "@/lib/utils";
import { Certificate } from "@prisma/client";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-400.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-500.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf",
      fontWeight: 700,
    },
  ],
});

interface DocumentCertificateTemplateCuesV2Props {
  fileUrl?: string | null;
  certificateId?: string | null;
  // consecutive: string | null;
  fullname: string | null;
  numDoc: string | null;
  typeDoc: string | null;
  course: string | null;
  levelHours: string | null;

  expeditionDate: string | null;
  expireDate?: string | null;
}

export const DocumentCertificateTemplateCuesV2 = ({
  fileUrl,
  fullname,
  numDoc,
  typeDoc,
  course,
  levelHours,
  expeditionDate,
  expireDate,
}: DocumentCertificateTemplateCuesV2Props) => {
  return (
    <Document
      style={{ height: "100%" }}
      title={`Certificado de ${fullname} - ${course}`}
      author="Grupo HSEQ"
      producer="A. Innovacion - Grupo HSEQ"
      creationDate={new Date()}
      creator="Grupo HSEQ"
      language="es"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        >
          <Image
            src={`/bg-certificate-2025.png`}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        {/* Blue Header Background */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Image source={`/hseq.png`} />
          </View>

          {/* Company Name */}
          <Text style={styles.companyName}>
            HSEQ CONSULTORIA EN GESTIÓN INTEGRAL DE RIESGOS SAS
          </Text>

          {/* Company NIT */}
          <Text style={styles.companyNit}>NIT: 900607813</Text>

          {/* Company Description */}
          <Text style={styles.companyDescription}>
            en alianza con la corporación universitaria empresarial de salamanca
            Aprobada según Resolución 3062 de 1999-12-02 expedida por el
            Ministerio de Educación Superior
          </Text>
        </View>

        {/* White Content Area */}
        <View style={styles.contentArea}>
          {/* Certificate Text */}
          <Text style={styles.certifiesText}>Certifica que</Text>

          {/* Recipient Name */}
          <Text style={styles.recipientName}>{fullname}</Text>

          {/* Recipient ID */}
          <Text style={styles.recipientId}>
            {typeDoc}: {numDoc}
          </Text>

          <Text style={styles.affiliationText}>
            Asistió y aprobó la acción de formación al
          </Text>

          {/* Course Name */}
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              CURSO BÁSICO OBLIGATORIO PARA LOS CONDUCTORES
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              QUE TRANSPORTAN MERCANCIAS PELIGROSAS, SEGÚN RESOLUCIÓN 1223 DE
              2014
            </Text>
          </View>

          {/*  Hours */}
          <View style={{ marginBottom: 5 }}>
            <Text style={{ fontSize: 10, fontWeight: "semibold" }}>
              Con una intensidad de{" "}
              <Text style={{ fontWeight: "bold" }}>{levelHours} Horas.</Text>{" "}
            </Text>
          </View>
          {/* Issue Date and Retraining */}
          <Text style={styles.issueDateText}>
            En testimonio de lo anterior se firma y autoriza en Barranquilla a
            los {expeditionDate}
            {expireDate
              ? `,  Con actualización minima programadapara el  ${expireDate}`
              : "."}
          </Text>

          {/* Verification Number */}
          {/* <Text style={styles.verificationNumber}>
            Nº único de verificación {certificateId || "2024-0054HSEQ"}
          </Text> */}
        </View>

        {/* Signatures Section */}
        <View style={styles.signaturesSection}>
          <DocumentSignatureCertificate
            name="Jaime Rosales Rodriguez"
            position="Representante legal"
            licence="Grupo HSEQ"
            imageUrl="/JAIME_R.png"
            imgStyle={{
              top: 5,
            }}
          />
          {/* Legal Representative Signature */}
        </View>

        {/* Bottom Elements */}
        <View style={styles.bottomElements}>
          {/* QR Code */}
          <View style={styles.qrContainer}>
            {fileUrl && (
              <Link src={fileUrl}>
                <Image style={styles.qrCode} src={QRCode.toDataURL(fileUrl)} />
              </Link>
            )}
          </View>
          {/* Colcade Image */}
          {/* Verification Instructions */}
          <View
            style={{
              marginBottom: 5,
              margin: "0 auto",

              alignItems: "center",
              justifyContent: "center",
              width: "50%",
            }}
          >
            <Text style={styles.verificationInstructions}>
              La autenticidad de este certificado puede ser verificado a traves
              del código QR o en el sitio web del Ministerio de Transporte:
              https://web.mintransporte.gov.co/sisconmp2/ConsultasCapacitaciones
            </Text>

            {/* Company Address */}
            <Text style={styles.companyAddress}>
              Calle 30 #10-230 L. 1 y Bodega interna 33
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "25%",
            }}
          >
            <Image
              src="/cues-logo-v2.png"
              style={{
                width: 60,
                height: 60,
              }}
            />

            {/* Colombia Emblem */}

            <Image
              src="/flores-colombia.png"
              style={{
                width: 50,
                height: 50,
              }}
            />

            {/* Coat of Arms */}
            <Image
              src="/escudo-colombia.png"
              style={{
                width: 50,
                height: 50,
              }}
            />
          </View>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Open Sans",
    position: "relative",
    padding: 0,
  },
  titleContainer: {
    width: "550px",
    height: "60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  titleText: {
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    letterSpacing: -1,
    fontSize: 23,
    fontWeight: "black",
    lineHeight: 1,
  },
  header: {
    marginTop: 5,
    paddingBottom: 5,
    alignItems: "center",
    position: "relative",
  },
  logoContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#f97316",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F1729",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
    lineHeight: 1.2,
  },
  companyNit: {
    fontSize: 13,
    fontWeight: "semibold",
    color: "#0F1729",
    marginBottom: 5,
  },
  companyDescription: {
    maxWidth: "65%",
    fontSize: 10,
    color: "#0F1729",
    textAlign: "center",
    lineHeight: 1,
    marginTop: 4,
  },
  ministryApproval: {
    fontWeight: "semibold",
  },
  approvalDate: {
    fontWeight: "semibold",
  },
  contentArea: {
    maxWidth: "80%",
    margin: "0 auto",
    padding: 5,
    paddingTop: 5,
    position: "relative",
    alignItems: "center",
  },
  certifiesText: {
    fontSize: 17,
    fontWeight: "black",
    textAlign: "center",
    marginBottom: 3,
    color: "#0F1729",
  },
  recipientName: {
    fontSize: 24,
    fontWeight: "black",
    letterSpacing: -1,
    textAlign: "center",
    marginBottom: 3,
    color: "#0F1729",
    textTransform: "uppercase",
  },
  recipientId: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    color: "#0F1729",
  },
  affiliationText: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 10,
    color: "#0F1729",
    lineHeight: 1.4,
    maxWidth: "90%",
  },
  boldText: {
    fontWeight: "semibold",
  },
  courseName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#0F1729",
    textTransform: "uppercase",
  },
  resolutionText: {
    fontSize: 14,
    fontWeight: "semibold",
    textAlign: "center",
    marginBottom: 25,
    color: "0F1729",
  },
  issueDateText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "0F1729",
  },
  verificationNumber: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#0F1729",
  },
  verificationInstructions: {
    fontSize: 8,
    textAlign: "center",
    color: "#0F1729",
    lineHeight: 1.3,
  },
  companyAddress: {
    fontSize: 8,
    textAlign: "center",
    color: "#0F1729",
  },
  signaturesSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingTop: 5,
    paddingBottom: 5,
    margin: "0 auto",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: -2,
  },
  signatureContainer: {
    alignItems: "center",
    minWidth: 200,
  },
  signatureImage: {
    width: 120,
    height: 60,
  },
  signatureName: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0F1729",
    lineHeight: 1,
  },
  signaturePosition: {
    fontSize: 10,
    textAlign: "center",
    color: "#0F1729",
    lineHeight: 1,
  },
  signatureLicence: {
    fontSize: 10,
    textAlign: "center",
    color: "#0F1729",
    lineHeight: 1,
  },
  bottomElements: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  qrContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",

    width: "25%",
  },
  qrCode: {
    width: 70,
    height: 70,
  },
});
