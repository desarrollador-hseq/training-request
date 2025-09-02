"use client";

import { capitalize } from "@/lib/utils";
import { Text, View, Image, Font, Styles } from "@react-pdf/renderer";

interface CertificateTemplateProps {
  imageUrl?: string | null;
  name: string;
  position: string;
  licence?: string | null;
  imgStyle?: any;
}

export const DocumentSignatureCertificate = ({
  imageUrl,
  name,
  position,
  licence,
  imgStyle,
}: CertificateTemplateProps) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        paddingTop: 32,
        maxWidth: "170px",
        width: "100%",
      }}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          style={{
            width: 110,
            position: "absolute",
            top: -25,
            left: 25,
            margin: "0 auto",
            ...imgStyle,
          }}
        />
      )}

      <Text
        style={{
          width: "100%",
          fontSize: 10,
          lineHeight: 1,
          paddingTop: 4,
          borderTop: "1px solid #0F1729",
          textAlign: "center",
        }}
      >
        {capitalize(position)}
      </Text>
      <Text
        style={{
          minWidth: 150,
          width: "100%",
          fontSize: 10,
          fontWeight: "bold",
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        {capitalize(name)}
      </Text>

      {licence && (
        <Text
          style={{
            fontSize: 10,
            lineHeight: 1,
            width: "100%",
            textAlign: "center",
          }}
        >
          {licence && capitalize(licence)}
        </Text>
      )}
    </View>
  );
};
