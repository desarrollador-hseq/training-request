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
import { capitalize, formatDateCert, formatDateOf } from "@/lib/utils";
import { Certificate } from "@prisma/client";
import { DocumentCertificateTemplateCues } from "./document-certificate-template-cues-v1";

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

interface CertificateTemplatePropsV1 {
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

export const DocumentCertificateTemplateV1 = ({
  certificate,
  baseUrl,
}: CertificateTemplatePropsV1) => {
  const certificationDatesText = certificate.expeditionDate
    ? getCertificationDatesText(
        certificate.courseName,
        certificate.expeditionDate
      )
    : "";

  const fileUrl = baseUrl + "/verificar-certificado/" + certificate.id;

  if (certificate.courseName === "Mercancías peligrosas") {
    return (
      <DocumentCertificateTemplateCues
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
            width: "90%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <View style={styles.container}>
            {/* 1column  */}
            <View style={styles.sideContent}>
              <View style={{ marginVertical: 2 }}></View>
              {certificate.courseName === "Trabajo en altura" ? (
                <View
                  style={{
                    width: "400px",
                    height: "80px",
                    backgroundColor: "#a30e0c",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    textAlign: "left",
                    color: "white",
                    transform: "rotate(-90deg)",
                    padding: "18px",
                    paddingTop: "10px",
                    fontSize: 16,
                    gap: 5,
                  }}
                >
                  <Text style={{ fontWeight: "semibold" }}>
                    {" "}
                    CERTIFICADO DE CAPACITACIÓN{" "}
                  </Text>
                  <Text style={{ fontWeight: "semibold" }}>
                    {" "}
                    Y ENTRENAMIENTO PARA TRABAJO EN ALTURA
                  </Text>
                </View>
              ) : (
                <View style={styles.textMain}>
                  <Text style={{ fontWeight: "semibold" }}>
                    {" "}
                    CERTIFICACIÓN DE CAPACITACIÓN{" "}
                  </Text>
                  <Text style={{ fontWeight: "semibold" }}>
                    {" "}
                    Y ENTRENAMIENTO
                  </Text>
                </View>
              )}

              <View style={{ margin: 15 }}></View>

              <Image
                style={{ width: 100, height: 40 }}
                source={`/hseq-sin-b.png`}
              />
            </View>
            {/* 2 column  */}
            <View style={styles.textContent}>
              <View style={{ height: "100%" }}>
                <View
                  style={{
                    height: 38,
                    width: 150,
                    marginTop: 23,
                    marginBottom: 5,
                  }}
                >
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    source={`/hseq-entrenamiento.png`}
                  />
                </View>
                <View
                  style={{
                    marginBottom: 10,
                  }}
                >
                  <Text>
                    <Text
                      style={{
                        color: "#525659",
                        fontWeight: "semibold",
                        fontSize: 9,
                      }}
                    >
                      HSEQ Consultoría en Gestión Integral de Riesgos S.A.S, NIT
                      900607813-2
                    </Text>
                    <Text style={styles.subtitle}>
                      , con licencia en SST 560 de 2023
                      {certificate.courseName === "Trabajo en altura" ? (
                        // altura
                        <Text>
                          <Text>{certificationDatesText}</Text>
                          <Text
                            style={{
                              color: "#525659",
                              fontWeight: "semibold",
                              fontSize: 9,
                            }}
                          >
                            {" "}
                            ministerio O8SE2018220000000025118
                          </Text>
                          <Text style={styles.subtitle}>
                            {" "}
                            de fecha 10 de Julio de 2018.
                          </Text>
                        </Text>
                      ) : certificate.courseName === "Espacios confinados" ? (
                        // confinado
                        <Text>
                          <Text> y aprobación del</Text>
                          <Text
                            style={{
                              color: "#525659",
                              fontWeight: "semibold",
                              fontSize: 9,
                            }}
                          >
                            {" "}
                            ministerio O8SE2023220000000004039
                          </Text>{" "}
                          <Text>de fecha 08 de febrero de 2023.</Text>
                        </Text>
                      ) : (
                        "."
                      )}
                    </Text>
                  </Text>
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    marginBottom: 10,
                    marginTop:
                      certificate.courseName !== "Trabajo en altura" &&
                      certificate.courseName !== "Espacios confinados"
                        ? 23
                        : 1,
                  }}
                >
                  CERTIFICA QUE
                </Text>

                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "black",
                    textTransform: "uppercase",
                    borderBottom: "2px solid #a30e0c",
                    display: "flex",
                  }}
                >
                  {certificate.collaboratorFullname}
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: 5,
                    color: "#444749",
                  }}
                >
                  Con{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {certificate.collaboratorTypeDoc}
                  </Text>
                  .{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {certificate.collaboratorNumDoc}
                  </Text>
                </Text>

                {certificate.courseName?.toLowerCase() ===
                  "trabajo en altura" &&
                certificate.collaboratorArlName &&
                certificate.companyName &&
                certificate.companyNit &&
                certificate.legalRepresentative ? (
                  <Text
                    style={{
                      fontSize: 10,
                      marginBottom: 10,
                      color: "#444749",
                      lineHeight: "1.3px",
                    }}
                  >
                    Afiliado a la ARL{" "}
                    <Text style={{ fontWeight: "semibold" }}>
                      {certificate.collaboratorArlName}
                    </Text>{" "}
                    contratado por{" "}
                    <Text style={{ fontWeight: "semibold" }}>
                      {certificate.companyName}
                    </Text>{" "}
                    registrada bajo NIT{" "}
                    <Text style={{ fontWeight: "semibold" }}>
                      {certificate.companyNit}
                    </Text>
                    , representante legal{" "}
                    <Text style={{ fontWeight: "semibold" }}>
                      {certificate.legalRepresentative}
                    </Text>
                    .
                  </Text>
                ) : (
                  <View />
                )}

                <Text style={{ ...styles.text, marginBottom: 5 }}>
                  Asistió y aprobó la acción de capacitación y entrenamiento en
                  {certificate.courseName === "Trabajo en altura" ||
                  certificate.courseName === "Espacios confinados" ? (
                    " nivel"
                  ) : (
                    <View />
                  )}
                </Text>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      marginTop: 5,
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
                        fontSize: 20,
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

                {certificate.resolution ? (
                  <Text style={{ fontSize: 11, fontWeight: "semibold" }}>
                    {certificate.resolution}
                  </Text>
                ) : (
                  <View />
                )}
                <View style={{ marginBottom: 5, marginTop: 12 }}>
                  <Text style={styles.text}>
                    Con una intensidad de{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {certificate.levelHours} Horas.
                    </Text>{" "}
                  </Text>
                </View>
                <Text style={styles.text}>
                  La presente capacitación y entrenamiento se realizó en
                  Barranquilla
                  {certificate.courseName === "Trabajo en altura" &&
                  (certificate.levelName?.toLowerCase() === "autorizado" ||
                    certificate.levelName?.toLowerCase() === "coordinador") &&
                  certificate.startDate !== certificate.certificateDate &&
                  certificate.startDate ? (
                    <Text>
                      {" "}
                      del {formatDateOf(certificate.startDate)} hasta{" "}
                      {formatDateOf(certificate.certificateDate)}
                    </Text>
                  ) : (
                    <Text> el {formatDateOf(certificate.certificateDate)}</Text>
                  )}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    marginTop: 15,
                  }}
                >
                  Se expide en Barranquilla a los{" "}
                  {certificate.expeditionDate &&
                    formatDateCert(certificate.expeditionDate)}
                  {certificate.dueDate && formatDateOf(certificate.dueDate)
                    ? `, con reentrenamiento mínimo programado para el ${
                        certificate.dueDate && formatDateOf(certificate.dueDate)
                      }`
                    : "."}
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  width: "95%",
                  height: 100,
                  gap: 5,
                  marginTop: 50,
                }}
              >
                {(certificate.courseName === "Trabajo en altura" ||
                  certificate.courseName === "Espacios confinados") &&
                certificate.coachName &&
                certificate.coachImgSignatureUrl &&
                certificate.coachPosition ? (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      paddingTop: 32,
                    }}
                  >
                    {certificate.coachImgSignatureUrl && (
                      <Image
                        src={certificate.coachImgSignatureUrl}
                        style={{
                          width: 110,
                          position: "absolute",
                          top: -25,
                          left: 15,
                        }}
                      />
                    )}
                    <Text
                      style={{
                        minWidth: 150,
                        borderTop: "1px solid #a30e0c",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    >
                      {capitalize(certificate.coachName)}
                    </Text>
                    <Text style={{ fontSize: 10 }}>
                      {capitalize(certificate.coachPosition)}
                    </Text>
                    {certificate.coachLicence && (
                      <Text style={{ fontSize: 10 }}>
                        {certificate.coachLicence &&
                          capitalize(certificate.coachLicence)}
                      </Text>
                    )}
                  </View>
                ) : (
                  <View style={{ display: "none" }} />
                )}

                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    paddingTop: 32,
                  }}
                >
                  <Image
                    src="/JAIME_R.png"
                    style={{
                      width: 140,
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                  <Text
                    style={{
                      minWidth: 150,
                      borderTop: "1px solid #a30e0c",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    Jaime Rosales Rodríguez
                  </Text>
                  <Text style={{ fontSize: 10 }}>Representante legal</Text>
                  {certificate.courseName === "Trabajo en altura" ||
                  certificate.courseName === "Espacios confinados" ? (
                    <Text style={{ fontSize: 10 }}> </Text>
                  ) : (
                    <View />
                  )}
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  {baseUrl ? (
                    <Link src={fileUrl}>
                      <Image
                        style={{ width: 80, height: 80 }}
                        src={QRCode.toDataURL(fileUrl)}
                      />
                    </Link>
                  ) : (
                    <View />
                  )}
                  <View style={{ display: "flex", flexDirection: "column" }}>
                    <Text style={{ fontSize: 7, textAlign: "right" }}>
                      Para verificar el presente documento, escanear el código
                      QR.
                    </Text>
                    <Text style={{ fontSize: 7, textAlign: "right" }}>
                      {" "}
                      También al correo info@grupohseq.com
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
const styles = StyleSheet.create({
  page: {
    fontFamily: "Open Sans",
    backgroundColor: "#fff",
    padding: 15,
    position: "relative",
  },
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 5,
  },
  sideContent: {
    display: "flex",
    flexDirection: "column",
    width: "15%",
    height: "85%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    marginTop: 48,
    paddingTop: 10,
  },
  textMain: {
    width: "350px",
    height: "80px",
    backgroundColor: "#a30e0c",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    textAlign: "left",
    color: "white",
    transform: "rotate(-90deg)",
    padding: "18px",
    paddingTop: "10px",
    fontSize: 19,
    gap: 10,
  },
  textContent: {
    width: "80%",
    height: "95%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    marginVertical: "5px",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 9,
    marginBottom: 10,
    color: "gray",
  },
  text: {
    fontSize: 11,
    marginBottom: 5,
    color: "#444749",
    lineHeight: "1.3px",
  },
});
