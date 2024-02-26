"use client";

import { capitalize } from "@/lib/utils";
import { Text, View, Image, Font } from "@react-pdf/renderer";

interface CertificateTemplateProps {
  imageUrl?: string | null;
  name: string;
  position: string;
  licence?: string | null;
}

export const DocumentSignatureCertificate = ({
  imageUrl,
  name,
  position,
  licence,
}: CertificateTemplateProps) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          paddingTop: 32,
        }}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
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
          {capitalize(name)}
        </Text>
        <Text style={{ fontSize: 10 }}>{capitalize(position)}</Text>
        {licence && (
          <Text style={{ fontSize: 10 }}>{licence && capitalize(licence)}</Text>
        )}
      </View>
    </View>
  );
};
