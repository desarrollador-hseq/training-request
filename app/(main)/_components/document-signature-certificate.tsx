"use client";

import { capitalize } from "@/lib/utils";
import {
  Text,
  View,
  Image,
  Font,
} from "@react-pdf/renderer";

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
 imageUrl: string;
 name: string;
 position: string;
 licence?: string | null;
}

export const DocumentSignatureCertificate = ({
imageUrl,
name,
position,
licence
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
          paddingTop: 35,
        }}
      >
        <Image
          src={imageUrl}
          style={{
            width: 110,
            position: "absolute",
            top: -25,
            left: 15,
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
         {capitalize(name)}
        </Text>
        <Text style={{ fontSize: 10 }}>{capitalize(position)}</Text>
        {licence && <Text style={{ fontSize: 10 }}>{capitalize(licence)}</Text>}
      </View>
    </View>
  );
};
