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
import { formatDateCert, formatDateOf } from "@/lib/utils";
import { Certificate } from "@prisma/client";
import { DocumentCertificateTemplateCuesV2 } from "./document-certificate-template-cues-v2";

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

interface CertificateTemplateV2Props {
  certificate: Certificate;
  baseUrl: string;
}

const getCertificationDatesText = (
  course: string | null,
  expeditionDate: Date
) => {
  const approvalDate = new Date("2018-06-02");
  const expirationDate2024 = new Date("2024-06-01");
  const expirationDate2027 = new Date("2027-06-01");
  const formattedApprovalDate = formatDateOf(approvalDate);
  const formattedExpirationDate2024 = formatDateOf(expirationDate2024);
  const formattedExpirationDate2027 = formatDateOf(expirationDate2027);

  if (!expeditionDate) return "";

  if (course === "Trabajo en altura") {
    if (expeditionDate > expirationDate2024) {
      return `, certificación NTC 6072 Icontec CS-CER602230 fecha de aprobación y vencimiento del ${formattedApprovalDate} al ${formattedExpirationDate2027} respectivamente y aprobación del `;
    } else {
      return `, certificación NTC 6072 Icontec CS-CER602230 fecha de aprobación y vencimiento del ${formattedApprovalDate} al ${formattedExpirationDate2024} respectivamente y aprobación del `;
    }
  } else if (course === "Espacios confinados") {
    return ` y aprobación del ministerio O8SE2023220000000004039 de fecha 08 de febrero de 2023.`;
  } else {
    return `.`;
  }
};

