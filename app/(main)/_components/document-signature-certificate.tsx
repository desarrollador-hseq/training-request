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
        width: "200px",
        minHeight: "120px",
        position: "relative",
      }}
    >
      {/* Fixed-size container for signature image with absolute positioning */}
      <View
        style={{
          width: "150px",
          height: "60px",
          position: "relative",
        }}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            style={{
              width: "100%",
              height: "60px",
              objectFit: "contain",
              position: "absolute",
              top: "20px", // Aumentado para posicionar la imagen mucho más arriba
              left: "0",
              bottom: "0",
              ...imgStyle,
            }}
          />
        )}
      </View>

      {/* Horizontal line below signature */}
      <View
        style={{
          width: "150px",
          height: "1px",
          backgroundColor: "#000",
          marginBottom: "1px",
        }}
      />

      {/* Position text */}
      <Text
        style={{
          fontSize: "10px",
          color: "#0F1729",
          textAlign: "center",
          marginBottom: "3px",
          lineHeight: 1,
        }}
      >
        {capitalize(position)}
      </Text>

      {/* Name text - larger and bolder */}
      <Text
        style={{
          fontSize: "12px",
          fontWeight: "bold",
          color: "#0F1729",
          textAlign: "center",
          marginBottom: "3px",
          lineHeight: 1,
        }}
      >
        {capitalize(name)}
      </Text>

      {/* Licence/Company text */}
      {licence && (
        <Text
          style={{
            fontSize: "10px",
            color: "#0F1729",
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          {capitalize(licence)}
        </Text>
      )}
    </View>
  );
};
