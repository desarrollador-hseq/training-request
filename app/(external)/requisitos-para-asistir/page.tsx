import { SubtitleSeparator } from "@/components/subtitle-separator";
import { CardContent } from "@/components/ui/card";
import Image from "next/image";

const RequirementsPage = () => {
  return (
    <div className="mx-auto w-full">
      <SubtitleSeparator text="Requisitos de asistencia a cursos" />
      <CardContent className="mt-1 min-h-screen max-w-[1500px] w-auto flex justify-center">
       <Image
        src={"/requisitos-asistencia.jpeg"}
        alt=""
        width={600}
        height={600}
        
        priority
        style={{
          width: "auto",
          minWidth: 630,
          height: "auto"
        }}
       />
      </CardContent>
    </div>
  );
};

export default RequirementsPage;
