"use client";

import {
  Document,
  Page,
  Text,
  PDFViewer,
  StyleSheet,
  View,
  Image,
  Font,
  Link,
} from "@react-pdf/renderer";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn, formatDateOf } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
    paddingRight: 8,
  },
  sideContent: {
    display: "flex",
    flexDirection: "column",
    width: "25%",
    height: "80%",
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
    justifyContent: "flex-end",
    alignItems: "flex-start",
    textAlign: "left",
    color: "white",
    transform: "rotate(-90deg)",
    padding: "18px",
  },
  textContent: {
    width: "80%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignContent: "space-around",
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

const CertificateTemplate = ({
  name,
  numDoc,
  typeDoc,
  endDate,
  expireDate,
  nivel,
  curso,
  levelHours,
  certificateId,
  resolution,
  fileUrl,
  consecutive,
}: any) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState<boolean>(false);

  const handleChange = (e: boolean) => {
    console.log({ e });
    if (!date) return;
    setOpen(e);
  };

  useEffect(() => {
    setOpen(false);
  }, [date]);

  const typeDocument: Record<string, { label: string }> = {
    CC: { label: "Cédula de ciudadanía" },
    CE: { label: "Cédula de extranjería" },
    TI: { label: "Tarjeta de identidad" },
  };

  return (
    <div>
      <Popover open={open} onOpenChange={(e) => handleChange(!open)}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              formatDateOf(date)
            ) : (
              <span>Cambiar fecha de expedición</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          {date ? (
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          ) : (
            <div className="p-4">Please pick a date</div>
          )}
        </PopoverContent>
      </Popover>
      <PDFViewer style={{ width: "100%", height: "1200px" }}>
        <Document>
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
                  <View style={{ marginVertical: 36 }}></View>
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
                  <View style={{ margin: 15 }}></View>

                  <Image source={`/hseq.png`} />
                  {/* <Image style={{ width: 80, height: 80 }} source={`/qr.png`} /> */}
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
                          aprobación y vencimiento del 01 de junio de 2018 al 31
                          de mayo de 2024 respectivamente y aprobación del
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
                    <View>
                      <View
                        style={{
                          borderBottom: "2px solid #a30e0c",
                          marginBottom: 3,
                        }}
                      >
                        <Text style={{ fontSize: 18, fontWeight: "black" }}>
                          {name}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          marginBottom: 10,
                          color: "#444749",
                        }}
                      >
                        Con {typeDocument[typeDoc].label || "documento "}{" "}
                        <Text style={{ fontWeight: "bold" }}>{numDoc}</Text>
                      </Text>
                    </View>
                    <Text style={styles.text}>
                      Asistió y aprobó la acción de capacitación y entrenamiento
                      en nivel
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {nivel}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {curso}
                    </Text>
                    <Text style={{ ...styles.text, fontSize: 10 }}>
                      {resolution}
                    </Text>
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
                      Se expide en Barranquilla a los {formatDateOf(date!)}, con
                      reentrenamiento mínimo programado para el {expireDate}
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
                    <View style={{ display: "flex", flexDirection: "column" }}>
                      <Text
                        style={{
                          borderTop: "1px solid red",
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        Nestor Torrejano Mendoza
                      </Text>
                      <Text style={{ fontSize: 10 }}>Entrenador TSA</Text>
                      <Text style={{ fontSize: 10 }}>
                        Lic. En SST No. 5596 - 2014
                      </Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "column" }}>
                      <Text
                        style={{
                          borderTop: "1px solid red",
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
                <Link src={fileUrl}>
                  <Image
                    style={{ width: 80, height: 80 }}
                    src={QRCode.toDataURL(fileUrl)}
                  />
                </Link>

                <Text style={{ fontWeight: "semibold" }}>
                  N° de verificación:
                  <Text style={{ fontWeight: "bold" }}>{certificateId}</Text>
                  <Text style={{ fontWeight: "light" }}>@{consecutive}</Text>
                </Text>
                <Text style={{}}>
                  La autenticidad de este certificado puede ser verificado al
                  correo info@grupohseq.com tel. 3662030.
                  3851821-3145468721-3235824200 o en la Pag. www.grupohseq.com
                </Text>
                <Text style={{}}>
                  Calle 30 # 10-230 L. 1 y Bodega interna 33
                </Text>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};

export default CertificateTemplate;
