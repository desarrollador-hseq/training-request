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
import { DocumentSignatureCertificate } from "./document-signature-certificate";

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

interface CertificateTemplateProps {
  fileUrl?: string | null;
  arlName?: string | null;
  companyName?: string | null;
  companyNit?: string | null;
  legalRepresentative?: string | null;
  certificateId?: string | null;
  // consecutive: string | null;
  fullname: string | null;
  numDoc: string | null;
  typeDoc: string | null;
  level: string | null;
  course: string | null;
  resolution?: string | null;
  levelHours: string | null;

  coachName?: string | null;
  coachPosition?: string | null;
  coachLicence?: string | null;
  coachImgSignatureUrl?: string | null;

  endDate: string;
  expeditionDate: string | null;
  expireDate?: string | null;
}

export const DocumentCertificateTemplate = ({
  fileUrl,
  arlName,
  companyName,
  companyNit,
  legalRepresentative,
  fullname,
  numDoc,
  typeDoc,
  level,
  course,
  resolution,
  levelHours,

  coachName,
  coachPosition,
  coachLicence,
  coachImgSignatureUrl,

  expeditionDate,
  endDate,
  expireDate,
}: CertificateTemplateProps) => {
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
      <Page size="A4" style={styles.page}>
        <View
          style={{
            width: "100%",
            height: "95%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <View style={styles.container}>
            {/* 1column  */}
            <View style={styles.sideContent}>
              <View style={{ marginVertical: 17 }}></View>
              <View style={styles.textMain}>
                <Text style={{ fontWeight: "semibold" }}>
                  {" "}
                  CERTIFICACIÓN DE CAPACITACIÓN{" "}
                </Text>
                <Text style={{ fontWeight: "semibold" }}> Y ENTRENAMIENTO</Text>
              </View>
              <View style={{ margin: 15 }}></View>

              <Image source={`/hseq.png`} />
            </View>
            {/* 2 column  */}
            <View style={styles.textContent}>
              <View>
                <Image
                  style={styles.logoTraining}
                  source={`/hseq-entrenamiento.png`}
                />
                <View style={{ marginBottom: 15 }}>
                  <Text>
                    <Text
                      style={{
                        color: "#525659",
                        fontWeight: "semibold",
                        fontSize: 9,
                      }}
                    >
                      HSEQ Consultoría en Gestión Integral de Riesgos S.A.S,
                    </Text>{" "}
                    <Text style={styles.subtitle}>
                      NIT 900607813-2, con licencia en SST 560 de 2023,
                      certificación NTC 6072 Icontec CS-CER602230 fecha de
                      aprobación y vencimiento del 01 de junio de 2018 al 31 de
                      mayo de 2024 respectivamente y aprobación del
                    </Text>
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
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    marginBottom: 5,
                  }}
                >
                  Certifica que
                </Text>
                <View style={{ marginBottom: 15 }}>
                  <View
                    style={{
                      borderBottom: "2px solid #a30e0c",
                      marginBottom: 3,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "black",
                        textTransform: "uppercase",
                      }}
                    >
                      {fullname}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      marginBottom: 5,
                      color: "#444749",
                    }}
                  >
                    Con <Text style={{ fontWeight: "bold" }}>{typeDoc}</Text>.{" "}
                    <Text style={{ fontWeight: "bold" }}>{numDoc}</Text>
                  </Text>
                </View>

                {arlName &&
                  companyName &&
                  companyNit &&
                  legalRepresentative && (
                    <Text style={{ ...styles.text, marginBottom: 10 }}>
                      Afiliado a la ARL{" "}
                      <Text style={{ fontWeight: "semibold" }}>{arlName}</Text>{" "}
                      contratado por{" "}
                      <Text style={{ fontWeight: "semibold" }}>
                        {companyName}
                      </Text>{" "}
                      registrada bajo NIT{" "}
                      <Text style={{ fontWeight: "semibold" }}>
                        {companyNit}
                      </Text>
                      , representante legal{" "}
                      <Text style={{ fontWeight: "semibold" }}>
                        {legalRepresentative}
                      </Text>
                      .
                    </Text>
                  )}

                <Text style={styles.text}>
                  Asistió y aprobó la acción de capacitación y entrenamiento en
                  nivel
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {level}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {course}
                </Text>
                {resolution && (
                  <Text style={{ ...styles.text, fontSize: 10 }}>
                    {resolution}
                  </Text>
                )}
                <View style={{ marginBottom: 15 }}>
                  <Text style={styles.text}>
                    Con una intensidad de{" "}
                    <Text style={{ fontWeight: "bold" }}>{levelHours}</Text>{" "}
                    Horas.
                  </Text>
                </View>
                <Text style={styles.text}>
                  La presente capacitación y entrenamiento se realizó en
                  Barranquilla el {endDate}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    marginTop: 15,
                  }}
                >
                  Se expide en Barranquilla a los {expeditionDate}
                  {expireDate
                    ? `, con reentrenamiento mínimo programado para el ${expireDate}`
                    : "."}
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "80%",
                }}
              >
                {coachName && coachImgSignatureUrl && coachPosition && (
                  <DocumentSignatureCertificate
                    licence={coachLicence}
                    name={coachName}
                    position={coachPosition}
                    imageUrl={coachImgSignatureUrl}
                  />
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
                      borderTop: "1px solid #a30e0c",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    Jaime Rosales Rodríguez
                  </Text>
                  <Text style={{ fontSize: 10 }}>Representante legal</Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              textAlign: "center",
            }}
          >
            {fileUrl && (
              <Link src={fileUrl}>
                <Image
                  style={{ width: 80, height: 80 }}
                  src={QRCode.toDataURL(fileUrl)}
                />
              </Link>
            )}

            {/* <Text style={{ fontWeight: "semibold" }}>
              N° de verificación:
              {certificateId && (
                <View>
                  <Text style={{ fontWeight: "bold" }}>{certificateId}</Text>
                  {consecutive && (
                    <Text style={{ fontWeight: "light" }}>@{consecutive}</Text>
                  )}
                </View>
              )}
            </Text> */}
            <Text style={{}}>
              Para verificar el presente documento, escanear el código QR.
              También al correo info@grupohseq.com
            </Text>
            <Text style={{}}>
              tel. (605) 3662030 - (605) 3851821 - 3145468721 - 3235824200{" "}
            </Text>
            <Text style={{}}>Calle 30 # 10-230 L. 1 y Bodega interna 33</Text>
            <Text style={{}}>Barranquilla - Atlántico</Text>
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
    padding: 20,
  },
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  sideContent: {
    display: "flex",
    flexDirection: "column",
    width: "25%",
    height: "75%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    marginTop: 10,
    paddingTop: 10,
  },
  textMain: {
    width: "340px",
    height: "70px",
    backgroundColor: "#a30e0c",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    textAlign: "left",
    color: "white",
    transform: "rotate(-90deg)",
    padding: "18px",
    paddingTop: "10px",
  },
  textContent: {
    width: "80%",
    height: "93%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "space-around",
    marginVertical: "10px",
  },
  logoTraining: {
    width: "160px",
    height: "auto",
    marginBottom: 5,
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