export const DocumentCertificateTemplateV2 = ({
  certificate,
  baseUrl,
}: CertificateTemplateV2Props) => {
  const fileUrl = baseUrl + "/verificar-certificado/" + certificate.id;

  if (certificate.courseName === "Mercancías peligrosas") {
    return (
      <DocumentCertificateTemplateCuesV2
        course={certificate.courseName}
        fullname={certificate.collaboratorFullname}
        numDoc={certificate.collaboratorNumDoc}
        typeDoc={certificate.collaboratorTypeDoc}
        levelHours={"" + certificate.levelHours}
        fileUrl={`${fileUrl}`}
        certificateId={certificate.id}
        expireDate={certificate.dueDate && formatDateOf(certificate.dueDate)}
        expeditionDate={
          certificate.expeditionDate &&
          formatDateCert(certificate.expeditionDate)
        }
      />
    );
  }

  const certificationDatesText = certificate.expeditionDate
    ? getCertificationDatesText(
        certificate.courseName,
        certificate.expeditionDate
      )
    : "";

  return (
    <Document
      style={{ height: "100%" }}
      title={`Certificado de ${certificate.collaboratorFullname} - ${certificate.courseName}`}
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
            <Text style={styles.titleText}>
              {" "}
              CERTIFICADO DE CAPACITACIÓN Y ENTRENAMIENTO
              {certificate.courseName === "Trabajo en altura"
                ? " PARA TRABAJO EN ALTURA"
                : ""}
            </Text>
          </View>

          {/* Company Name */}
          <Text style={styles.companyName}>
            HSEQ CONSULTORIA EN GESTIÓN INTEGRAL DE RIESGOS SAS
          </Text>

          {/* Company NIT */}
          <Text style={styles.companyNit}>NIT: 900607813</Text>

          {/* Company Description */}
          <Text style={styles.companyDescription}>
            con licencia en SST 560 de 2023{certificationDatesText}
            {certificate.courseName === "Trabajo en altura" ? (
              <Text style={styles.ministryApproval}>
                {" "}
                ministerio O8SE2018220000000025118
              </Text>
            ) : certificate.courseName === "Espacios confinados" ? (
              <Text style={styles.ministryApproval}>
                {" "}
                ministerio O8SE2023220000000004039
              </Text>
            ) : null}
            {certificate.courseName === "Trabajo en altura" ? (
              <Text style={styles.approvalDate}>
                {" "}
                de fecha 10 de Julio de 2018.
              </Text>
            ) : certificate.courseName === "Espacios confinados" ? (
              <Text style={styles.approvalDate}>
                {" "}
                de fecha 08 de febrero de 2023.
              </Text>
            ) : (
              <Text style={styles.approvalDate}>.</Text>
            )}
          </Text>
        </View>

        {/* White Content Area */}
        <View style={styles.contentArea}>
          {/* Certificate Text */}
          <Text style={styles.certifiesText}>Certifica que</Text>

          {/* Recipient Name */}
          <Text style={styles.recipientName}>
            {certificate.collaboratorFullname}
          </Text>

          {/* Recipient ID */}
          <Text style={styles.recipientId}>
            {certificate.collaboratorTypeDoc}: {certificate.collaboratorNumDoc}
          </Text>

          {/* Affiliation Text */}
          {certificate.courseName?.toLowerCase() === "trabajo en altura" &&
          certificate.collaboratorArlName &&
          certificate.companyName &&
          certificate.companyNit &&
          certificate.legalRepresentative ? (
            <Text style={styles.affiliationText}>
              Afiliado a la ARL{" "}
              <Text style={styles.boldText}>
                {certificate.collaboratorArlName}
              </Text>{" "}
              contratado por{" "}
              <Text style={styles.boldText}>{certificate.companyName}</Text>{" "}
              registrada bajo NIT{" "}
              <Text style={styles.boldText}>{certificate.companyNit}</Text>,
              representante legal{" "}
              <Text style={styles.boldText}>
                {certificate.legalRepresentative}
              </Text>
              . Asistió y aprobó la acción de capacitación y entrenamiento en
              nivel
            </Text>
          ) : (
            <Text style={styles.affiliationText}>
              Asistió y aprobó la acción de capacitación y entrenamiento en
              nivel
            </Text>
          )}

          {/* Course Name */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {certificate.levelName}
            </Text>
            {certificate.courseName?.toLowerCase() !=
            certificate.levelName?.toLowerCase() ? (
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {certificate.courseName}
              </Text>
            ) : (
              <View />
            )}
          </View>

          {/* Resolution */}
          {certificate.resolution ? (
            <Text style={{ fontSize: 10, fontWeight: "semibold" }}>
              {certificate.resolution}
            </Text>
          ) : (
            <View />
          )}
          {/*  Hours */}
          <View style={{ marginBottom: 5 }}>
            <Text style={{ fontSize: 10, fontWeight: "semibold" }}>
              Con una intensidad de{" "}
              <Text style={{ fontWeight: "bold" }}>
                {certificate.levelHours} Horas.
              </Text>{" "}
            </Text>
          </View>
          {/* Issue Date and Retraining */}
          <Text style={styles.issueDateText}>
            Se expide en Barranquilla a los{" "}
            {certificate.expeditionDate &&
              formatDateOf(certificate.expeditionDate)}
            {certificate.dueDate
              ? `, con reentrenamiento mínimo programado para el ${
                  certificate.dueDate && formatDateOf(certificate.dueDate)
                }`
              : "."}
          </Text>

          {/* Verification Number */}
          {/* <Text style={styles.verificationNumber}>
            Nº único de verificación {certificateId || "2024-0054HSEQ"}
          </Text> */}

          {/* Verification Instructions */}
          <Text style={styles.verificationInstructions}>
            La autenticidad de este certificado puede ser verificado al correo
            info@grupohseq.com tel. 3851821-3145468721-3235824200 o en la Pag.
            www.grupohseq.com
          </Text>

          {/* Company Address */}
          <Text style={styles.companyAddress}>
            Calle 30 #10-230 L. 1 y Bodega interna 33
          </Text>
        </View>

        {/* Signatures Section */}
        <View style={styles.signaturesSection}>
          {/* Coach Signature */}
          {(certificate.courseName === "Trabajo en altura" ||
            certificate.courseName === "Espacios confinados") &&
          certificate.coachName &&
          certificate.coachImgSignatureUrl &&
          certificate.coachPosition ? (
            <DocumentSignatureCertificate
              name={certificate.coachName}
              position={certificate.coachPosition}
              licence={certificate.coachLicence}
              imageUrl={certificate.coachImgSignatureUrl}
            />
          ) : null}
          <DocumentSignatureCertificate
            name="Jaime Rosales Rodriguez"
            position="Representante legal"
            licence="Grupo HSEQ"
            imageUrl="/JAIME_R.png"
          />
          {/* Legal Representative Signature */}
        </View>
        {fileUrl && (
          <View style={styles.qrContainer}>
            <Link src={fileUrl}>
              <Image style={styles.qrCode} src={QRCode.toDataURL(fileUrl)} />
            </Link>
          </View>
        )}
        {/* Bottom Elements */}
        <View style={styles.bottomElements}>
          {/* QR Code */}

          {/* Colcade Image */}

          <Image
            src="/hseq.png"
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F1729",
    textAlign: "center",
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
    fontSize: 10,
    textAlign: "center",
    color: "#0F1729",
    lineHeight: 1.3,
    maxWidth: "85%",
  },
  companyAddress: {
    fontSize: 10,
    textAlign: "center",
    color: "#0F1729",
  },
  signaturesSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "50%",
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
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 40,
    position: "absolute",
    bottom: 40,
    right: 0,
  },
  qrContainer: {
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    left: 85,
  },
  qrCode: {
    width: 70,
    height: 70,
  },
});
