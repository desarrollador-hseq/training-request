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

export const DocumentCertificateTemplateCues = ({
  fileUrl,
  fullname,
  numDoc,
  typeDoc,
  course,
  levelHours,
  expeditionDate,
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
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <View style={styles.container}>
            {/* 1column  */}
            {/* <View style={styles.sideContent}>
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
            </View> */}
            {/* 2 column  */}
            <View style={styles.textContent}>
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    width: "50%",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    marginBottom: 30,
                  }}
                >
                  <Image
                    style={{
                      width: 140,
                      height: 56,
                    }}
                    source={`/hseq-sin-b.png`}
                  />
                  <Image
                    style={{
                      width: 170,
                      height: 80,
                    }}
                    source={`/cues-logo.png`}
                  />
                </View>
                <View
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    textAlign: "center",
                    marginBottom: 15,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Text style={{}}>EL GRUPO HSEQ EN ALIANZA CON</Text>{" "}
                  <Text>
                    LA CORPORACIÓN UNIVERSITARIA EMPRESARIAL DE SALAMANCA
                  </Text>
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "semibold",
                    fontSize: 13,
                    marginBottom: 20,
                    color: "#444749",
                  }}
                >
                  Aprobada bajo Resolución 3062 de 1999-12-02, expedida por el
                  Ministerio de Educación Superior
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    marginBottom: 5,
                  }}
                >
                  Certifica que:
                </Text>
                <View
                  style={{
                    marginBottom: 5,
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "black",
                      textTransform: "uppercase",
                      marginBottom: 12,
                    }}
                  >
                    {fullname}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      marginBottom: 10,
                      color: "#444749",
                      textAlign: "center",
                    }}
                  >
                    Con <Text style={{ fontWeight: "bold" }}>{typeDoc}</Text>.{" "}
                    <Text style={{ fontWeight: "bold" }}>{numDoc}</Text>
                  </Text>
                </View>
                <Text style={{ color: "#444749", fontSize: 13 }}>
                  Asistió y aprobó la acción de formación al
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: 10,
                    fontSize: 16,
                    marginTop: 10,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    gap: 5,
                  }}
                >
                  <Text>CURSO BÁSICO OBLIGATORIO PARA LOS CONDUCTORES</Text>
                  <Text>
                    {" "}
                    QUE TRANSPORTAN MERCANCIAS PELIGROSAS, SEGÚN RESOLUCIóN 1223
                    DE 2014
                  </Text>
                </View>
                <View
                  style={{
                    marginBottom: 25,
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "#444749",
                    lineHeight: "1.3px",
                  }}
                >
                  <Text>
                    Con una intensidad de{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {levelHours} Horas.
                    </Text>{" "}
                  </Text>
                  <Text
                    style={{
                      maxWidth: 580,
                      textAlign: "center",
                    }}
                  >
                    En testimonio de lo anterior, se firma y autoriza en
                    Barranquilla a los {expeditionDate}
                    {expireDate
                      ? `, con actualización minima programada para el ${expireDate}`
                      : "."}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  width: "70%",
                  gap: 30,
                  marginVertical: 15,
                  marginHorizontal: "auto",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    paddingTop: 42,
                  }}
                >
                  <Image
                    src="/JAIME_R.png"
                    style={{
                      width: 160,
                      position: "absolute",
                      top: 5,
                      left: 0,
                    }}
                  />
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      fontSize: 12,
                      fontWeight: "bold",
                      minWidth: 150,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        borderTop: "1px solid #111",
                      }}
                    >
                      Jaime Rosales Rodríguez
                    </Text>
                    <Text style={{ fontWeight: "normal", fontSize: 10 }}>
                      Director de Operaciones centro de entrenamiento
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  {fileUrl && (
                    <Link src={fileUrl}>
                      <Image
                        style={{ width: 80, height: 80, alignSelf: "flex-end" }}
                        src={QRCode.toDataURL(fileUrl)}
                      />
                    </Link>
                  )}
                  <Text style={{ fontSize: 8, textAlign: "right" }}>
                    Para verificar el presente documento, escanea el código QR.
                  </Text>
                  <Text style={{ fontSize: 8, textAlign: "right" }}>
                    También en el sitio web del Ministerio de Transporte:
                  </Text>
                  <Text style={{ fontSize: 8, textAlign: "right" }}>
                    https://web.mintransporte.gov.co/sisconmp2/ConsultasCapacitaciones
                  </Text>
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
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    marginVertical: "5px",
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
