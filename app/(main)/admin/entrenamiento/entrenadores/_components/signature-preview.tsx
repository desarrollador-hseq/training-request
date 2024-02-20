"use client";

import { DocumentSignatureCertificate } from "@/app/(main)/_components/document-signature-certificate";
import { Document, Font, Page, View } from "@react-pdf/renderer";

interface SignaturePreviewProps {
  name: string;
  position: string;
  licence?: string;
  imgSignatureUrl?: string | null;
}

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

export const SignaturePreview = ({
  name,
  position,
  licence,
  imgSignatureUrl,
}: SignaturePreviewProps) => {
  return (
    <Document style={{ height: "100%", width: "100%" }} language="es" >
      <Page orientation="landscape" size="A7" style={{ backgroundColor: "#fff", padding: 20, fontFamily: "Open Sans" }}>
        <View
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 10,
          }}
        >
          <DocumentSignatureCertificate
            imageUrl={imgSignatureUrl}
            name={name}
            position={position}
            licence={licence}
          />
        </View>
      </Page>
    </Document>
  );
};
