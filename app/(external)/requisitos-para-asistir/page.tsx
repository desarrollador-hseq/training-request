import { SubtitleSeparator } from "@/components/subtitle-separator";
import { CardContent } from "@/components/ui/card";
import Image from "next/image";

const RequirementsPage = () => {
  return (
    <div className="mx-auto w-full">
      <SubtitleSeparator text="Requisitos de asistencia a cursos" />
      <CardContent className="mt-1 min-h-screen max-w-[1500px] w-auto ">
       <Image
        src={"/requisitos-asistencia.jpeg"}
        alt=""
        width={1000}
        
        style={{
          width: "auto",
          height: "auto"
        }}
       />
      </CardContent>
    </div>
  );
};

export default RequirementsPage;
