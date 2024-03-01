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

export const DocumentCertificateTemplateCues = ({
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
      <Page orientation="landscape" style={styles.page}>
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
                <Image style={styles.logoCues} source={`/cues-logo.jpg`} />
                <View style={{ }}>
              
                    <Text
                      style={{
                        color: "#525659",
                        fontWeight: "bold",
                        fontSize: 18,
                        textAlign: "center"
                      }}
                    >
                      EL GRUPO HSEQ EN ALIANZA CON LA CORPORACION UNIVERSITARIA
                      EMPRESARIAL DE SALAMANCA
                    </Text>{" "}
                    <Text style={{textAlign: "center", fontWeight: "bold",   }}>
                    Aprobada según Resolución 3062 de 1999-12-02 expedida por el Ministerio de Educación Superior
                    </Text>
                 
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    marginBottom: 5,
                  }}
                >
                  CERTIFICA QUE
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
                    marginTop: 10,
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
                  <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                    {resolution}
                  </Text>
                )}
                <View style={{ marginBottom: 15, marginTop: 10 }}>
                  <Text style={styles.text}>
                    Con una intensidad de{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {levelHours} Horas.
                    </Text>{" "}
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
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  width: "95%",
                  gap: 30,
                  marginTop: 50,
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
                      minWidth: 150,
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
    position: "relative",
    
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
    width: "15%",
    height: "80%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    marginTop: 48,
    paddingTop: 10,
  },
  textMain: {
    width: "440px",
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
    fontSize: 23,
    gap: 10,
  },
  textContent: {
    width: "95%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    marginVertical: "5px",
  },
  logoCues: {
    width: 80,
    height: 100,
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